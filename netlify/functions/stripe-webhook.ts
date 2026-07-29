import type { Handler, HandlerEvent } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-02-24.acacia' });

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Stripe signature verification requires the raw, unmodified body.
  // Netlify may base64-encode binary payloads; decode if necessary.
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body ?? '', 'base64').toString('utf8')
    : (event.body ?? '');
  const sig = event.headers['stripe-signature'];

  if (!sig) {
    console.error('[webhook] Missing stripe-signature header');
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing stripe-signature' }) };
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET is not set');
    return { statusCode: 500, body: JSON.stringify({ error: 'Webhook not configured' }) };
  }

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err);
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid signature' }) };
  }

  console.log('[webhook] Received event:', stripeEvent.type, stripeEvent.id);

  if (stripeEvent.type !== 'checkout.session.completed') {
    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  }

  const session = stripeEvent.data.object as Stripe.Checkout.Session;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Idempotency check — but also handle the case where the order exists yet
  // order_items is empty (e.g. a previous attempt created the order but then
  // failed on the items insert and returned 500 so Stripe retried).
  const { data: existing } = await supabase
    .from('orders')
    .select('id, order_items(id)')
    .eq('stripe_session_id', session.id)
    .single();

  if (existing) {
    const hasItems = Array.isArray((existing as { order_items?: { id: string }[] }).order_items) &&
      (existing as { order_items?: { id: string }[] }).order_items!.length > 0;
    if (hasItems) {
      return { statusCode: 200, body: JSON.stringify({ received: true, skipped: 'duplicate' }) };
    }
    // Order exists but items are missing — fall through to re-insert items only
  }

  let shippingAddress: Record<string, string> = {};
  try {
    shippingAddress = JSON.parse(session.metadata?.shipping_address ?? '{}');
  } catch { /* ignore */ }

  // Primary: parse items from metadata (set by stripe-checkout function)
  let orderItems: Array<{ product_id: string; quantity: number; unit_price: number }> = [];
  try {
    const parsed = JSON.parse(session.metadata?.items ?? '[]');
    if (Array.isArray(parsed) && parsed.length > 0) {
      orderItems = parsed;
    }
  } catch { /* ignore */ }

  // Fallback: expand line items from Stripe API (in case metadata was not set)
  if (orderItems.length === 0) {
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product'],
    });
    orderItems = lineItems.data
      .filter((item) => {
        const product = item.price?.product as Stripe.Product | undefined;
        return product?.metadata?.product_id;
      })
      .map((item) => {
        const product = item.price?.product as Stripe.Product;
        return {
          product_id: product.metadata.product_id,
          quantity: item.quantity ?? 1,
          unit_price: item.price?.unit_amount ?? 0,
        };
      });
  }

  const email = session.customer_email ?? session.metadata?.email ?? '';
  const subtotal = orderItems.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  const shippingCost = (session.shipping_cost?.amount_total ?? 0) as number;
  const total = subtotal + shippingCost;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  // Insert order only if it doesn't already exist (existing → retry path, items missing)
  let orderId: string;
  if (existing) {
    orderId = (existing as { id: string }).id;
  } else {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: profile?.id ?? null,
        guest_email: profile ? null : email,
        status: 'paid',
        subtotal,
        shipping_cost: shippingCost,
        total,
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_session_id: session.id,
        shipping_address: shippingAddress,
      })
      .select('id')
      .single();

    if (orderError || !order) {
      console.error('[webhook] Failed to create order:', orderError);
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to create order' }) };
    }
    orderId = order.id;
  }

  if (orderItems.length > 0) {
    const itemRows = orderItems.map((i) => ({ ...i, order_id: orderId }));
    const { error: itemsError } = await supabase.from('order_items').insert(itemRows);
    if (itemsError) {
      console.error('[webhook] Failed to insert order_items:', itemsError.message, itemsError.details, 'rows:', JSON.stringify(itemRows));
      // Return 500 so Stripe retries the webhook instead of silently losing items.
      // The idempotency check above will skip re-creating the order on retry,
      // but we need to handle the case where order exists but items are missing.
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to insert order items' }) };
    }
    console.log('[webhook] Inserted', itemRows.length, 'order_items for order', orderId);
  } else {
    console.warn('[webhook] No orderItems found in metadata or line items for session', session.id);
  }

  console.log('[webhook] Order created/recovered:', orderId);
  return { statusCode: 200, body: JSON.stringify({ received: true, orderId }) };
};
