import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/server'
import { formatPrice } from '@/lib/utils/formatPrice'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface Props {
  params: Promise<{ orderId: string }>
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderId } = await params

  // orderId might be a Stripe session ID (from success_url) or our internal UUID
  // We look up by either
  const supabase = await createClient()

  // Detect if it's a Stripe session ID or UUID
  const isStripeSession = orderId.startsWith('cs_')

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*, product:products(name, category))')
    .eq(isStripeSession ? 'stripe_session_id' : 'id', orderId)
    .single()

  if (!order) notFound()

  const address = order.shipping_address as {
    full_name: string
    street_line_1: string
    street_line_2?: string
    city: string
    state: string
    zip: string
    country: string
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
        {/* Success header */}
        <div className="text-center space-y-4 mb-10">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="font-display text-4xl font-semibold text-plum">
            Order Confirmed!
          </h1>
          <p className="font-body text-muted text-lg">
            Thank you for your order. We&apos;re preparing your BlossomRays fresheners for shipment.
          </p>
        </div>

        {/* Order card */}
        <div className="bg-white rounded-2xl shadow-soft border border-cream-dark p-6 space-y-6">
          {/* Order meta */}
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="font-body text-xs text-muted uppercase tracking-widest">Order ID</p>
              <p className="font-body font-mono text-sm text-plum mt-0.5">{order.id.slice(0, 13)}...</p>
            </div>
            <Badge status={order.status} />
          </div>

          {/* Items */}
          <div className="border-t border-cream-dark pt-4 space-y-3">
            {order.order_items?.map((item: {
              id: string
              quantity: number
              unit_price: number
              product: { name: string; category: string } | null
            }) => (
              <div key={item.id} className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl ${
                  item.product?.category === 'lavender' ? 'bg-lavender-light' : 'bg-rose-light'
                }`}>
                  {item.product?.category === 'lavender' ? '💜' : '🌹'}
                </span>
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

          {/* Totals */}
          <div className="border-t border-cream-dark pt-4 space-y-2 font-body text-sm">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Shipping</span>
              <span>{order.shipping_cost === 0 ? 'FREE' : formatPrice(order.shipping_cost)}</span>
            </div>
            <div className="flex justify-between font-semibold text-plum text-base pt-1 border-t border-cream-dark">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Shipping address */}
          {address && (
            <div className="border-t border-cream-dark pt-4">
              <p className="font-body text-xs text-muted uppercase tracking-widest mb-2">
                Shipping To
              </p>
              <p className="font-body text-sm text-plum space-y-0.5">
                <span className="block font-medium">{address.full_name}</span>
                <span className="block">{address.street_line_1}{address.street_line_2 ? `, ${address.street_line_2}` : ''}</span>
                <span className="block">{address.city}, {address.state} {address.zip}</span>
                <span className="block">{address.country}</span>
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/account/orders" className="flex-1">
            <Button variant="outline" className="w-full">
              View All Orders
            </Button>
          </Link>
          <Link href="/products" className="flex-1">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
