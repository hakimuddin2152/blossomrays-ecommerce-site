import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="text-center max-w-md">
        <p className="font-cormorant text-8xl font-semibold text-lavender mb-4">404</p>
        <h1 className="font-cormorant text-4xl font-semibold text-plum mb-4">
          Page not found
        </h1>
        <p className="text-plum/60 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/products"
          className="inline-block px-8 py-3 bg-lavender text-white rounded-full text-sm font-medium hover:bg-lavender/90 transition-colors"
        >
          Shop our fragrances
        </Link>
      </div>
    </div>
  )
}
