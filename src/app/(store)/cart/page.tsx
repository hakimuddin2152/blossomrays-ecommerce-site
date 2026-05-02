'use client'

import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import Button from '@/components/ui/Button'

export default function CartPage() {
  const { items, subtotal } = useCartStore()
  const hasItems = items.length > 0

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <h1 className="font-display text-4xl font-semibold text-plum mb-8">Your Cart</h1>

        {!hasItems ? (
          <div className="text-center py-24 space-y-4">
            <span className="text-7xl block">🛒</span>
            <p className="font-body text-muted text-lg">Your cart is empty</p>
            <Link href="/products">
              <Button variant="outline" className="mt-2">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft border border-cream-dark p-6">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-soft border border-cream-dark p-6">
                <h2 className="font-display text-xl font-semibold text-plum mb-5">
                  Order Summary
                </h2>
                <CartSummary subtotal={subtotal()} />
              </div>

              <Link href="/checkout">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
