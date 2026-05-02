import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createServiceClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Missing STRIPE_WEBHOOK_SECRET')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session

  // Idempotency: check if order already exists
  const supabase = createServiceClient()
  const { data: existing } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_session_id', session.id)
    .single()

  if (existing) {
    return NextResponse.json({ received: true, skipped: 'duplicate' })
  }

  // Parse shipping address from metadata
  let shippingAddress: Record<string, string> = {}
  try {
    shippingAddress = JSON.parse(session.metadata?.shipping_address ?? '{}')
  } catch {
    console.error('Failed to parse shipping address from metadata')
  }

  // Retrieve line items to reconstruct order
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ['data.price.product'],
  })

  // Map line items to product IDs
  const orderItems = lineItems.data
    .filter((item) => {
      const product = item.price?.product as Stripe.Product | undefined
      return product?.metadata?.product_id
    })
    .map((item) => {
      const product = item.price?.product as Stripe.Product
      return {
        product_id: product.metadata.product_id,
        quantity: item.quantity ?? 1,
        unit_price: item.price?.unit_amount ?? 0,
      }
    })

  const email = session.customer_email ?? session.metadata?.email ?? ''
  const subtotal = orderItems.reduce((s, i) => s + i.unit_price * i.quantity, 0)
  const shippingCost = (session.shipping_cost?.amount_total ?? 0) as number
  const total = subtotal + shippingCost

  // Resolve user_id if customer has an account
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  // Insert order
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
    .single()

  if (orderError || !order) {
    console.error('Failed to create order:', orderError)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }

  // Insert order items
  if (orderItems.length > 0) {
    const { error: itemsError } = await supabase.from('order_items').insert(
      orderItems.map((item) => ({
        order_id: order.id,
        ...item,
      })),
    )

    if (itemsError) {
      console.error('Failed to create order items:', itemsError)
      // Order was created — log but don't fail the webhook
    }
  }

  return NextResponse.json({ received: true, order_id: order.id })
}
