'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils/formatPrice'
import type { Product } from '@/types'

const PRODUCTS: Product[] = [
  {
    id: 'b1f1a000-0000-4000-a000-000000000001',
    name: 'Rose Car Air Freshener',
    slug: 'rose-car-air-freshener',
    tagline: 'Bloom on the road',
    description: null,
    price: 1799,
    compare_at_price: null,
    stock: 100,
    category: 'rose',
    is_active: true,
    images: ['/images/rose/Main_Image_Rose.jpg'],
    seo_title: null, seo_description: null,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'b1f1a000-0000-4000-a000-000000000002',
    name: 'Lavender Car Air Freshener',
    slug: 'lavender-car-air-freshener',
    tagline: 'Calm your commute',
    description: null,
    price: 1799,
    compare_at_price: null,
    stock: 100,
    category: 'lavender',
    is_active: true,
    images: ['/images/lavender/1.jpg'],
    seo_title: null, seo_description: null,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'b1f1a000-0000-4000-a000-000000000003',
    name: 'Millennium Car Air Freshener',
    slug: 'millennium-car-air-freshener',
    tagline: 'A scent beyond time',
    description: null,
    price: 1799,
    compare_at_price: null,
    stock: 100,
    category: 'millennium',
    is_active: true,
    images: ['/images/millenium/1.jpg'],
    seo_title: null, seo_description: null,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
]

function ScentCard({ product }: { product: Product }) {
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setAdding(true)
    addItem(product)
    await new Promise((r) => setTimeout(r, 700))
    setAdding(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Link href={`/products/${product.slug}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-cream-dark/50 hover:-translate-y-0.5">
        <div className="relative overflow-hidden bg-cream-light" style={{ aspectRatio: '1 / 1' }}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        <div className="px-4 py-3.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-display text-[1rem] font-semibold text-plum leading-tight truncate group-hover:text-gold transition-colors duration-200">
              {product.name}
            </p>
            <span className="font-body text-[0.95rem] font-bold text-plum">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={adding}
            aria-label="Add to cart"
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
              added
                ? 'bg-emerald-500 text-white scale-110'
                : 'bg-plum hover:bg-gold text-white hover:scale-105'
            }`}
          >
            {adding ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin block" />
            ) : added ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </Link>
  )
}

export default function ScentHighlights() {
  return (
    <section id="collection" className="bg-[#FAFAF8] py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-body text-[10px] font-semibold tracking-[0.3em] uppercase text-gold mb-3">
            Handcrafted in Canada
          </p>
          <h2 className="font-display text-4xl md:text-[3.2rem] font-semibold text-plum mb-4">
            Our Scents
          </h2>
          <p className="font-body text-[15px] text-muted max-w-md mx-auto leading-relaxed">
            Three signature botanical scents, each crafted to transform your driving experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((p) => (
            <ScentCard key={p.id} product={p} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-plum hover:bg-gold text-white font-body text-[11px] font-semibold tracking-[0.18em] uppercase px-8 py-3.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
          >
            View All Products
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
