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
    <section class="py-28 px-4 sm:px-6 bg-cream">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="text-center max-w-xl mx-auto mb-16 space-y-3">
          <p class="section-eyebrow tracking-[0.28em]">Signature Collection</p>
          <h2 class="section-title">Three Distinct Scents</h2>
          <p class="section-subtitle text-[15px]">
            Each fragrance tells a story. Find yours.
          </p>
        </div>

        <!-- Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div
            *ngFor="let scent of scents"
            class="group relative overflow-hidden rounded-lg cursor-pointer"
          >
            <a [routerLink]="scent.href" class="block">
              <!-- Image -->
              <div class="aspect-[3/4] overflow-hidden" [style.background]="scent.bg">
                <img
                  [src]="scent.image"
                  [alt]="scent.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <!-- Overlay info -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-5">
                <p class="font-body text-[10px] font-semibold tracking-[0.22em] uppercase mb-1"
                   [style.color]="scent.color">{{ scent.tagline }}</p>
                <h3 class="font-display text-2xl font-semibold text-white mb-2">{{ scent.name }}</h3>
                <div class="flex gap-1.5 flex-wrap mb-3">
                  <span
                    *ngFor="let note of scent.notes"
                    class="font-body text-[10px] text-white/70 border border-white/25 px-2 py-0.5 rounded-sm"
                  >{{ note }}</span>
                </div>
                <span class="inline-flex items-center gap-1.5 font-body text-[11px] font-semibold tracking-[0.15em] uppercase text-white border border-white/40 px-4 py-2 self-start hover:bg-white hover:text-plum transition-colors duration-200">
                  Shop {{ scent.name }}
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                  </svg>
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ScentHighlightsComponent {
  readonly scents = scents;
}
