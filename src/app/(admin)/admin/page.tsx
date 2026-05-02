import { createClient } from '@/lib/supabase/server'
import StatsCard from '@/components/admin/StatsCard'
import OrdersTable from '@/components/admin/OrdersTable'
import { formatPrice } from '@/lib/utils/formatPrice'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalOrders },
    { count: paidOrders },
    { data: recentOrders },
    { data: revenueData },
  ] = await Promise.all([
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'paid'),
    supabase
      .from('orders')
      .select('id, status, total, created_at, order_items(quantity)')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('orders')
      .select('total')
      .in('status', ['paid', 'shipped', 'delivered']),
  ])

  const totalRevenue = revenueData?.reduce((s, o) => s + o.total, 0) ?? 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-plum">Dashboard</h1>
        <p className="font-body text-muted text-sm mt-1">BlossomRays Order Management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Orders"
          value={totalOrders ?? 0}
          icon="📦"
          accent="lavender"
        />
        <StatsCard
          title="Orders Paid"
          value={paidOrders ?? 0}
          icon="✅"
          accent="rose"
        />
        <StatsCard
          title="Total Revenue"
          value={formatPrice(totalRevenue)}
          icon="💰"
          accent="gold"
        />
        <StatsCard
          title="Products Live"
          value={2}
          icon="🌿"
          accent="plum"
          subtitle="Lavender + Rose"
        />
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-soft border border-cream-dark p-6">
        <h2 className="font-display text-xl font-semibold text-plum mb-5">Recent Orders</h2>
        <OrdersTable orders={recentOrders ?? []} />
      </div>
    </div>
  )
}
