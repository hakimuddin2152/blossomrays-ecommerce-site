import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Badge from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils/formatPrice'
import type { OrderStatus } from '@/types'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, total, created_at, order_items(quantity)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl font-semibold text-plum">My Orders</h1>
          <Link href="/account" className="font-body text-sm text-muted hover:text-plum transition-colors">
            ← Back to Account
          </Link>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <span className="text-6xl">📦</span>
            <p className="font-body text-muted text-lg">No orders yet</p>
            <Link href="/products" className="inline-block">
              <span className="btn-primary px-6 py-3 text-sm">Start Shopping</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const itemCount = (order.order_items as { quantity: number }[])?.reduce(
                (s, i) => s + i.quantity, 0,
              ) ?? 0

              return (
                <Link key={order.id} href={`/account/orders/${order.id}`}>
                  <div className="bg-white rounded-2xl shadow-soft border border-cream-dark p-5 flex items-center justify-between gap-4 hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-200">
                    <div className="space-y-1">
                      <p className="font-body text-xs text-muted uppercase tracking-widest">
                        Order
                      </p>
                      <p className="font-mono text-sm text-plum font-medium">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>

                    <div className="text-center hidden sm:block">
                      <p className="font-body text-xs text-muted">Items</p>
                      <p className="font-body font-medium text-plum">{itemCount}</p>
                    </div>

                    <div className="text-center hidden sm:block">
                      <p className="font-body text-xs text-muted">Date</p>
                      <p className="font-body text-sm text-plum">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="font-body text-xs text-muted">Total</p>
                      <p className="font-body font-semibold text-plum">
                        {formatPrice(order.total)}
                      </p>
                    </div>

                    <Badge status={order.status as OrderStatus} />

                    <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
