import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils/formatPrice'
import DealCountdown from './DealCountdown'
import ProductCard from '@/components/products/ProductCard'

// Deal ends at a fixed future date
const DEAL_END = '2026-06-30T23:59:59Z'

const FALLBACK_IMAGES: Record<string, string> = {
  rose:       '/images/rose/Main_Image_Rose.jpg',
  lavender:   '/images/lavender/1.jpg',
  millennium: '/images/millenium/1.jpg',
}

export default async function DealOfTheDay() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (!products?.length) return null

  // Feature the rose product as the deal, fall back to first product
  const featured = products.find((p) => p.category === 'rose') ?? products[0]
  const heroImage = featured.images?.[0] ?? FALLBACK_IMAGES[featured.category]

  return (
    <section className="border-b border-cream-dark">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr]">

          {/* ── Left: dark deal panel ──────────────────────── */}
          <div className="bg-[#1a1a1a] flex flex-col items-center justify-center gap-6 p-10 text-center">
            <p className="font-body text-[10px] font-semibold tracking-[0.28em] uppercase text-gold">
              Limited Offer
            </p>
            <h2 className="font-display text-3xl font-semibold text-white leading-tight">
              Deal of the Day
            </h2>

            {/* Featured product image */}
            <div className="relative w-40 h-40 flex-shrink-0">
              <Image
                src={heroImage}
                alt={featured.name}
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>

            {/* Product name + price */}
            <div className="space-y-1">
              <Link
                href={`/products/${featured.slug}`}
                className="font-display text-lg font-semibold text-white hover:text-gold transition-colors block"
              >
                {featured.name}
              </Link>
              <div className="flex items-center justify-center gap-2">
                {featured.compare_at_price && (
                  <span className="font-body text-sm text-white/40 line-through">
                    {formatPrice(featured.compare_at_price)}
                  </span>
                )}
                <span className="font-body text-xl font-semibold text-gold">
                  {formatPrice(featured.price)}
                </span>
              </div>
            </div>

            {/* Countdown timer */}
            <DealCountdown endDate={DEAL_END} />

            <Link
              href={`/products/${featured.slug}`}
              className="bg-gold hover:bg-white hover:text-plum text-white font-body text-[11px] font-semibold tracking-[0.18em] uppercase px-8 py-3 transition-colors duration-200 w-full text-center"
            >
              Shop Now
            </Link>
          </div>

          {/* ── Right: tabbed product grid ─────────────────── */}
          <div className="bg-white p-8 lg:p-10">
            {/* Tab header */}
            <div className="border-b border-cream-dark mb-8">
              <span className="inline-block font-body text-[11px] font-semibold tracking-[0.18em] uppercase text-gold border-b-2 border-gold pb-3 pr-8">
                Our Collection
              </span>
            </div>

            {/* Products */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-cream-dark border border-cream-dark">
              {products.map((product) => (
                <div key={product.id} className="bg-white">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
