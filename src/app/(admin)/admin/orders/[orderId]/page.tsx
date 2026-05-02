import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils/formatPrice'
import OrderStatusSelect from '@/components/admin/OrderStatusSelect'
import type { OrderStatus } from '@/types'

interface Props {
  params: Promise<{ orderId: string }>
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { orderId } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*, product:products(name, category))')
    .eq('id', orderId)
    .single()

  if (!order) notFound()

  const address = order.shipping_address as {
    full_name: string; street_line_1: string; street_line_2?: string
    city: string; state: string; zip: string; country: string
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/orders" className="font-body text-sm text-muted hover:text-plum transition-colors">
            ← All Orders
          </Link>
          <h1 className="font-display text-3xl font-semibold text-plum mt-1">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
        </div>
      </div>

      {/* Status management */}
      <div className="bg-white rounded-2xl shadow-soft border border-cream-dark p-6 space-y-3">
        <h2 className="font-display text-xl font-semibold text-plum">Fulfilment Status</h2>
        <OrderStatusSelect
          orderId={order.id}
          currentStatus={order.status as OrderStatus}
        />
      </div>

      {/* Customer info */}
      <div className="bg-white rounded-2xl shadow-soft border border-cream-dark p-6 space-y-2">
        <h2 className="font-display text-xl font-semibold text-plum mb-3">Customer</h2>
        <p className="font-body text-sm text-muted uppercase tracking-widest text-xs">Email</p>
        <p className="font-body text-sm text-plum">{order.guest_email ?? 'Registered User'}</p>
        <p className="font-body text-xs text-muted mt-2">
          Placed: {new Date(order.created_at).toLocaleString('en-US', {
            dateStyle: 'medium', timeStyle: 'short',
          })}
        </p>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl shadow-soft border border-cream-dark p-6">
        <h2 className="font-display text-xl font-semibold text-plum mb-4">Items</h2>
        <div className="space-y-4">
          {order.order_items?.map((item: {
            id: string; quantity: number; unit_price: number
            product: { name: string; category: string } | null
          }) => (
            <div key={item.id} className="flex items-center gap-4 border-b border-cream-dark pb-4 last:border-0">
              <span className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl ${
                item.product?.category === 'lavender' ? 'bg-lavender-light' : 'bg-rose-light'
              }`}>
                {item.product?.category === 'lavender' ? '💜' : '🌹'}
              </span>
              <div className="flex-1">
                <p className="font-body font-medium text-plum text-sm">{item.product?.name}</p>
                <p className="font-body text-xs text-muted">Qty: {item.quantity} × {formatPrice(item.unit_price)}</p>
              </div>
              <p className="font-body font-semibold text-plum text-sm">
                {formatPrice(item.unit_price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-4 space-y-2 font-body text-sm border-t border-cream-dark">
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
      </div>

      {/* Shipping address */}
      <div className="bg-white rounded-2xl shadow-soft border border-cream-dark p-6">
        <h2 className="font-display text-xl font-semibold text-plum mb-3">Shipping Address</h2>
        <address className="font-body text-sm text-plum not-italic leading-6">
          <p className="font-medium">{address.full_name}</p>
          <p>{address.street_line_1}{address.street_line_2 ? `, ${address.street_line_2}` : ''}</p>
          <p>{address.city}, {address.state} {address.zip}</p>
          <p>{address.country}</p>
        </address>
      </div>

      {/* Stripe info */}
      {order.stripe_payment_intent_id && (
        <div className="bg-white rounded-2xl shadow-soft border border-cream-dark p-6">
          <h2 className="font-display text-xl font-semibold text-plum mb-3">Payment</h2>
          <p className="font-body text-xs text-muted">Stripe Payment Intent</p>
          <p className="font-mono text-sm text-plum">{order.stripe_payment_intent_id}</p>
        </div>
      )}
    </div>
  )
}
