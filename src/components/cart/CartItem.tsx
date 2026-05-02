'use client'

import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils/formatPrice'
import Button from '@/components/ui/Button'
import type { CartItem as CartItemType } from '@/types'

export default function CartItem({ item }: { item: CartItemType }) {
  const { removeItem, updateQuantity } = useCartStore()
  const isLavender = item.product.category === 'lavender'

  return (
    <div className="flex items-center gap-4 py-4 border-b border-cream-dark last:border-0">
      {/* Product thumbnail */}
      <div
        className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 ${
          isLavender ? 'bg-lavender-light' : 'bg-rose-light'
        }`}
      >
        {isLavender ? '💜' : '🌹'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-body font-medium text-plum text-sm leading-tight truncate">
          {item.product.name}
        </p>
        <p className="font-body text-sm text-muted mt-0.5">
          {formatPrice(item.product.price)} each
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            className="w-7 h-7 rounded-full border border-cream-dark flex items-center justify-center text-plum hover:bg-cream-dark transition-colors text-sm"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="font-body text-sm font-medium text-plum w-4 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            className="w-7 h-7 rounded-full border border-cream-dark flex items-center justify-center text-plum hover:bg-cream-dark transition-colors text-sm"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Subtotal + remove */}
      <div className="text-right flex-shrink-0 space-y-1">
        <p className="font-body font-semibold text-plum text-sm">
          {formatPrice(item.product.price * item.quantity)}
        </p>
        <button
          onClick={() => removeItem(item.product.id)}
          className="text-xs font-body text-muted hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          Remove
        </button>
      </div>
    </div>
  )
}
