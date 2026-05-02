'use client'

import Image from 'next/image'
import { useState } from 'react'

interface Props {
  images: string[]
  name: string
}

export default function ProductGallery({ images, name }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  if (!images.length) return null

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))

  return (
    <div className="flex gap-4">
      {/* Vertical thumbnails — left side */}
      {images.length > 1 && (
        <div className="hidden sm:flex flex-col gap-2.5 w-[72px] flex-shrink-0">
          {images.slice(0, 5).map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative overflow-hidden rounded-xl border-2 transition-all duration-200 bg-cream-light flex-shrink-0 ${
                activeIndex === i
                  ? 'border-gold shadow-md'
                  : 'border-transparent hover:border-cream-dark opacity-60 hover:opacity-100'
              }`}
              style={{ aspectRatio: '1 / 1' }}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="72px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="flex-1 relative">
        <div
          className="relative w-full overflow-hidden rounded-2xl bg-cream-light cursor-zoom-in"
          style={{ aspectRatio: '1 / 1' }}
          onMouseEnter={() => setZoomed(true)}
          onMouseLeave={() => setZoomed(false)}
        >
          <Image
            src={images[activeIndex]}
            alt={`${name} — image ${activeIndex + 1}`}
            fill
            className={`object-cover transition-transform duration-500 ${zoomed ? 'scale-110' : 'scale-100'}`}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Image counter badge */}
          <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white font-body text-[10px] tracking-widest px-3 py-1 rounded-full">
            {activeIndex + 1} / {images.length}
          </div>

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-plum hover:bg-gold hover:text-white transition-all duration-200"
                aria-label="Previous image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-plum hover:bg-gold hover:text-white transition-all duration-200"
                aria-label="Next image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Mobile dot indicators */}
        {images.length > 1 && (
          <div className="sm:hidden flex justify-center gap-1.5 mt-3">
            {images.slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`rounded-full transition-all duration-200 ${
                  activeIndex === i ? 'w-5 h-2 bg-gold' : 'w-2 h-2 bg-cream-dark'
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
