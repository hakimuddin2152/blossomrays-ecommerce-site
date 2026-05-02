import Image from 'next/image'
import Link from 'next/link'

const promos = [
  {
    eyebrow: 'Pick Your Items',
    heading: 'Best\nCollection',
    sub: 'Handcrafted lavender and rose fresheners. Alcohol-free, lasting up to 4 months.',
    href: '/products',
    cta: 'Shop Now',
    image: '/images/lavender/1.jpg',
    dark: false,
  },
  {
    eyebrow: "Maybe You've Earned It",
    heading: 'New\nSeason',
    sub: 'Discover the Millennium collection — a sophisticated, timeless scent for every journey.',
    href: '/products/millennium-car-air-freshener',
    cta: 'Explore Millennium',
    image: '/images/millenium/1.jpg',
    dark: true,
  },
]

export default function PromoGrid() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {promos.map((promo) => (
        <div
          key={promo.eyebrow}
          className="relative flex items-center overflow-hidden min-h-[480px]"
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src={promo.image}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Overlay */}
          <div
            className={`absolute inset-0 ${
              promo.dark
                ? 'bg-[#1A1A1A]/82'
                : 'bg-white/72'
            }`}
          />

          {/* Content */}
          <div className="relative z-10 px-10 lg:px-14 py-14 space-y-6">
            <p
              className={`font-body text-[10px] font-semibold tracking-[0.26em] uppercase ${
                promo.dark ? 'text-gold' : 'text-muted'
              }`}
            >
              {promo.eyebrow}
            </p>
            <h2
              className={`font-display text-[3rem] font-semibold leading-[1.04] whitespace-pre-line ${
                promo.dark ? 'text-white' : 'text-plum'
              }`}
            >
              {promo.heading}
            </h2>
            <p
              className={`font-body text-sm leading-relaxed max-w-[280px] ${
                promo.dark ? 'text-white/50' : 'text-muted'
              }`}
            >
              {promo.sub}
            </p>
            <Link
              href={promo.href}
              className={`inline-flex items-center font-body text-[11px] font-semibold tracking-[0.18em] uppercase px-8 py-3.5 border transition-colors duration-200 ${
                promo.dark
                  ? 'border-white/50 text-white hover:border-gold hover:text-gold'
                  : 'border-plum text-plum hover:bg-plum hover:text-white'
              }`}
            >
              {promo.cta}
            </Link>
          </div>
        </div>
      ))}
    </section>
  )
}
