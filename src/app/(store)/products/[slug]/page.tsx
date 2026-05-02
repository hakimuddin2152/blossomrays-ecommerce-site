import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Product } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import ProductJsonLd from '@/components/products/ProductJsonLd'
import ProductCard from '@/components/products/ProductCard'
import ProductGallery from './_ProductGallery'
import AddToCartButton from './_AddToCartButton'
import ProductTabs from './_ProductTabs'
import { formatPrice } from '@/lib/utils/formatPrice'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

const FALLBACK_IMAGES: Record<string, string[]> = {
  rose: [
    '/images/rose/Main_Image_Rose.jpg',
    '/images/rose/Main_Image.jpeg',
    '/images/rose/Dual_Ways.jpg',
    '/images/rose/MultiUses.jpg',
    '/images/rose/Whats_In_The_Pack.jpeg',
  ],
  lavender: [
    '/images/lavender/1.jpg',
    '/images/lavender/2.jpg',
    '/images/lavender/3.jpg',
    '/images/lavender/4.jpg',
    '/images/lavender/5.jpg',
  ],
  millennium: [
    '/images/millenium/1.jpg',
    '/images/millenium/2.jpg',
    '/images/millenium/3.jpg',
    '/images/millenium/4.jpg',
    '/images/millenium/5.jpg',
  ],
}

const SCENT_NOTES: Record<string, { top: string; mid: string; base: string; color: string }> = {
  rose:       { top: 'Fresh Rose', mid: 'Jasmine', base: 'Sandalwood', color: '#C87868' },
  lavender:   { top: 'Lavender', mid: 'Bergamot', base: 'Cedarwood', color: '#8B89C8' },
  millennium: { top: 'Oud', mid: 'Amber', base: 'Vanilla', color: '#C49A6C' },
}

const FEATURES = [
  { icon: '120+', label: 'Days Lasting', sub: 'Long-lasting formula' },
  { icon: '0%', label: 'Alcohol-Free', sub: 'Safe for families' },
  { icon: '2', label: 'Ways to Use', sub: 'Vent or mirror clip' },
  { icon: '🍁', label: 'Made in Canada', sub: 'Premium quality' },
]

const LIFESTYLE_IMAGES: Record<string, string> = {
  rose:       '/images/rose/Main_Image_With_Prod_Of_Canada.jpg',
  lavender:   '/images/lavender/3.jpg',
  millennium: '/images/millenium/3.jpg',
}

const STATIC_PRODUCTS: Record<string, Product> = {
  'rose-car-air-freshener': {
    id: 'b1f1a000-0000-4000-a000-000000000001',
    name: 'Rose Car Air Freshener',
    slug: 'rose-car-air-freshener',
    tagline: 'Bloom on the road',
    description: 'Bring the romance of a rose garden into your car. Alcohol-free, 120+ day lasting, made in Canada.',
    price: 1799,
    compare_at_price: null,
    stock: 100,
    category: 'rose',
    is_active: true,
    images: FALLBACK_IMAGES['rose'],
    seo_title: 'Fresh Rose Car Air Freshener | BlossomRays',
    seo_description: 'Premium botanical rose car air freshener. Alcohol-free, 120+ day lasting, made in Canada.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  'lavender-car-air-freshener': {
    id: 'b1f1a000-0000-4000-a000-000000000002',
    name: 'Lavender Car Air Freshener',
    slug: 'lavender-car-air-freshener',
    tagline: 'Calm your commute',
    description: 'Transform every drive into a serene escape. Alcohol-free, 120+ day lasting, made in Canada.',
    price: 1799,
    compare_at_price: null,
    stock: 100,
    category: 'lavender',
    is_active: true,
    images: FALLBACK_IMAGES['lavender'],
    seo_title: 'Lavender Car Air Freshener | BlossomRays',
    seo_description: 'Premium botanical lavender car air freshener. Alcohol-free, 120+ day lasting, made in Canada.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  'millennium-car-air-freshener': {
    id: 'b1f1a000-0000-4000-a000-000000000003',
    name: 'Millennium Car Air Freshener',
    slug: 'millennium-car-air-freshener',
    tagline: 'A scent beyond time',
    description: 'Elevate your drive with the signature Millennium fragrance. Alcohol-free, 120+ day lasting, made in Canada.',
    price: 1799,
    compare_at_price: null,
    stock: 100,
    category: 'millennium',
    is_active: true,
    images: FALLBACK_IMAGES['millennium'],
    seo_title: 'Millennium Car Air Freshener | BlossomRays',
    seo_description: 'Premium Millennium scent car air freshener. Alcohol-free, 120+ day lasting, made in Canada.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
}

export async function generateStaticParams() {
  return [
    { slug: 'lavender-car-air-freshener' },
    { slug: 'rose-car-air-freshener' },
    { slug: 'millennium-car-air-freshener' },
  ]
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: dbProduct } = await supabase
    .from('products')
    .select('name, seo_title, seo_description, images')
    .eq('slug', slug)
    .single()

  const product = dbProduct ?? STATIC_PRODUCTS[slug]
  if (!product) return {}

  return {
    title: product.seo_title ?? product.name,
    description: product.seo_description ?? undefined,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const [{ data: dbProduct }, { data: dbRelated }] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single(),
    supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .neq('slug', slug)
      .limit(3),
  ])

  const product = dbProduct ?? STATIC_PRODUCTS[slug]
  if (!product) notFound()

  const related = dbRelated ?? Object.values(STATIC_PRODUCTS).filter(p => p.slug !== slug)

  const images = product.images?.length > 0
    ? product.images
    : FALLBACK_IMAGES[product.category] ?? ['/images/rose/Main_Image_Rose.jpg']

  const scent = SCENT_NOTES[product.category]
  const lifestyleImage = LIFESTYLE_IMAGES[product.category] ?? '/images/rose/Main_Image_With_Prod_Of_Canada.jpg'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  return (
    <>
      <ProductJsonLd product={product} url={`${siteUrl}/products/${product.slug}`} />

      <div className="bg-[#FAFAF8] min-h-screen">

        {/* ── Breadcrumb ─────────────────────────────────────── */}
        <div className="bg-white border-b border-cream-dark">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 py-3">
            <nav className="flex items-center gap-2 font-body text-[11px] text-muted" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-gold transition-colors">Home</Link>
              <svg className="w-3 h-3 opacity-40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <Link href="/products" className="hover:text-gold transition-colors">Shop</Link>
              <svg className="w-3 h-3 opacity-40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-plum font-medium">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* ── Main Product Section ────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Gallery — sticky on desktop */}
            <div className="lg:sticky lg:top-24">
              <ProductGallery images={images} name={product.name} />
            </div>

            {/* Product info */}
            <div className="space-y-6">
              {/* Category pill + badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/30 text-gold font-body text-[9px] font-semibold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full" style={{ textTransform: 'capitalize' }}>
                  {product.category}
                </span>
                {product.compare_at_price && (
                  <span className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-600 font-body text-[9px] font-semibold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full">
                    On Sale
                  </span>
                )}
                <span className={`inline-flex items-center gap-1.5 font-body text-[9px] font-semibold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full ${
                  product.stock > 0
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}>
                  {product.stock > 0 ? '● In Stock' : '● Out of Stock'}
                </span>
              </div>

              {/* Name */}
              <h1 className="font-display text-4xl lg:text-[3rem] font-semibold text-plum leading-tight">
                {product.name}
              </h1>

              {/* Stars */}
              <div className="flex items-center gap-2.5">
                <div className="flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gold">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="font-body text-[12px] text-muted">5.0</span>
                <span className="font-body text-[12px] text-gold underline cursor-pointer hover:no-underline">48 reviews</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 bg-white rounded-2xl px-5 py-4 border border-cream-dark shadow-sm">
                <span className="font-display text-[2rem] font-semibold text-plum leading-none">
                  {formatPrice(product.price)}
                </span>
                {product.compare_at_price && (
                  <>
                    <span className="font-body text-base text-muted line-through">
                      {formatPrice(product.compare_at_price)}
                    </span>
                    <span className="ml-auto font-body text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      Save {Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {/* Scent notes */}
              {scent && (
                <div className="bg-white rounded-2xl border border-cream-dark p-5 space-y-3 shadow-sm">
                  <p className="font-body text-[10px] font-semibold tracking-[0.2em] uppercase text-muted">
                    Scent Profile
                  </p>
                  <div className="flex items-center gap-4">
                    {[
                      { label: 'Top', note: scent.top },
                      { label: 'Heart', note: scent.mid },
                      { label: 'Base', note: scent.base },
                    ].map(({ label, note }, idx) => (
                      <div key={label} className="flex-1 text-center">
                        <div
                          className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-body text-[10px] font-bold"
                          style={{
                            backgroundColor: scent.color,
                            opacity: 1 - idx * 0.2,
                          }}
                        >
                          {idx + 1}
                        </div>
                        <p className="font-body text-[9px] uppercase tracking-wider text-muted">{label}</p>
                        <p className="font-body text-[12px] font-semibold text-plum">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features grid */}
              <div className="grid grid-cols-2 gap-3">
                {FEATURES.map(({ icon, label, sub }) => (
                  <div key={label} className="bg-white rounded-xl border border-cream-dark p-4 flex items-center gap-4 shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-display text-[1.25rem] font-bold text-gold leading-none">{icon}</span>
                    </div>
                    <div>
                      <p className="font-body text-[14px] font-semibold text-plum leading-tight">{label}</p>
                      <p className="font-body text-[12px] text-muted mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add to Cart */}
              <AddToCartButton product={product} />

              {/* Description blurb */}
              <div className="bg-white rounded-2xl border border-cream-dark p-5 shadow-sm">
                <p className="font-body text-[13px] text-muted leading-relaxed">
                  Crafted in Canada with fine fragrance oils in a handblown glass bottle and wooden cap.
                  Alcohol-free and family-safe — clips to your air vent or hangs from the mirror.
                  One freshener lasts <strong className="text-plum font-medium">120+ days</strong>.
                </p>
              </div>

              {/* SKU + share */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-body text-[10px] text-muted">
                  SKU: BLM-{product.category.toUpperCase().slice(0, 3)}-001
                </span>
                <Link
                  href={`/products?category=${product.category}`}
                  className="font-body text-[10px] font-semibold uppercase tracking-wider text-gold hover:underline"
                >
                  More {product.category} →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs: Description / Ingredients / Reviews ─────── */}
        <div className="bg-white border-y border-cream-dark">
          <div className="max-w-7xl mx-auto px-5 sm:px-6">
            <ProductTabs productName={product.name} category={product.category} />
          </div>
        </div>

        {/* ── Lifestyle banner ──────────────────────────────── */}
        <div className="relative overflow-hidden min-h-[320px] flex items-center">
          <Image
            src={lifestyleImage}
            alt="BlossomRays in use"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/90 via-[#080808]/60 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-16">
            <div className="max-w-md space-y-5">
              <p className="font-body text-[10px] font-semibold tracking-[0.24em] uppercase text-gold">
                The BlossomRays Difference
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white leading-tight">
                More Than a Freshener.<br />
                <em className="italic">An Experience.</em>
              </h2>
              <p className="font-body text-white/55 text-[14px] leading-relaxed">
                Handcrafted with care in Canada, each BlossomRays freshener is designed to elevate
                every drive — with premium botanical scents that truly last.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-white font-body text-[11px] font-semibold tracking-[0.18em] uppercase px-7 py-3.5 rounded-full transition-all duration-200 shadow-lg shadow-gold/20"
              >
                Explore All Scents
              </Link>
            </div>
          </div>
        </div>

        {/* ── How it works ──────────────────────────────────── */}
        <div className="bg-[#FAFAF8] py-16 px-5 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="font-body text-[10px] font-semibold tracking-[0.28em] uppercase text-gold mb-2">Simple Setup</p>
              <h2 className="font-display text-3xl font-semibold text-plum">How to Use</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center relative">
              {/* Connecting line — desktop only */}
              <div className="hidden sm:block absolute top-6 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-cream-dark" />
              {[
                { step: '01', title: 'Unbox', desc: 'Remove the wooden cap and inner seal from the glass bottle.', icon: '📦' },
                { step: '02', title: 'Install', desc: 'Clip onto your air vent or hang from the rearview mirror.', icon: '🚗' },
                { step: '03', title: 'Enjoy', desc: 'Experience up to 120+ days of premium botanical fragrance.', icon: '✨' },
              ].map(({ step, title, desc, icon }) => (
                <div key={step} className="space-y-3 relative">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-gold/40 shadow-soft flex items-center justify-center mx-auto text-xl">
                    {icon}
                  </div>
                  <p className="font-body text-[9px] font-bold uppercase tracking-[0.2em] text-gold">{step}</p>
                  <h3 className="font-display text-xl font-semibold text-plum">{title}</h3>
                  <p className="font-body text-[13px] text-muted leading-relaxed max-w-[200px] mx-auto">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Related products ──────────────────────────────── */}
        {related && related.length > 0 && (
          <div className="bg-white border-t border-cream-dark">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 py-16">
              <div className="text-center mb-10">
                <p className="font-body text-[10px] font-semibold tracking-[0.3em] uppercase text-gold mb-2">
                  Complete the Collection
                </p>
                <h2 className="font-display text-3xl md:text-[2.6rem] font-semibold text-plum">
                  You May Also Like
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((rel) => (
                  <ProductCard key={rel.id} product={rel} />
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}
