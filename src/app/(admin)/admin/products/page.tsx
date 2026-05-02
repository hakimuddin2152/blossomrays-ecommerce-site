import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils/formatPrice'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-plum">Products</h1>
        <p className="font-body text-muted text-sm mt-1">Manage your product listings</p>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-cream-dark overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead className="border-b border-cream-dark bg-cream">
            <tr>
              {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-widest text-muted font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {products?.map((product) => (
              <tr key={product.id} className="hover:bg-cream/30 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl ${
                      product.category === 'lavender' ? 'bg-lavender-light' : 'bg-rose-light'
                    }`}>
                      {product.category === 'lavender' ? '💜' : '🌹'}
                    </span>
                    <div>
                      <p className="font-medium text-plum">{product.name}</p>
                      <p className="text-xs text-muted">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`capitalize text-xs font-semibold px-2.5 py-1 rounded-full ${
                    product.category === 'lavender'
                      ? 'bg-lavender-light text-lavender-dark'
                      : 'bg-rose-light text-rose-dark'
                  }`}>
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-4 font-medium text-plum">
                  {formatPrice(product.price)}
                  {product.compare_at_price && (
                    <span className="ml-1 text-muted text-xs line-through">
                      {formatPrice(product.compare_at_price)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-plum">{product.stock}</td>
                <td className="px-4 py-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    product.is_active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {product.is_active ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-lavender-dark text-xs font-medium hover:underline"
                  >
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
