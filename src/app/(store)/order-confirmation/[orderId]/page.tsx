import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/server'
import { formatPrice } from '@/lib/utils/formatPrice'
import Button from '@/components/ui/Button'

interface Props {
  params: Promise<{ orderId: string }>
}

interface StripeLineItem {
  id: string
  description: string | null
  quantity: number | null
  amount_total: number
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderId } = await params
  const isStripeSession = orderId.startsWith('cs_')

  // --- Try DB first ---
  let dbOrder: Record<string, unknown> | null = null
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*, product:products(name, category))')
      .eq(isStripeSession ? 'stripe_session_id' : 'id', orderId)
      .single()
    dbOrder = data
  } catch {
    // DB not available — fall through to Stripe fallback
  }

  // --- Stripe fallback when DB has no record ---
  let stripeSession: {
    id: string
    amount_total: number | null
    customer_details: { email?: string | null; name?: string | null } | null
    shipping_details: {
      name?: string | null
      address?: {
        line1?: string | null
        line2?: string | null
        city?: string | null
        state?: string | null
        postal_code?: string | null
        country?: string | null
      } | null
    } | null
    line_items: { data: StripeLineItem[] }
  } | null = null

  if (!dbOrder && isStripeSession) {
    try {
      const session = await stripe.checkout.sessions.retrieve(orderId, {
        expand: ['line_items'],
      })
      stripeSession = session as typeof stripeSession
    } catch {
      // Stripe lookup failed
    }
  }

  // Nothing found at all
  if (!dbOrder && !stripeSession) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-body text-muted text-lg">Order not found.</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  // ---- Render from DB order ----
  if (dbOrder) {
    const order = dbOrder as {
      id: string
      status: string
      subtotal: number
      shipping_cost: number
      total: number
      shipping_address: {
        full_name: string
        street_line_1: string
        street_line_2?: string
        city: string
        state: string
        zip: string
        country: string
      }
      order_items: {
        id: string
        quantity: number
        unit_price: number
        product: { name: string; category: string } | null
      }[]
    }
    const address = order.shipping_address

    return (
      <div className="bg-cream min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
          <SuccessHeader />
          <div className="bg-white rounded-2xl shadow-soft border border-cream-dark p-6 space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="font-body text-xs text-muted uppercase tracking-widest">Order ID</p>
                <p className="font-body font-mono text-sm text-plum mt-0.5">{order.id.slice(0, 13)}…</p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 capitalize">
                {order.status}
              </span>
            </div>
            <div className="border-t border-cream-dark pt-4 space-y-3">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="font-body text-sm font-medium text-plum">{item.product?.name}</p>
                    <p className="font-body text-xs text-muted">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-body text-sm font-semibold text-plum">
                    {formatPrice(item.unit_price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-cream-dark pt-4 space-y-2 font-body text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Shipping</span>
                <span>{order.shipping_cost === 0 ? 'FREE' : formatPrice(order.shipping_cost)}</span>
              </div>
              <div className="flex justify-between font-semibold text-plum text-base pt-1 border-t border-cream-dark">
                <span>Total</span><span>{formatPrice(order.total)}</span>
              </div>
            </div>
            {address && (
              <div className="border-t border-cream-dark pt-4">
                <p className="font-body text-xs text-muted uppercase tracking-widest mb-2">Shipping To</p>
                <div className="font-body text-sm text-plum space-y-0.5">
                  <p className="font-medium">{address.full_name}</p>
                  <p>{address.street_line_1}{address.street_line_2 ? `, ${address.street_line_2}` : ''}</p>
                  <p>{address.city}, {address.state} {address.zip}</p>
                  <p>{address.country}</p>
                </div>
              </div>
            )}
          </div>
          <Actions />
        </div>
      </div>
    )
  }

  // ---- Render from Stripe session (DB not ready) ----
  const session = stripeSession!
  const shipping = session.shipping_details
  const total = session.amount_total ?? 0

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
        <SuccessHeader />
        <div className="bg-white rounded-2xl shadow-soft border border-cream-dark p-6 space-y-6">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="font-body text-xs text-muted uppercase tracking-widest">Session ID</p>
              <p className="font-body font-mono text-sm text-plum mt-0.5">{session.id.slice(0, 20)}…</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
              Paid
            </span>
          </div>

          {session.line_items?.data?.length > 0 && (
            <div className="border-t border-cream-dark pt-4 space-y-3">
              {session.line_items.data.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="font-body text-sm font-medium text-plum">{item.description}</p>
                    <p className="font-body text-xs text-muted">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-body text-sm font-semibold text-plum">
                    {formatPrice(item.amount_total)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-cream-dark pt-4 font-body text-sm">
            <div className="flex justify-between font-semibold text-plum text-base">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>

          {shipping?.address && (
            <div className="border-t border-cream-dark pt-4">
              <p className="font-body text-xs text-muted uppercase tracking-widest mb-2">Shipping To</p>
              <div className="font-body text-sm text-plum space-y-0.5">
                {shipping.name && <p className="font-medium">{shipping.name}</p>}
                {shipping.address.line1 && <p>{shipping.address.line1}{shipping.address.line2 ? `, ${shipping.address.line2}` : ''}</p>}
                {shipping.address.city && <p>{shipping.address.city}, {shipping.address.state} {shipping.address.postal_code}</p>}
                {shipping.address.country && <p>{shipping.address.country}</p>}
              </div>
            </div>
          )}

          {session.customer_details?.email && (
            <div className="border-t border-cream-dark pt-4">
              <p className="font-body text-xs text-muted uppercase tracking-widest mb-1">Confirmation sent to</p>
              <p className="font-body text-sm text-plum">{session.customer_details.email}</p>
            </div>
          )}
        </div>
        <Actions />
      </div>
    </div>
  )
}

function SuccessHeader() {
  return (
    <div className="text-center space-y-4 mb-10">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h1 className="font-display text-4xl font-semibold text-plum">Order Confirmed!</h1>
      <p className="font-body text-muted text-lg">
        Thank you for your order. We&apos;re preparing your BlossomRays fresheners for shipment.
      </p>
    </div>
  )
}

function Actions() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
      <Link href="/products" className="flex-1">
        <Button className="w-full">Continue Shopping</Button>
      </Link>
    </div>
  )
}
