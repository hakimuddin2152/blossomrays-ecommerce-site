'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import CartItem from './CartItem'
import CartSummary from './CartSummary'
import Button from '@/components/ui/Button'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, subtotal, clearCart } = useCartStore()
  const hasItems = items.length > 0

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-plum/30 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-soft-xl flex flex-col"
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-cream-dark">
              <h2 className="font-display text-2xl font-semibold text-plum">
                Your Cart
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-muted hover:text-plum hover:bg-cream-dark transition-colors"
                aria-label="Close cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-2 scrollbar-thin">
              {!hasItems ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
                  <span className="text-6xl">🛒</span>
                  <p className="font-body text-muted">Your cart is empty</p>
                  <Button variant="outline" size="sm" onClick={onClose}>
                    <Link href="/products">Start Shopping</Link>
                  </Button>
                </div>
              ) : (
                items.map((item) => <CartItem key={item.product.id} item={item} />)
              )}
            </div>

            {/* Footer */}
            {hasItems && (
              <div className="px-6 py-5 border-t border-cream-dark space-y-4 bg-cream">
                <CartSummary subtotal={subtotal()} />

                <Link href="/checkout" onClick={onClose} className="block">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Button>
                </Link>

                <button
                  onClick={clearCart}
                  className="w-full text-center font-body text-xs text-muted hover:text-red-500 transition-colors py-1"
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
