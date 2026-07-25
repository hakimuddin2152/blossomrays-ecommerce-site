import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

const slides = [
  {
    image: '/images/banner_image.png',
    badge: 'New Season · Limited Offer',
    headline: ['Elevate', 'Every Drive'],
    accentLine: 1,
    sub: 'Premium botanical car air fresheners — alcohol-free, handcrafted in Canada. Lavender, Rose & Millennium. Lasting 120+ days.',
    cta: { label: 'Shop Collection', href: '/products' },
  },
  {
    image: '/images/banner_image.png',
    badge: 'Signature Scent · Rose',
    headline: ['Bloom', 'On the Road'],
    accentLine: 1,
    sub: 'Bulgarian rose · peony · soft musk. Romance in every mile.',
    cta: { label: 'Shop Rose', href: '/products/rose-car-air-freshener' },
  },
  {
    image: '/images/banner_image.png',
    badge: 'Signature Scent · Lavender',
    headline: ['Calm', 'Your Commute'],
    accentLine: 1,
    sub: 'French lavender · bergamot · cedarwood. Serenity from the first breath.',
    cta: { label: 'Shop Lavender', href: '/products/lavender-car-air-freshener' },
  },
];

const stats = [
  { value: '120+', label: 'Days Lasting' },
  { value: '3', label: 'Signature Scents' },
  { value: '100%', label: 'Alcohol-Free' },
  { value: '🍁', label: 'Made in Canada' },
];

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <section>
      <!-- Carousel banner -->
      <div
        class="relative h-[60vh] overflow-hidden"
        (mouseenter)="paused = true"
        (mouseleave)="paused = false"
      >
        <!-- Image -->
        <div class="absolute inset-0 transition-opacity duration-700">
          <img
            [src]="current().image"
            [alt]="current().badge"
            class="w-full h-full object-cover object-center"
          />
        </div>

        <!-- Overlays -->
        <div class="absolute inset-0 bg-gradient-to-r from-[#080808]/95 via-[#0d0d0d]/75 to-[#0d0d0d]/25"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-[#080808]/70 via-transparent to-transparent"></div>

        <!-- Content -->
        <div class="relative z-10 h-full flex items-center">
          <div class="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
            <div class="max-w-xl space-y-5">
              <!-- Badge -->
              <span class="inline-block font-body text-[10px] font-semibold tracking-[0.28em] uppercase text-gold/90 border border-gold/40 px-3 py-1">
                {{ current().badge }}
              </span>

              <!-- Headline -->
              <h1 class="font-display font-semibold text-white leading-none">
                <span
                  *ngFor="let line of current().headline; let i = index"
                  class="block"
                  [class.text-gold]="i === current().accentLine"
                  [ngStyle]="{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }"
                >{{ line }}</span>
              </h1>

              <!-- Sub -->
              <p class="font-body text-[15px] text-white/60 leading-relaxed max-w-md">
                {{ current().sub }}
              </p>

              <!-- CTA -->
              <a
                [routerLink]="current().cta.href"
                class="btn-primary inline-flex"
              >
                {{ current().cta.label }}
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Slide indicators -->
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          <button
            *ngFor="let s of slides; let i = index"
            (click)="setCurrent(i)"
            [class]="i === currentIndex() ? 'w-6 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'"
            class="transition-all duration-300 rounded-full"
            [attr.aria-label]="'Slide ' + (i + 1)"
          ></button>
        </div>

        <!-- Arrow controls -->
        <button
          (click)="prev()"
          class="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Previous slide"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
          </svg>
        </button>
        <button
          (click)="next()"
          class="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Next slide"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
          </svg>
        </button>
      </div>

      <!-- Stats bar -->
      <div class="bg-white border-b border-cream-dark">
        <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-cream-dark">
          <div *ngFor="let stat of stats" class="flex flex-col items-center py-6 gap-0.5">
            <span class="font-display text-2xl font-semibold text-plum">{{ stat.value }}</span>
            <span class="font-body text-[11px] tracking-[0.12em] uppercase text-muted">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  readonly slides = slides;
  readonly stats = stats;
  readonly currentIndex = signal(0);
  readonly current = signal(slides[0]);
  paused = false;
  private intervalId?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      if (!this.paused) this.next();
    }, 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  next(): void {
    const idx = (this.currentIndex() + 1) % slides.length;
    this.currentIndex.set(idx);
    this.current.set(slides[idx]);
  }

  prev(): void {
    const idx = (this.currentIndex() - 1 + slides.length) % slides.length;
    this.currentIndex.set(idx);
    this.current.set(slides[idx]);
  }

  setCurrent(idx: number): void {
    this.currentIndex.set(idx);
    this.current.set(slides[idx]);
  }
}
