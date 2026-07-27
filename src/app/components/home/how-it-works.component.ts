import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

const steps = [
  {
    step: '01',
    title: 'Choose Your Scent',
    desc: 'Browse our collection of Lavender, Rose, and Millennium — or discover our full range of fragrances.',
  },
  {
    step: '02',
    title: 'Install in Seconds',
    desc: 'Clip onto your air vent or hang from the rearview mirror. No tools needed, no mess.',
  },
  {
    step: '03',
    title: 'Enjoy 120+ Days',
    desc: 'Our botanical formula delivers consistent fragrance release for over 120 days of blissful driving.',
  },
];

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-24 bg-cream-light">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center max-w-xl mx-auto mb-16 space-y-3">
          <p class="section-eyebrow">Simple as 1-2-3</p>
          <h2 class="section-title">How It Works</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          <!-- Connecting line (desktop) -->
          <div class="hidden md:block absolute top-8 left-[20%] right-[20%] h-px bg-cream-dark"></div>

          <div *ngFor="let s of steps" class="text-center space-y-4 relative">
            <div class="w-14 h-14 mx-auto border border-gold/40 flex items-center justify-center bg-white relative z-10">
              <span class="font-display text-lg font-semibold text-gold">{{ s.step }}</span>
            </div>
            <h3 class="font-display text-xl font-semibold text-plum">{{ s.title }}</h3>
            <p class="font-body text-[13px] text-muted leading-relaxed max-w-xs mx-auto">{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HowItWorksComponent {
  readonly steps = steps;
}
