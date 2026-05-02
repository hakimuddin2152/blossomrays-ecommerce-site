import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const { count: orderCount } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user!.id)

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <h1 className="font-display text-4xl font-semibold text-plum mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile card */}
          <Card padding="md" hover={false} className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-plum rounded-full flex items-center justify-center text-white font-display text-xl font-semibold">
                {(profile?.full_name ?? user?.email ?? 'U')[0].toUpperCase()}
              </div>
              <div>
                <p className="font-body font-semibold text-plum">
                  {profile?.full_name ?? 'Customer'}
                </p>
                <p className="font-body text-sm text-muted">{profile?.email}</p>
              </div>
            </div>
          </Card>

          {/* Orders quick-stat */}
          <Link href="/account/orders">
            <Card padding="md" className="text-center space-y-2">
              <p className="font-display text-4xl font-semibold text-lavender">
                {orderCount ?? 0}
              </p>
              <p className="font-body text-sm text-muted">Total Orders</p>
              <span className="font-body text-xs text-lavender-dark font-medium">
                View all →
              </span>
            </Card>
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/account/orders">
            <Card padding="md" className="flex items-center gap-4">
              <span className="text-2xl">📦</span>
              <div>
                <p className="font-body font-medium text-plum">My Orders</p>
                <p className="font-body text-sm text-muted">Track and view past orders</p>
              </div>
            </Card>
          </Link>

          <Link href="/products">
            <Card padding="md" className="flex items-center gap-4">
              <span className="text-2xl">🛍️</span>
              <div>
                <p className="font-body font-medium text-plum">Shop Again</p>
                <p className="font-body text-sm text-muted">Browse our collection</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
