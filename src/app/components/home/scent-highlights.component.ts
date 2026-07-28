import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

const scents = [
  {
    id: 'lavender',
    name: 'Lavender',
    tagline: 'Calm your commute',
    notes: ['French Lavender', 'Bergamot', 'Cedarwood'],
    color: '#8B89C8',
    bg: '#ECEDF7',
    href: '/products/lavender-car-air-freshener',
    image: '/images/lavender/1.jpg',
  },
  {
    id: 'rose',
    name: 'Rose',
    tagline: 'Bloom on the road',
    notes: ['Bulgarian Rose', 'Peony', 'Soft Musk'],
    color: '#C87868',
    bg: '#F5ECE9',
    href: '/products/rose-car-air-freshener',
    image: '/images/rose/Main_Image_Rose.jpeg',
  },
  {
    id: 'millennium',
    name: 'Millennium',
    tagline: 'A scent beyond time',
    notes: ['Amber', 'Sandalwood', 'Warm Vanilla'],
    color: '#C49A6C',
    bg: '#F5F0E8',
    href: '/products/millennium-car-air-freshener',
    image: '/images/millenium/1.jpg',
  },
];

@Component({
  selector: 'app-scent-highlights',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <section class="py-16 sm:py-24 px-4 sm:px-6 bg-cream-light">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10 sm:mb-12">
          <div class="space-y-2">
            <p class="section-eyebrow">Signature Collection</p>
            <h2 class="section-title">Three Distinct Scents</h2>
          </div>
          <a routerLink="/products" class="font-body text-[11px] font-medium tracking-[0.14em] uppercase text-muted hover:text-plum transition-colors self-start sm:self-auto pb-1 border-b border-muted/40 hover:border-plum/40">
            View All →
          </a>
        </div>

        <!-- Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          <a
            *ngFor="let scent of scents"
            [routerLink]="scent.href"
            class="group block bg-white border border-cream-dark hover:border-gold/30 hover:shadow-soft-lg transition-all duration-300 overflow-hidden"
          >
            <!-- Image -->
            <div class="aspect-[3/4] overflow-hidden" [style.background]="scent.bg">
              <img
                [src]="scent.image"
                [alt]="scent.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            <!-- Content — clean card below image -->
            <div class="p-5 sm:p-6 space-y-3" [style.borderTop]="'2px solid ' + scent.color">
              <p class="font-body text-[10px] font-semibold tracking-[0.28em] uppercase"
                 [style.color]="scent.color">{{ scent.tagline }}</p>
              <h3 class="font-display text-xl sm:text-2xl font-semibold text-plum">{{ scent.name }}</h3>
              <div class="flex flex-wrap gap-1.5">
                <span
                  *ngFor="let note of scent.notes"
                  class="font-body text-[10px] text-muted border border-cream-dark px-2.5 py-1"
                >{{ note }}</span>
              </div>
              <div class="flex items-center gap-2 pt-1 font-body text-[10px] font-semibold tracking-[0.18em] uppercase text-muted group-hover:text-plum transition-colors duration-300">
                Shop {{ scent.name }}
                <span class="block h-px w-5 bg-current transition-all duration-300 group-hover:w-9"></span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  `,
})
export class ScentHighlightsComponent {
  readonly scents = scents;
}
