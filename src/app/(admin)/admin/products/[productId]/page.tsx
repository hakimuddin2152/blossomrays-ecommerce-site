import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProductEditForm from '../_ProductEditForm'

interface Props {
  params: Promise<{ productId: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { productId } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single()

  if (!product) notFound()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link href="/admin/products" className="font-body text-sm text-muted hover:text-plum transition-colors">
          ← Products
        </Link>
        <h1 className="font-display text-3xl font-semibold text-plum mt-1">
          Edit: {product.name}
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-cream-dark p-6">
        <ProductEditForm product={product} />
      </div>
    </div>
  )
}
