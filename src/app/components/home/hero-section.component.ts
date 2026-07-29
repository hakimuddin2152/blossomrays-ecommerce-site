import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

const slides = [
  {
    image: '/images/banner_image.png',
    badgeKey: 'home.hero.slide1.badge',
    headlineKeys: ['home.hero.slide1.line1', 'home.hero.slide1.line2'],
    accentLine: 1,
    subKey: 'home.hero.slide1.sub',
    ctaHref: '/products',
  },
  {
    image: '/images/banner_image_2.png',
    badgeKey: 'home.hero.slide2.badge',
    headlineKeys: ['home.hero.slide2.line1', 'home.hero.slide2.line2'],
    accentLine: 0,
    subKey: 'home.hero.slide2.sub',
    ctaHref: '/products',
  },
];

const stats = [
  { value: '120+', labelKey: 'home.stats.daysLasting' },
  { value: '3', labelKey: 'home.stats.signatureScents' },
  { value: '100%', labelKey: 'home.stats.alcoholFree' },
  { value: '🍁', labelKey: 'home.stats.madeInCanada' },
];

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <section>
      <!-- Carousel banner -->
      <div
        class="relative min-h-[42vh] sm:min-h-[56vh] max-h-[560px] overflow-hidden"
        (mouseenter)="paused = true"
        (mouseleave)="paused = false"
      >
        <!-- Image -->
        <div class="absolute inset-0 transition-opacity duration-700">
          <img
            [src]="current().image"
            [alt]="t(current().badgeKey)"
            class="w-full h-full object-cover object-center"
          />
        </div>

        <!-- Darken overlay — uniform, keeps the full image visible but readable -->
        <div class="absolute inset-0 bg-black/45"></div>

        <!-- Extra left-side scrim — guarantees text contrast regardless of what's behind it -->
        <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent"></div>

        <!-- Content -->
        <div class="relative z-10 h-full min-h-[42vh] sm:min-h-[56vh] max-h-[560px] flex items-center">
          <div class="w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-14">
            <div class="max-w-2xl space-y-5 sm:space-y-6">
              <!-- Badge — clean text eyebrow, no border box -->
              <p class="font-body text-[10px] font-semibold tracking-[0.30em] uppercase text-gold/80">
                {{ t(current().badgeKey) }}
              </p>

              <!-- Headline — editorial, large -->
              <h1 class="font-display font-semibold text-white leading-none">
                <span
                  *ngFor="let lineKey of current().headlineKeys; let i = index"
                  class="block text-[2rem] sm:text-[2.8rem] md:text-[4rem] lg:text-[5rem]"
                  [class.text-gold]="i === current().accentLine"
                >{{ t(lineKey) }}</span>
              </h1>

              <!-- Sub -->
              <p class="font-body text-[15px] text-white/90 leading-relaxed max-w-md">
                {{ t(current().subKey) }}
              </p>

              <!-- CTAs -->
              <div class="flex flex-wrap items-center gap-4 pt-2">
                <a
                  [routerLink]="current().ctaHref"
                  class="btn-primary"
                >
                  {{ t('home.hero.cta') }}
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                  </svg>
                </a>
                <a routerLink="/products" class="font-body text-[11px] font-medium tracking-[0.14em] uppercase text-white/50 hover:text-white transition-colors">
                  {{ t('home.hero.viewAll') }} →
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
            [attr.aria-label]="t('home.hero.slide') + ' ' + (i + 1)"
          ></button>
        </div>

        <!-- Arrow controls -->
        <button
          (click)="prev()"
          class="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center border border-white/20 text-white/60 hover:border-white/50 hover:text-white transition-all"
          [attr.aria-label]="t('home.hero.prevSlide')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
          </svg>
        </button>
        <button
          (click)="next()"
          class="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center border border-white/20 text-white/60 hover:border-white/50 hover:text-white transition-all"
          [attr.aria-label]="t('home.hero.nextSlide')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
          </svg>
        </button>
      </div>

      <!-- Stats bar — clean, editorial -->
      <div class="bg-white border-b border-cream-dark">
        <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-cream-dark">
          <div *ngFor="let stat of stats" class="flex flex-col items-center py-5 gap-0.5 bg-white">
            <span class="font-display text-xl font-semibold text-plum">{{ stat.value }}</span>
            <span class="font-body text-[10px] tracking-[0.16em] uppercase text-muted">{{ t(stat.labelKey) }}</span>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  private readonly i18n = inject(TranslationService);
  readonly slides = slides;
  readonly stats = stats;
  readonly currentIndex = signal(0);
  readonly current = signal(slides[0]);
  paused = false;
  private intervalId?: ReturnType<typeof setInterval>;

  t(key: string): string {
    return this.i18n.t(key);
  }

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
