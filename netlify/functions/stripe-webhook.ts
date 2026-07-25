import type { Handler, HandlerEvent } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-11-20.acacia' });

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const body = event.body ?? '';
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
    stripeEvent = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
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

  // Idempotency check
  const { data: existing } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_session_id', session.id)
    .single();

  if (existing) {
    return { statusCode: 200, body: JSON.stringify({ received: true, skipped: 'duplicate' }) };
  }

  let shippingAddress: Record<string, string> = {};
  try {
    shippingAddress = JSON.parse(session.metadata?.shipping_address ?? '{}');
  } catch { /* ignore */ }

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ['data.price.product'],
  });

  const orderItems = lineItems.data
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

  const email = session.customer_email ?? session.metadata?.email ?? '';
  const subtotal = orderItems.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  const shippingCost = (session.shipping_cost?.amount_total ?? 0) as number;
  const total = subtotal + shippingCost;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

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

  if (orderItems.length > 0) {
    const itemRows = orderItems.map((i) => ({ ...i, order_id: order.id }));
    await supabase.from('order_items').insert(itemRows);
  }

  console.log('[webhook] Order created:', order.id);
  return { statusCode: 200, body: JSON.stringify({ received: true, orderId: order.id }) };
};
