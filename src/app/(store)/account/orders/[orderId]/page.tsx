import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Badge from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils/formatPrice'
import type { OrderStatus } from '@/types'

interface Props {
  params: Promise<{ orderId: string }>
}

export default async function OrderDetailPage({ params }: Props) {
  const { orderId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*, product:products(name, category, slug))')
    .eq('id', orderId)
    .eq('user_id', user!.id)
    .single()

  if (!order) notFound()

  const address = order.shipping_address as {
    full_name: string; street_line_1: string; street_line_2?: string;
    city: string; state: string; zip: string; country: string
  }

  const statusSteps: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered']
  const currentIdx = statusSteps.indexOf(order.status as OrderStatus)

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-semibold text-plum">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <Link href="/account/orders" className="font-body text-sm text-muted hover:text-plum transition-colors">
            ← All Orders
          </Link>
        </div>

        {/* Status progress */}
        {order.status !== 'cancelled' && (
          <div className="bg-white rounded-2xl shadow-soft border border-cream-dark p-6 mb-6">
            <div className="flex items-center justify-between relative">
              {/* Progress line */}
              <div className="absolute left-0 right-0 top-4 h-0.5 bg-cream-dark" />
              <div
                className="absolute left-0 top-4 h-0.5 bg-plum transition-all duration-500"
                style={{ width: `${(currentIdx / (statusSteps.length - 1)) * 100}%` }}
              />

              {statusSteps.map((step, i) => (
                <div key={step} className="relative flex flex-col items-center gap-2 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    i <= currentIdx
                      ? 'bg-plum text-white shadow-soft'
                      : 'bg-cream-dark text-muted'
                  }`}>
                    {i < currentIdx ? '✓' : i + 1}
                  </div>
                  <span className={`font-body text-xs capitalize hidden sm:block ${
                    i <= currentIdx ? 'text-plum font-medium' : 'text-muted'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {order.status === 'cancelled' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-3 mb-6">
            <p className="font-body text-sm text-red-700 font-medium">
              This order has been cancelled.
            </p>
          </div>
        )}

        {/* Items */}
        <div className="bg-white rounded-2xl shadow-soft border border-cream-dark p-6 space-y-4 mb-6">
          <h2 className="font-display text-xl font-semibold text-plum">Items Ordered</h2>
          {order.order_items?.map((item: {
            id: string; quantity: number; unit_price: number;
            product: { name: string; category: string; slug: string } | null
          }) => (
            <div key={item.id} className="flex items-center gap-4 border-b border-cream-dark pb-4 last:border-0 last:pb-0">
              <span className={`w-12 h-12 rounded-xl flex items-center justify-center text-3xl ${
                item.product?.category === 'lavender' ? 'bg-lavender-light' : 'bg-rose-light'
              }`}>
                {item.product?.category === 'lavender' ? '💜' : '🌹'}
              </span>
              <div className="flex-1">
                <p className="font-body font-medium text-plum text-sm">{item.product?.name}</p>
                <p className="font-body text-xs text-muted">Qty: {item.quantity}</p>
              </div>
              <p className="font-body font-semibold text-plum text-sm">
                {formatPrice(item.unit_price * item.quantity)}
              </p>
            </div>
          ))}

          {/* Totals */}
          <div className="pt-3 space-y-2 font-body text-sm border-t border-cream-dark">
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
          <address className="font-body text-sm text-plum not-italic space-y-0.5">
            <p className="font-medium">{address.full_name}</p>
            <p>{address.street_line_1}{address.street_line_2 ? `, ${address.street_line_2}` : ''}</p>
            <p>{address.city}, {address.state} {address.zip}</p>
            <p>{address.country}</p>
          </address>
        </div>
      </div>
    </div>
  )
}
