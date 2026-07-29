import type { Handler, HandlerEvent } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-02-24.acacia' });

const TRUSTED_PRODUCTS: Record<string, { name: string; price: number; stock: number; is_active: boolean }> = {
  'b1f1a000-0000-4000-a000-000000000001': { name: 'Rose Car Air Freshener',      price: 1799, stock: 100, is_active: true },
  'b1f1a000-0000-4000-a000-000000000002': { name: 'Lavender Car Air Freshener',   price: 1799, stock: 100, is_active: true },
  'b1f1a000-0000-4000-a000-000000000003': { name: 'Millennium Car Air Freshener', price: 1799, stock: 100, is_active: true },
};

const SHIPPING_COST = 499;
const FREE_SHIPPING_THRESHOLD = 3000;

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body: unknown;
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { items, shipping, email } = body as {
    items: Array<{ product: { id: string; name: string; price: number; slug: string }; quantity: number }>;
    shipping: {
      full_name: string;
      street_line_1: string;
      street_line_2?: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    email: string;
  };

  if (!items?.length || !shipping || !email) {
    return { statusCode: 422, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  // Validate products against DB (fallback to trusted list)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const productIds = items.map((i) => i.product.id);
  const { data: dbProducts } = await supabase
    .from('products')
    .select('id, name, price, stock, is_active')
    .in('id', productIds);

  const validated: Record<string, { id: string; name: string; price: number; stock: number; is_active: boolean }> = {};
  for (const id of productIds) {
    const fromDb = dbProducts?.find((p) => p.id === id);
    const fromStatic = TRUSTED_PRODUCTS[id];
    if (fromDb) validated[id] = fromDb;
    else if (fromStatic) validated[id] = { id, ...fromStatic };
  }

  for (const item of items) {
    const product = validated[item.product.id];
    if (!product || !product.is_active) {
      return { statusCode: 400, body: JSON.stringify({ error: `Product "${item.product.name}" is no longer available` }) };
    }
    if (product.stock < item.quantity) {
      return { statusCode: 400, body: JSON.stringify({ error: `Insufficient stock for "${item.product.name}"` }) };
    }
  }

  const subtotal = items.reduce((sum, item) => sum + validated[item.product.id].price * item.quantity, 0);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'cad',
      product_data: {
        name: validated[item.product.id].name,
        metadata: { product_id: item.product.id },
      },
      unit_amount: validated[item.product.id].price,
    },
    quantity: item.quantity,
  }));

  // Use the X-Origin header sent explicitly by the Angular app so that
  // local dev always redirects back to localhost instead of the production URL.
  // Netlify CLI injects URL=<prod-url> even during local dev, so env vars
  // alone are unreliable. The Angular client knows its own origin for certain.
  const siteUrl =
    event.headers['x-origin'] ||
    event.headers['origin'] ||
    process.env.SITE_URL ||
    process.env.URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:4200';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: email,
      shipping_options: shippingCost > 0
        ? [{ shipping_rate_data: { type: 'fixed_amount', fixed_amount: { amount: shippingCost, currency: 'cad' }, display_name: 'Standard Shipping' } }]
        : [{ shipping_rate_data: { type: 'fixed_amount', fixed_amount: { amount: 0, currency: 'cad' }, display_name: 'Free Shipping' } }],
      metadata: {
        email,
        shipping_address: JSON.stringify(shipping),
        // Stored so the webhook can reliably rebuild order_items without relying on Stripe's expand
        items: JSON.stringify(
          items.map((i) => ({
            product_id: i.product.id,
            quantity: i.quantity,
            unit_price: validated[i.product.id].price,
          })),
        ),
      },
      success_url: `${siteUrl}/order-confirmation/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error('[stripe-checkout]', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to create checkout session' }) };
  }
};
