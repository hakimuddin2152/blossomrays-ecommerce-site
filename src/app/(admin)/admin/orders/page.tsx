import { createClient } from '@/lib/supabase/server'
import OrdersTable from '@/components/admin/OrdersTable'

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, total, created_at, guest_email, user_id, order_items(quantity)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-plum">All Orders</h1>
        <p className="font-body text-muted text-sm mt-1">{orders?.length ?? 0} total orders</p>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-cream-dark p-6">
        <OrdersTable orders={orders ?? []} />
      </div>
    </div>
  )
}
