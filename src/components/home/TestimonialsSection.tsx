const testimonials = [
  {
    name: 'Amara K.',
    location: 'Toronto, ON',
    quote: "The Lavender freshener completely transforms my morning commute. It's subtle, luxurious, and lasts so much longer than anything I've tried before.",
    rating: 5,
    product: 'Lavender',
    initial: 'A',
  },
  {
    name: 'Sophie R.',
    location: 'Vancouver, BC',
    quote: 'I bought the Rose one as a gift for my sister and ended up ordering one for myself. The scent is absolutely divine — genuine rose fragrance, not overpowering at all.',
    rating: 5,
    product: 'Rose',
    initial: 'S',
  },
  {
    name: 'Mohammed A.',
    location: 'Calgary, AB',
    quote: "Fantastic little addition to my car interior. I love the option to install it on a vent or hang it from the mirror. The smell is really noticeable and welcoming.",
    rating: 5,
    product: 'Millennium',
    initial: 'M',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="bg-white py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
          <p className="font-body text-[10px] font-semibold tracking-[0.26em] uppercase text-gold">
            Customer Reviews
          </p>
          <h2 className="font-display text-4xl md:text-[3.2rem] font-semibold text-plum">
            What Drivers Say
          </h2>
          <p className="font-body text-[15px] text-muted leading-relaxed">
            Trusted by hundreds of happy drivers across Canada.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-[#FAFAF8] border border-cream-dark rounded-2xl p-7 space-y-5 hover:shadow-soft transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    viewBox="0 0 20 20"
                    fill={i < t.rating ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth={1.2}
                    className={`w-4 h-4 ${i < t.rating ? 'text-gold' : 'text-cream-dark'}`}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-body text-plum/70 text-[14px] leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Reviewer */}
              <div className="flex items-center gap-3 pt-2 border-t border-cream-dark">
                <div className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-sm font-semibold text-gold">{t.initial}</span>
                </div>
                <div>
                  <p className="font-body text-[13px] font-semibold text-plum">{t.name}</p>
                  <p className="font-body text-[11px] text-muted mt-0.5">{t.location} · {t.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
