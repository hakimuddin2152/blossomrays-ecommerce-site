'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils/formatPrice'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

const FALLBACK_IMAGES: Record<string, string> = {
  rose:       '/images/rose/Main_Image_Rose.jpg',
  lavender:   '/images/lavender/1.jpg',
  millennium: '/images/millenium/1.jpg',
}

export default function ProductCard({ product }: ProductCardProps) {
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const isOutOfStock = product.stock === 0
  const heroImage =
    (product.images?.length > 0 ? product.images[0] : null) ??
    FALLBACK_IMAGES[product.category] ??
    '/images/rose/Main_Image_Rose.jpg'

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock || adding) return
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

        {/* Image */}
        <div className="relative overflow-hidden bg-cream-light" style={{ aspectRatio: '1 / 1' }}>
          <Image
            src={heroImage}
            alt={product.name}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Sale badge */}
          {product.compare_at_price && (
            <div className="absolute top-3 left-3 bg-gold text-white text-[9px] font-body font-bold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full">
              Sale
            </div>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="font-body text-[10px] font-semibold tracking-[0.18em] uppercase text-muted bg-white border border-cream-dark px-4 py-2 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Card footer */}
        <div className="px-4 py-3.5 flex items-center justify-between gap-3">
          {/* Name + price */}
          <div className="min-w-0">
            <p className="font-display text-[1rem] font-semibold text-plum leading-tight truncate group-hover:text-gold transition-colors duration-200">
              {product.name}
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-body text-[0.95rem] font-bold text-plum">
                {formatPrice(product.price)}
              </span>
              {product.compare_at_price && (
                <span className="font-body text-[11px] text-muted line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            aria-label="Add to cart"
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed ${
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
