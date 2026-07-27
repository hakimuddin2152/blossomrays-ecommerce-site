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
        class="relative min-h-[82vh] overflow-hidden"
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

        <!-- Gradient overlays — let the image breathe a bit more -->
        <div class="absolute inset-0 bg-gradient-to-r from-[#0a0a09]/90 via-[#0a0a09]/60 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a09]/50 via-transparent to-transparent"></div>

        <!-- Content -->
        <div class="relative z-10 h-full min-h-[82vh] flex items-center">
          <div class="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
            <div class="max-w-2xl space-y-6">
              <!-- Badge — clean text eyebrow, no border box -->
              <p class="font-body text-[10px] font-semibold tracking-[0.30em] uppercase text-gold/80">
                {{ current().badge }}
              </p>

              <!-- Headline — editorial, large -->
              <h1 class="font-display font-semibold text-white leading-none">
                <span
                  *ngFor="let line of current().headline; let i = index"
                  class="block"
                  [class.text-gold]="i === current().accentLine"
                  [ngStyle]="{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }"
                >{{ line }}</span>
              </h1>

              <!-- Sub -->
              <p class="font-body text-[15px] text-white/55 leading-relaxed max-w-md">
                {{ current().sub }}
              </p>

              <!-- CTAs -->
              <div class="flex flex-wrap items-center gap-4 pt-2">
                <a
                  [routerLink]="current().cta.href"
                  class="btn-primary"
                >
                  {{ current().cta.label }}
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                  </svg>
                </a>
                <a routerLink="/products" class="font-body text-[11px] font-medium tracking-[0.14em] uppercase text-white/50 hover:text-white transition-colors">
                  View all →
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Slide indicators — bottom left, editorial -->
        <div class="absolute bottom-8 left-6 sm:left-10 lg:left-14 flex gap-2 z-10">
          <button
            *ngFor="let s of slides; let i = index"
            (click)="setCurrent(i)"
            [class]="i === currentIndex() ? 'w-8 h-0.5 bg-gold' : 'w-2 h-0.5 bg-white/30 hover:bg-white/60'"
            class="transition-all duration-300"
            [attr.aria-label]="'Slide ' + (i + 1)"
          ></button>
        </div>

        <!-- Arrow controls -->
        <button
          (click)="prev()"
          class="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center border border-white/20 text-white/60 hover:border-white/50 hover:text-white transition-all"
          aria-label="Previous slide"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
          </svg>
        </button>
        <button
          (click)="next()"
          class="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center border border-white/20 text-white/60 hover:border-white/50 hover:text-white transition-all"
          aria-label="Next slide"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
          </svg>
        </button>
      </div>

      <!-- Stats bar — clean, editorial -->
      <div class="bg-white border-b border-cream-dark">
        <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-cream-dark">
          <div *ngFor="let stat of stats" class="flex flex-col items-center py-5 gap-0.5">
            <span class="font-display text-xl font-semibold text-plum">{{ stat.value }}</span>
            <span class="font-body text-[10px] tracking-[0.16em] uppercase text-muted">{{ stat.label }}</span>
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
