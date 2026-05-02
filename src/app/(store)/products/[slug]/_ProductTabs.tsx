'use client'

import { useState } from 'react'

interface Props {
  productName: string
  category: string
}

const REVIEWS = [
  {
    name: 'Amara K.',
    location: 'Toronto, ON',
    rating: 5,
    date: 'April 2026',
    initial: 'A',
    color: '#8B89C8',
    text: "I was skeptical at first but this truly lasts months. My car smells absolutely divine every single morning. Everyone who gets in asks what scent it is!",
  },
  {
    name: 'Sophie R.',
    location: 'Vancouver, BC',
    rating: 5,
    date: 'March 2026',
    initial: 'S',
    color: '#C87868',
    text: "The glass bottle and wooden cap look incredibly elegant on my dashboard. Not your typical cardboard tree! The scent is authentic and never chemical.",
  },
  {
    name: 'David M.',
    location: 'Ottawa, ON',
    rating: 5,
    date: 'March 2026',
    initial: 'D',
    color: '#C49A6C',
    text: "Bought three for my whole family. My wife absolutely loves hers. The dual-install option is genius — I use the vent clip and it disperses so evenly.",
  },
  {
    name: 'Priya S.',
    location: 'Calgary, AB',
    rating: 5,
    date: 'February 2026',
    initial: 'P',
    color: '#6B8F61',
    text: "120 days is not an exaggeration. I've been tracking it and we're at 3 months and it's still going strong. Worth every penny for the quality.",
  },
]

const INGREDIENTS = [
  { label: 'Fragrance Oils', value: 'Premium fine fragrance blend — alcohol-free' },
  { label: 'Bottle', value: 'Hand-blown borosilicate glass' },
  { label: 'Cap', value: 'Sustainably sourced hardwood' },
  { label: 'Reed Diffuser', value: 'Natural rattan reeds × 4' },
  { label: 'Formula', value: 'Alcohol-free, non-toxic, family safe' },
  { label: 'Origin', value: 'Handcrafted in Canada 🍁' },
]

const TABS = ['Description', 'Ingredients', 'Reviews (48)'] as const
type Tab = (typeof TABS)[number]

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1}
      className={`w-3.5 h-3.5 ${filled ? 'text-gold' : 'text-cream-dark'}`}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

export default function ProductTabs({ productName, category }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Description')

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-cream-dark overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 font-body text-[11px] font-semibold tracking-[0.18em] uppercase whitespace-nowrap flex-shrink-0 border-b-2 transition-all duration-200 ${
              activeTab === tab
                ? 'border-gold text-gold'
                : 'border-transparent text-muted hover:text-plum'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Description tab */}
      {activeTab === 'Description' && (
        <div className="py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-5">
            <p className="font-body text-[14px] text-muted leading-[1.9]">
              <strong className="text-plum font-semibold">{productName}</strong> is a premium botanical car air
              freshener crafted with care in Canada. Using fine fragrance oils in a handblown glass bottle with a
              sustainably sourced wooden cap, this elegant diffuser delivers a consistent, long-lasting scent to
              your vehicle — day after day.
            </p>
            <p className="font-body text-[14px] text-muted leading-[1.9]">
              Unlike conventional paper or gel fresheners, our alcohol-free formula is dispersed through natural
              rattan reeds that draw the fragrance oil up continuously. The result is a clean, even scent that
              fills your car without overwhelming it — lasting up to <strong className="text-plum font-semibold">120+ days</strong>.
            </p>
            <ul className="space-y-2.5 pt-2">
              {[
                'Long-lasting botanical fragrance — up to 120+ days',
                'Alcohol-free formula, safe for the whole family',
                'Dual installation: vent clip or hanging rearview mirror',
                'Handcrafted wooden cap with hand-blown glass bottle',
                'Natural rattan reed diffuser included',
                'Proudly made in Canada 🍁',
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 font-body text-[13px] text-muted">
                  <span className="mt-1 w-4 h-4 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Specs table */}
          <div className="bg-cream-light rounded-2xl p-6 space-y-1 border border-cream-dark self-start">
            <p className="font-body text-[10px] font-semibold tracking-[0.22em] uppercase text-muted mb-4">
              Product Specifications
            </p>
            {[
              { label: 'Scent Duration', value: '120+ days' },
              { label: 'Volume', value: '50 ml' },
              { label: 'Bottle Material', value: 'Borosilicate Glass' },
              { label: 'Cap Material', value: 'Natural Hardwood' },
              { label: 'Formula', value: 'Alcohol-Free' },
              { label: 'Installation', value: 'Vent Clip / Mirror Hang' },
              { label: 'Origin', value: 'Canada' },
              { label: 'Category', value: category.charAt(0).toUpperCase() + category.slice(1) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-cream-dark last:border-0">
                <span className="font-body text-[12px] text-muted">{label}</span>
                <span className="font-body text-[12px] font-semibold text-plum">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ingredients tab */}
      {activeTab === 'Ingredients' && (
        <div className="py-10 max-w-2xl space-y-6">
          <p className="font-body text-[14px] text-muted leading-[1.9]">
            We believe in full transparency. Every BlossomRays freshener uses premium-grade fragrance oils
            with zero harsh chemicals, zero alcohol, and zero synthetic carriers — just pure botanical scent
            in an elegant glass diffuser.
          </p>
          <div className="space-y-0 border border-cream-dark rounded-2xl overflow-hidden">
            {INGREDIENTS.map(({ label, value }, idx) => (
              <div
                key={label}
                className={`flex items-start gap-4 px-5 py-4 ${idx % 2 === 0 ? 'bg-cream-light' : 'bg-white'}`}
              >
                <span className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-plum w-32 flex-shrink-0 pt-0.5">
                  {label}
                </span>
                <span className="font-body text-[13px] text-muted">{value}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4">
            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-body text-[12px] text-emerald-800 leading-relaxed">
              All ingredients are non-toxic, alcohol-free, and safe for children and pets.
            </p>
          </div>
        </div>
      )}

      {/* Reviews tab */}
      {activeTab === 'Reviews (48)' && (
        <div className="py-10 space-y-8">
          {/* Summary bar */}
          <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center bg-cream-light rounded-2xl border border-cream-dark p-6">
            <div className="text-center">
              <p className="font-display text-5xl font-semibold text-plum leading-none">5.0</p>
              <div className="flex gap-0.5 justify-center mt-2">
                {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} filled={true} />)}
              </div>
              <p className="font-body text-[11px] text-muted mt-1.5">48 reviews</p>
            </div>
            <div className="flex-1 w-full space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const pct = star === 5 ? 88 : star === 4 ? 10 : 2
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="font-body text-[11px] text-muted w-4">{star}</span>
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-gold flex-shrink-0">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <div className="flex-1 h-2 bg-cream-dark rounded-full overflow-hidden">
                      <div className="h-full bg-gold rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="font-body text-[11px] text-muted w-8 text-right">{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Review cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {REVIEWS.map((r) => (
              <div key={r.name} className="bg-white border border-cream-dark rounded-2xl p-5 space-y-3 hover:shadow-soft transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-display font-semibold text-sm flex-shrink-0"
                      style={{ backgroundColor: r.color }}
                    >
                      {r.initial}
                    </div>
                    <div>
                      <p className="font-body text-[13px] font-semibold text-plum">{r.name}</p>
                      <p className="font-body text-[10px] text-muted">{r.location}</p>
                    </div>
                  </div>
                  <span className="font-body text-[10px] text-muted flex-shrink-0">{r.date}</span>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} filled={i < r.rating} />)}
                </div>
                <p className="font-body text-[13px] text-muted leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center gap-1.5 pt-1">
                  <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-body text-[10px] text-emerald-600 font-semibold">Verified Purchase</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
