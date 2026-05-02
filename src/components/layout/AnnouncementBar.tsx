import Link from 'next/link'

export default function AnnouncementBar() {
  return (
    <div className="bg-gold text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 h-9 flex items-center justify-center gap-4">
        <p className="font-body text-[10px] font-semibold tracking-[0.18em] uppercase text-center">
          🍁 Free Shipping on Orders $30+ across Canada &nbsp;·&nbsp;{' '}
          <Link href="/products" className="underline underline-offset-2 hover:no-underline">
            Shop Now
          </Link>
        </p>
      </div>
    </div>
  )
}
