'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const stats = [
  { value: '120+', label: 'Days Lasting' },
  { value: '3', label: 'Signature Scents' },
  { value: '100%', label: 'Alcohol-Free' },
  { value: '🍁', label: 'Made in Canada' },
]

export default function HeroSection() {
  return (
    <section>
      {/* ── Full-width banner ──────────────────────────────── */}
      <div className="relative min-h-[88vh] flex items-center overflow-hidden">
        {/* Banner background image */}
        <Image
          src="/images/banner_image.png"
          alt="BlossomRays botanical car air fresheners"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />

        {/* Gradient overlay — dark left, fades right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/95 via-[#0d0d0d]/75 to-[#0d0d0d]/25" />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/70 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-[540px] space-y-7"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-gold/40 bg-gold/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse flex-shrink-0" />
              <span className="font-body text-[10px] font-semibold tracking-[0.22em] uppercase text-gold">
                New Season · Limited Offer
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-[3.2rem] sm:text-[4rem] xl:text-[5rem] font-semibold text-white leading-[1.04]">
              Elevate<br />
              <em className="italic" style={{ color: '#E8A8A0' }}>Every Drive</em>
            </h1>

            {/* Sub copy */}
            <p className="font-body text-white/55 text-[15px] sm:text-base leading-relaxed max-w-[380px]">
              Premium botanical car air fresheners — alcohol-free, handcrafted in Canada.
              Lavender, Rose &amp; Millennium. Lasting 120+ days.
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-body text-[11px] uppercase tracking-[0.18em] text-white/35">From</span>
              <span className="font-display text-3xl font-semibold text-gold">$17.99</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-white font-body text-[11px] font-semibold tracking-[0.18em] uppercase px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-gold/20"
              >
                Shop Collection
              </Link>
              <a
                href="#collection"
                className="font-body text-[11px] font-medium tracking-[0.18em] uppercase text-white/45 hover:text-gold transition-colors duration-200"
              >
                Explore Scents ↓
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Stats strip ────────────────────────────────────── */}
      <div className="bg-[#0d0d0d] border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/[0.07]">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center py-5 gap-1.5">
                <span className="font-display text-[2.2rem] font-semibold text-gold leading-none">
                  {value}
                </span>
                <span className="font-body text-[11px] font-semibold tracking-[0.16em] uppercase text-white/50">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
