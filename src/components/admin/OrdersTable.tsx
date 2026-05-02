import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils/formatPrice'
import type { Order, OrderStatus } from '@/types'

interface OrdersTableProps {
  orders: Array<{
    id: string
    status: string
    total: number
    created_at: string
    guest_email?: string | null
    user_id?: string | null
    order_items?: { quantity: number }[]
  }>
  showLink?: boolean
}

export default function OrdersTable({ orders, showLink = true }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-muted font-body text-sm">
        No orders found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full font-body text-sm">
        <thead>
          <tr className="border-b border-cream-dark text-left">
            {['Order ID', 'Date', 'Items', 'Total', 'Status', ''].map((h) => (
              <th key={h} className="pb-3 pr-4 text-xs uppercase tracking-widest text-muted font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-cream-dark">
          {orders.map((order) => {
            const itemCount = order.order_items?.reduce((s, i) => s + i.quantity, 0) ?? 0
            return (
              <tr key={order.id} className="hover:bg-cream/50 transition-colors">
                <td className="py-3.5 pr-4">
                  <span className="font-mono text-xs text-plum font-medium">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </span>
                </td>
                <td className="py-3.5 pr-4 text-muted text-xs">
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </td>
                <td className="py-3.5 pr-4 text-plum">{itemCount}</td>
                <td className="py-3.5 pr-4 text-plum font-medium">
                  {formatPrice(order.total)}
                </td>
                <td className="py-3.5 pr-4">
                  <Badge status={order.status as OrderStatus} />
                </td>
                <td className="py-3.5">
                  {showLink && (
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-lavender-dark text-xs font-medium hover:underline"
                    >
                      View →
                    </Link>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
