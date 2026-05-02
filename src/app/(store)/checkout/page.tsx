'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import CartSummary from '@/components/cart/CartSummary'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Link from 'next/link'

const ShippingSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email required'),
  street_line_1: z.string().min(3, 'Street address is required'),
  street_line_2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(4, 'ZIP code is required'),
  country: z.string().length(2, 'Use 2-letter country code (e.g. US)').default('US'),
})

type ShippingForm = z.infer<typeof ShippingSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingForm>({
    resolver: zodResolver(ShippingSchema),
    defaultValues: { country: 'US' },
  })

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-body text-muted text-lg">Your cart is empty.</p>
          <Link href="/products">
            <Button variant="outline">Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  const onSubmit = async (data: ShippingForm) => {
    setLoading(true)
    setError(null)

    const { email, ...shipping } = data

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, shipping, email }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error ?? 'Something went wrong. Please try again.')
        return
      }

      if (json.url) {
        clearCart()
        window.location.href = json.url
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <h1 className="font-display text-4xl font-semibold text-plum mb-10">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Shipping form */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-2xl shadow-soft border border-cream-dark p-6 space-y-5">
                <h2 className="font-display text-xl font-semibold text-plum">
                  Shipping Information
                </h2>

                <Input
                  label="Full Name"
                  placeholder="Jane Smith"
                  error={errors.full_name?.message}
                  {...register('full_name')}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="jane@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Input
                  label="Street Address"
                  placeholder="123 Blossom Lane"
                  error={errors.street_line_1?.message}
                  {...register('street_line_1')}
                />

                <Input
                  label="Apartment, Suite, etc. (optional)"
                  placeholder="Apt 4B"
                  {...register('street_line_2')}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    placeholder="New York"
                    error={errors.city?.message}
                    {...register('city')}
                  />
                  <Input
                    label="State"
                    placeholder="NY"
                    error={errors.state?.message}
                    {...register('state')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="ZIP Code"
                    placeholder="10001"
                    error={errors.zip?.message}
                    {...register('zip')}
                  />
                  <Input
                    label="Country"
                    placeholder="US"
                    hint="2-letter code (e.g. US, CA, GB)"
                    error={errors.country?.message}
                    {...register('country')}
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm font-body text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-200">
                  {error}
                </p>
              )}
            </div>

            {/* Order summary sidebar */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl shadow-soft border border-cream-dark p-6">
                <h2 className="font-display text-xl font-semibold text-plum mb-5">
                  Order Summary
                </h2>

                {/* Mini item list */}
                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${
                        item.product.category === 'lavender' ? 'bg-lavender-light' : 'bg-rose-light'
                      }`}>
                        {item.product.category === 'lavender' ? '💜' : '🌹'}
                      </span>
                      <span className="font-body text-sm text-plum flex-1 truncate">
                        {item.product.name}
                      </span>
                      <span className="font-body text-sm font-medium text-plum">×{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <CartSummary subtotal={subtotal()} showFreeShippingNote={false} />
              </div>

              <Button type="submit" size="lg" className="w-full" loading={loading}>
                {loading ? 'Redirecting to Stripe...' : 'Pay Securely with Stripe'}
                {!loading && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                )}
              </Button>

              <p className="text-center font-body text-xs text-muted">
                🔒 Your payment is encrypted and processed securely by Stripe. We never store your card details.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
