import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

const testimonials = [
  {
    name: 'Amara K.',
    location: 'Toronto, ON',
    quote: "The Lavender freshener completely transforms my morning commute. It's subtle, luxurious, and lasts so much longer than anything I've tried before.",
    rating: 5,
    product: 'Lavender',
    initial: 'A',
    accent: '#8B89C8',
    featured: true,
  },
  {
    name: 'Sophie R.',
    location: 'Vancouver, BC',
    quote: 'I bought the Rose one as a gift for my sister and ended up ordering one for myself. The scent is absolutely divine — genuine rose fragrance, not overpowering at all.',
    rating: 5,
    product: 'Rose',
    initial: 'S',
    accent: '#C87868',
    featured: false,
  },
  {
    name: 'Mohammed A.',
    location: 'Calgary, AB',
    quote: "Fantastic little addition to my car interior. I love the option to install it on a vent or hang it from the mirror. The smell is really noticeable and welcoming.",
    rating: 5,
    product: 'Millennium',
    initial: 'M',
    accent: '#C49A6C',
    featured: false,
  },
];

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-[#F7F6F4] py-28 px-4 sm:px-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="text-center max-w-xl mx-auto mb-16 space-y-3">
          <p class="font-body text-[10px] font-semibold tracking-[0.28em] uppercase text-gold">Customer Reviews</p>
          <h2 class="font-display text-4xl md:text-[3.5rem] font-semibold text-plum leading-tight">What Drivers Say</h2>
          <p class="font-body text-[15px] text-muted leading-relaxed">Trusted by hundreds of happy drivers across Canada.</p>
          <div class="flex items-center justify-center gap-1 pt-1">
            <svg *ngFor="let s of stars" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-gold">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span class="font-body text-[13px] text-muted ml-2 font-medium">5.0 · 200+ Reviews</span>
          </div>
        </div>

        <!-- Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            *ngFor="let t of testimonials"
            class="bg-white border border-cream-dark p-7 space-y-4 hover:shadow-soft transition-shadow duration-300"
            [class.md:col-span-1]="true"
          >
            <!-- Stars -->
            <div class="flex gap-1">
              <svg *ngFor="let s of stars" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 text-gold">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>

            <!-- Quote -->
            <p class="font-body text-[14px] text-muted leading-relaxed italic">"{{ t.quote }}"</p>

            <!-- Author -->
            <div class="flex items-center gap-3 pt-2">
              <div
                class="w-9 h-9 rounded-full flex items-center justify-center font-display text-sm font-semibold text-white flex-shrink-0"
                [style.background]="t.accent"
              >{{ t.initial }}</div>
              <div>
                <p class="font-body text-[13px] font-semibold text-plum">{{ t.name }}</p>
                <p class="font-body text-[11px] text-muted">{{ t.location }} · {{ t.product }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class TestimonialsSectionComponent {
  readonly testimonials = testimonials;
  readonly stars = Array(5);
}
