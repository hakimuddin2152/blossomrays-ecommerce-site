import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

const testimonials = [
  {
    name: "Mary K.",
    location: "Toronto, ON",
    quote:
      "This air freshener is a total game changer for my morning commute. I’m super picky about car scents because most of them smell like straight chemicals and give me an instant headache, but this one is completely different. The oil quality is honestly amazing. You can tell it’s made with real lavender essential oils because it actually smells like a fresh field of lavender, not fake synthetic perfume. It creates this super chill, spa-like vibe in the car which helps so much when I'm stuck in bumper-to-bumper traffic.",
    rating: 5,
    product: "Lavender",
    initial: "A",
    accent: "#8B89C8",
    featured: true,
  },
  {
    name: "Xu",
    location: "Montreal, QC",
    quote:
      "The BloomsomRays Fresh Rose oil diffuser is a wonderful accessory for my car. The set includes two individually packaged oil diffusers in 8ml glass bottles with wooden caps , which look extremely elegant and stylish. The double-sealed bottle design is thoughtful  as it prevents any leaks or spills. Assembly was straightforward following the simple instruction provided; it only took a few minutes. I found both mounting options—the rearview mirror string and the vent clip—to be very convenient. Furthermore, the natural ingredients, the alcohol-free, oil-based formula gives me great peace of mind for use around children and pets. Thank you for creating such an elegant and practical product. I truly enjoyed my daily commute with the light and refreshing rose scent, especially after a long day of work!",
    rating: 5,
    product: "Rose",
    initial: "S",
    accent: "#C87868",
    featured: false,
  },
  {
    name: "Mohammed A.",
    location: "Calgary, AB",
    quote:
      "Fantastic little addition to my car interior. I love the option to install it on a vent or hang it from the mirror. The smell is really noticeable and welcoming.",
    rating: 5,
    product: "Millennium",
    initial: "M",
    accent: "#C49A6C",
    featured: false,
  },
];

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-cream-light py-16 sm:py-24 px-4 sm:px-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="text-center max-w-xl mx-auto mb-16 space-y-3">
          <p class="section-eyebrow">{{ t('home.testimonials.eyebrow') }}</p>
          <h2 class="section-title">{{ t('home.testimonials.title') }}</h2>

        </div>

        <!-- Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            *ngFor="let item of testimonials"
            class="bg-white border border-cream-dark p-5 sm:p-8 space-y-5 hover:shadow-soft transition-shadow duration-300"
          >
            <!-- Stars -->
            <div class="flex gap-1">
              <svg *ngFor="let s of stars" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 text-gold">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>

            <!-- Quote -->
            <p class="font-display text-[1rem] text-plum leading-relaxed italic font-normal">"{{ item.quote }}"</p>

            <!-- Author -->
            <div class="flex items-center gap-3 pt-1 border-t border-cream-dark">
              <div
                class="w-8 h-8 flex items-center justify-center font-display text-sm font-semibold text-muted bg-cream-light flex-shrink-0"
              >{{ item.initial }}</div>
              <div>
                <p class="font-body text-[12px] font-semibold text-plum">{{ item.name }}</p>
                <p class="font-body text-[11px] text-muted">{{ item.location }} &middot; {{ item.product }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class TestimonialsSectionComponent {
  private readonly i18n = inject(TranslationService);
  readonly testimonials = testimonials;
  readonly stars = Array(5);

  t(key: string): string {
    return this.i18n.t(key);
  }
}
