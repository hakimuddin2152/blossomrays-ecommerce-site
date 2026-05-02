import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { getNextStatuses } from '@/lib/utils/orderStatus'
import type { OrderStatus } from '@/types'

interface RouteContext {
  params: Promise<{ orderId: string }>
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { orderId } = await params
  const supabase = await createRouteHandlerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*, product:products(name, category, slug))')
    .eq('id', orderId)
    .single()

  if (error || !order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Allow access for order owner or admin
  const isOwner = order.user_id === user.id
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const isAdmin = profile?.role === 'admin'

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json({ order })
}

const PatchSchema = z.object({
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled']),
})

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { orderId } = await params
  const supabase = await createRouteHandlerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify admin
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = PatchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid status value' }, { status: 422 })
  }

  const { status: newStatus } = parsed.data

  // Validate transition
  const { data: current } = await supabase.from('orders').select('status').eq('id', orderId).single()
  if (!current) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  const allowed = getNextStatuses(current.status as OrderStatus)
  if (!allowed.includes(newStatus as OrderStatus) && newStatus !== current.status) {
    return NextResponse.json(
      { error: `Cannot transition from "${current.status}" to "${newStatus}"` },
      { status: 400 },
    )
  }

  const { data: updated, error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)
    .select('id, status')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ order: updated })
}
