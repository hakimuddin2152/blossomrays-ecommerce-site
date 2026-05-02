'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import CartDrawer from '@/components/cart/CartDrawer'
import { cn } from '@/lib/utils/cn'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Shop' },
  { href: '/products/lavender-car-air-freshener', label: 'Lavender' },
  { href: '/products/rose-car-air-freshener', label: 'Rose' },
  { href: '/products/millennium-car-air-freshener', label: 'Millennium' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const cartCount = useCartStore((s) => s.totalItems())

  return (
    <>
      {/* ── Sticky header wrapper ────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-white">

        {/* ── Tier 2: Logo + Search + Icons ──────────────────── */}
        <div className="border-b border-cream-dark">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 flex items-center gap-5 h-20">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="BlossomRays"
                width={180}
                height={148}
                className="h-24 w-auto object-contain"
                priority
              />
            </Link>

            {/* Search bar */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="flex w-full border border-cream-dark">
                <select
                  className="border-r border-cream-dark px-3 text-[10px] tracking-[0.14em] uppercase text-muted bg-white outline-none h-10 cursor-pointer"
                  defaultValue=""
                  aria-label="Category"
                >
                  <option value="">All Categories</option>
                  <option value="lavender">Lavender</option>
                  <option value="rose">Rose</option>
                  <option value="millennium">Millennium</option>
                </select>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 px-4 h-10 text-[13px] text-plum placeholder:text-muted outline-none"
                />
                <button
                  className="bg-plum hover:bg-gold text-white px-4 h-10 transition-colors duration-200"
                  aria-label="Search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-0 ml-auto md:ml-0">
              {/* Account */}
              <Link
                href="/account"
                className="hidden md:flex flex-col items-center gap-0 px-4 py-2 text-muted hover:text-gold transition-colors"
                aria-label="My Account"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span className="text-[9px] uppercase tracking-[0.12em] mt-0.5">Account</span>
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex flex-col items-center gap-0 px-4 py-2 text-muted hover:text-gold transition-colors"
                aria-label={`Cart — ${cartCount} items`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                <span className="text-[9px] uppercase tracking-[0.12em] mt-0.5 hidden md:block">
                  Cart ({cartCount})
                </span>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-2 w-[16px] h-[16px] bg-gold text-white text-[9px] font-semibold flex items-center justify-center leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 text-muted hover:text-plum transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  {mobileOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  }
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── Tier 3: Category navigation ────────────────────── */}
        <div className="hidden md:block border-b border-cream-dark bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 flex items-center gap-8 h-11">
            {navLinks.map((link) => {
              const isActive = link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'font-body text-[11px] font-semibold tracking-[0.2em] uppercase whitespace-nowrap transition-colors duration-200 h-full flex items-center border-b-2 -mb-px',
                    isActive
                      ? 'text-gold border-gold'
                      : 'text-plum border-transparent hover:text-gold hover:border-gold',
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* ── Mobile menu ─────────────────────────────────────── */}
        {mobileOpen && (
          <div className="md:hidden border-b border-cream-dark bg-white px-5 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2.5 border-b border-cream-dark font-body text-[11px] font-semibold tracking-[0.18em] uppercase text-plum hover:text-gold transition-colors last:border-0"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/account"
              className="block py-2.5 font-body text-[11px] font-semibold tracking-[0.18em] uppercase text-plum hover:text-gold transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Account
            </Link>
          </div>
        )}
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

