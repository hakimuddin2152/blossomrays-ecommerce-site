import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Known products — server-side trusted price list for when DB is unavailable
const TRUSTED_PRODUCTS: Record<string, { name: string; price: number; stock: number; is_active: boolean }> = {
  'b1f1a000-0000-4000-a000-000000000001': { name: 'Rose Car Air Freshener',       price: 1799, stock: 100, is_active: true },
  'b1f1a000-0000-4000-a000-000000000002': { name: 'Lavender Car Air Freshener',    price: 1799, stock: 100, is_active: true },
  'b1f1a000-0000-4000-a000-000000000003': { name: 'Millennium Car Air Freshener',  price: 1799, stock: 100, is_active: true },
}

const CheckoutSchema = z.object({
  items: z.array(
    z.object({
      product: z.object({
        id: z.string().min(1),
        name: z.string(),
        price: z.number().int().positive(),
        slug: z.string(),
      }),
      quantity: z.number().int().positive().max(20),
    }),
  ).min(1),
  shipping: z.object({
    full_name: z.string().min(1),
    street_line_1: z.string().min(1),
    street_line_2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(1),
    country: z.string().min(2).max(2),
  }),
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = CheckoutSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 422 },
    )
  }

  const { items, shipping, email } = parsed.data

  // Try DB first; fall back to trusted static list
  const supabase = await createRouteHandlerClient()
  const productIds = items.map((i) => i.product.id)
  const { data: dbProducts } = await supabase
    .from('products')
    .select('id, name, price, stock, is_active')
    .in('id', productIds)

  // Build a map of validated products (DB wins; static list is fallback)
  const validatedProducts: Record<string, { id: string; name: string; price: number; stock: number; is_active: boolean }> = {}
  for (const id of productIds) {
    const fromDb = dbProducts?.find((p) => p.id === id)
    const fromStatic = TRUSTED_PRODUCTS[id]
    if (fromDb) {
      validatedProducts[id] = fromDb
    } else if (fromStatic) {
      validatedProducts[id] = { id, ...fromStatic }
    }
  }

  // Verify all products are valid, active, and have enough stock
  for (const item of items) {
    const product = validatedProducts[item.product.id]
    if (!product || !product.is_active) {
      return NextResponse.json(
        { error: `Product "${item.product.name}" is no longer available` },
        { status: 400 },
      )
    }
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Insufficient stock for "${item.product.name}"` },
        { status: 400 },
      )
    }
  }

  const SHIPPING_COST = 499
  const FREE_SHIPPING_THRESHOLD = 3000
  const subtotal = items.reduce((sum, item) => {
    return sum + validatedProducts[item.product.id].price * item.quantity
  }, 0)
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST

  const lineItems = items.map((item) => {
    const product = validatedProducts[item.product.id]
    return {
      price_data: {
        currency: 'cad',
        product_data: {
          name: product.name,
          metadata: { product_id: item.product.id },
        },
        unit_amount: product.price,
      },
      quantity: item.quantity,
    }
  })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: email,
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: shippingCost,
              currency: 'cad',
            },
            display_name: shippingCost === 0 ? 'Free Shipping' : 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
      ],
      metadata: {
        shipping_address: JSON.stringify(shipping),
        email,
      },
      success_url: `${siteUrl}/order-confirmation/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe session creation error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
