import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { z } from 'zod'

const PatchSchema = z.object({
  name: z.string().min(2).optional(),
  tagline: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.number().int().positive().optional(),
  compare_at_price: z.number().int().positive().optional().nullable(),
  stock: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
})

interface RouteContext {
  params: Promise<{ productId: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { productId } = await params
  const supabase = await createRouteHandlerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
    return NextResponse.json({ error: 'Validation error', details: parsed.error.flatten() }, { status: 422 })
  }

  const { data: product, error } = await supabase
    .from('products')
    .update(parsed.data)
    .eq('id', productId)
    .select('id, name, price, stock, is_active')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ product })
}
