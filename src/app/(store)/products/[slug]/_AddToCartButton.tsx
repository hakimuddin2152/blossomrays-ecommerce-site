'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types'

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const isOutOfStock = product.stock === 0

  const handleAdd = async () => {
    if (isOutOfStock) return
    addItem(product, quantity)
    setAdded(true)
    await new Promise((r) => setTimeout(r, 2000))
    setAdded(false)
  }

  return (
    <div className="space-y-4">
      {/* Qty + ATC row */}
      <div className="flex items-center gap-3">
        {/* Pill quantity selector */}
        <div className="flex items-center rounded-full border border-cream-dark overflow-hidden bg-white shadow-sm flex-shrink-0">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-11 h-12 flex items-center justify-center font-body text-plum hover:text-gold hover:bg-cream-light transition-colors text-xl"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center font-body font-semibold text-plum text-sm">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
            className="w-11 h-12 flex items-center justify-center font-body text-plum hover:text-gold hover:bg-cream-light transition-colors text-xl"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAdd}
          disabled={isOutOfStock || added}
          className={`flex-1 h-12 rounded-full font-body text-[11px] font-semibold tracking-[0.18em] uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${
            added
              ? 'bg-sage text-white shadow-sage/20'
              : isOutOfStock
              ? 'bg-cream-dark text-muted cursor-not-allowed'
              : 'bg-plum hover:bg-gold text-white shadow-plum/20 hover:shadow-gold/30 hover:scale-[1.02]'
          }`}
        >
          {added ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Added to Cart!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </>
          )}
        </button>

        {/* Wishlist */}
        <button
          className="w-12 h-12 flex-shrink-0 rounded-full border border-cream-dark bg-white flex items-center justify-center text-muted hover:text-rose-400 hover:border-rose-300 transition-all duration-200 shadow-sm"
          aria-label="Add to Wishlist"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      {/* Trust strip */}
      <div className="flex flex-wrap gap-3 pt-1">
        {[
          { icon: '🇨🇦', text: 'Made in Canada' },
          { icon: '✓', text: '30-Day Returns' },
          { icon: '🚚', text: 'Free over $30' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-1.5 border border-cream-dark rounded-full px-3 py-1.5">
            <span className="text-[13px]">{icon}</span>
            <span className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

