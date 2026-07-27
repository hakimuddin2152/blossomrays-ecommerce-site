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
    <section class="py-24 px-4 sm:px-6 bg-white">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div class="space-y-2">
            <p class="section-eyebrow">Signature Collection</p>
            <h2 class="section-title">Three Distinct Scents</h2>
          </div>
          <a routerLink="/products" class="font-body text-[11px] font-medium tracking-[0.14em] uppercase text-muted hover:text-plum transition-colors self-start sm:self-auto pb-1 border-b border-muted/40 hover:border-plum/40">
            View All →
          </a>
        </div>

        <!-- Cards — equal columns, editorial portrait -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div
            *ngFor="let scent of scents"
            class="group relative overflow-hidden cursor-pointer"
          >
            <a [routerLink]="scent.href" class="block">
              <!-- Image -->
              <div class="aspect-[3/4] overflow-hidden" [style.background]="scent.bg">
                <img
                  [src]="scent.image"
                  [alt]="scent.name"
                  class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                />
              </div>

              <!-- Overlay info -->
              <div class="absolute inset-0 bg-gradient-to-t from-[#1C1C1A]/80 via-[#1C1C1A]/15 to-transparent flex flex-col justify-end p-6">
                <p class="font-body text-[10px] font-semibold tracking-[0.24em] uppercase mb-1.5"
                   [style.color]="scent.color">{{ scent.tagline }}</p>
                <h3 class="font-display text-2xl font-semibold text-white mb-3">{{ scent.name }}</h3>
                <div class="flex gap-1.5 flex-wrap mb-4">
                  <span
                    *ngFor="let note of scent.notes"
                    class="font-body text-[10px] text-white/60 border border-white/20 px-2 py-0.5"
                  >{{ note }}</span>
                </div>
                <!-- CTA line -->
                <span class="inline-flex items-center gap-2 font-body text-[10px] font-semibold tracking-[0.18em] uppercase text-white/80 group-hover:text-white transition-colors duration-200">
                  Shop {{ scent.name }}
                  <span class="w-6 h-px bg-current transition-all duration-300 group-hover:w-8"></span>
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
