import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#1A1A1A] text-white/60">

      {/* Main */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/10">

        {/* Brand + newsletter */}
        <div className="space-y-5">
          <Image
            src="/images/logo.png"
            alt="BlossomRays"
            width={110}
            height={90}
            className="h-20 w-auto object-contain brightness-0 invert opacity-80"
          />
          <p className="font-body text-sm text-white/40 leading-relaxed max-w-xs">
            Premium botanical car air fresheners. Alcohol-free, long-lasting, and proudly made in Canada.
          </p>
          <form className="flex border border-white/20 max-w-xs">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-transparent px-3 py-2.5 text-[12px] text-white/70 placeholder:text-white/35 outline-none"
            />
            <button
              type="button"
              className="px-4 text-[10px] font-semibold tracking-[0.14em] uppercase text-white/80 hover:text-gold transition-colors"
            >
              Join
            </button>
          </form>
        </div>

        {/* Quick Menu */}
        <div className="space-y-5">
          <h3 className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">
            Quick Menu
          </h3>
          <ul className="space-y-3">
            {[
              { href: '/products/lavender-car-air-freshener', label: 'Lavender' },
              { href: '/products/rose-car-air-freshener', label: 'Rose' },
              { href: '/products/millennium-car-air-freshener', label: 'Millennium' },
              { href: '/products', label: 'All Products' },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-body text-sm text-white/40 hover:text-gold transition-colors duration-150">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Information */}
        <div className="space-y-5">
          <h3 className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">
            Information
          </h3>
          <ul className="space-y-3">
            {[
              { href: '/account/orders', label: 'Track Order' },
              { href: '/account', label: 'My Account' },
              { href: '/login', label: 'Login' },
              { href: '/register', label: 'Register' },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-body text-sm text-white/40 hover:text-gold transition-colors duration-150">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div className="space-y-5">
          <h3 className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">
            Follow Us
          </h3>
          <ul className="space-y-3">
            {['Facebook', 'Instagram', 'Pinterest', 'Twitter'].map((item) => (
              <li key={item}>
                <a href="#" className="font-body text-sm text-white/40 hover:text-gold transition-colors duration-150">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-5 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-[11px] text-white/25 tracking-wide">
            &copy; {year} BlossomRays Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-white/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <rect x="3" y="11" width="18" height="11" rx="2" strokeLinecap="round" strokeLinejoin="round" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <p className="font-body text-[11px] text-white/25 tracking-wide">
              Payments secured by Stripe
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
