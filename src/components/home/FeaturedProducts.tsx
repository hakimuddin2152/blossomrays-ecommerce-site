import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/products/ProductCard'
import type { Product } from '@/types'

const STATIC_PRODUCTS: Product[] = [
  {
    id: 'b1f1a000-0000-4000-a000-000000000001', name: 'Rose Car Air Freshener', slug: 'rose-car-air-freshener',
    tagline: 'Bloom on the road', description: null, price: 1799, compare_at_price: null,
    stock: 100, category: 'rose', is_active: true,
    images: ['/images/rose/Main_Image_Rose.jpg'],
    seo_title: null, seo_description: null,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'b1f1a000-0000-4000-a000-000000000002', name: 'Lavender Car Air Freshener', slug: 'lavender-car-air-freshener',
    tagline: 'Calm your commute', description: null, price: 1799, compare_at_price: null,
    stock: 100, category: 'lavender', is_active: true,
    images: ['/images/lavender/1.jpg'],
    seo_title: null, seo_description: null,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'b1f1a000-0000-4000-a000-000000000003', name: 'Millennium Car Air Freshener', slug: 'millennium-car-air-freshener',
    tagline: 'A scent beyond time', description: null, price: 1799, compare_at_price: null,
    stock: 100, category: 'millennium', is_active: true,
    images: ['/images/millenium/1.jpg'],
    seo_title: null, seo_description: null,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
]

export default async function FeaturedProducts() {
  const supabase = await createClient()
  const { data: dbProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  const products = (dbProducts && dbProducts.length > 0) ? dbProducts : STATIC_PRODUCTS

  return (
    <section id="collection" className="bg-[#FAFAF8] py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-14">
          <p className="font-body text-[10px] font-semibold tracking-[0.3em] uppercase text-gold mb-3">
            Handcrafted in Canada
          </p>
          <h2 className="font-display text-4xl md:text-[3.2rem] font-semibold text-plum mb-4">
            Our Collection
          </h2>
          <p className="font-body text-[15px] text-muted max-w-md mx-auto leading-relaxed">
            Three signature botanical scents, each crafted to transform your driving experience.
          </p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View all */}
        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-plum hover:bg-gold text-white font-body text-[11px] font-semibold tracking-[0.18em] uppercase px-10 py-4 rounded-full transition-all duration-200 shadow-soft"
          >
            View All Products
          </Link>
        </div>

      </div>
    </section>
  )
}

