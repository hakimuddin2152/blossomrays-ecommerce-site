import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/products/ProductGrid'
import type { Metadata } from 'next'
import type { Product } from '@/types'

export const metadata: Metadata = {
  title: 'Shop All Car Air Fresheners',
  description:
    'Browse BlossomRays full collection: Lavender, Rose and Millennium car air fresheners. Premium botanical fragrance for your daily drive.',
  alternates: { canonical: '/products' },
}

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

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: dbProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  const products = (dbProducts && dbProducts.length > 0) ? dbProducts : STATIC_PRODUCTS

  return (
    <div className="bg-[#FAFAF8] min-h-screen">

      {/* ── Decorative banner header ─────────────────────── */}
      <div className="relative overflow-hidden bg-[#111] px-4 sm:px-6 py-20 text-center">
        {/* Soft radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,_rgba(196,154,108,0.18)_0%,_transparent_70%)] pointer-events-none" />
        <div className="relative z-10 max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 border border-gold/30 bg-gold/10 backdrop-blur-sm px-4 py-2 rounded-full mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse flex-shrink-0" />
            <span className="font-body text-[9px] font-semibold tracking-[0.22em] uppercase text-gold">
              Handcrafted in Canada
            </span>
          </div>
          <h1 className="font-display text-5xl sm:text-[3.4rem] font-semibold text-white leading-tight">
            Our Scent<br />
            <em className="italic text-gold">Collection</em>
          </h1>
          <p className="font-body text-white/45 text-[15px] leading-relaxed max-w-sm mx-auto">
            Three signature botanical scents. Alcohol-free, lasting 120+ days.
          </p>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#FAFAF8]"
          style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
      </div>

      {/* ── Scent category pills ─────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Filter:</span>
          {['All', 'Lavender', 'Rose', 'Millennium'].map((cat) => (
            <span
              key={cat}
              className={`font-body text-[10px] font-semibold tracking-[0.14em] uppercase px-4 py-2 rounded-full border cursor-pointer transition-all duration-200 ${
                cat === 'All'
                  ? 'bg-plum text-white border-plum'
                  : 'bg-white text-muted border-cream-dark hover:border-gold hover:text-gold'
              }`}
            >
              {cat}
            </span>
          ))}
          <span className="ml-auto font-body text-[11px] text-muted">
            {products?.length ?? 0} products
          </span>
        </div>
      </div>

      {/* ── Grid ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20">
        <ProductGrid products={products ?? []} />
      </div>
    </div>
  )
}
