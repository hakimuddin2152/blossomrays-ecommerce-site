'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="text-center max-w-md">
        <h1 className="font-cormorant text-5xl font-semibold text-plum mb-4">
          Something went wrong
        </h1>
        <p className="text-plum/60 mb-8">
          An unexpected error occurred. Please try again or return to the shop.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-lavender text-white rounded-full text-sm font-medium hover:bg-lavender/90 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/products"
            className="px-6 py-3 border border-plum/20 text-plum rounded-full text-sm font-medium hover:bg-plum/5 transition-colors"
          >
            Back to shop
          </Link>
        </div>
      </div>
    </div>
  )
}
