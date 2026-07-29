import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

const steps = [
  { step: '01', titleKey: 'home.how.step1.title', descKey: 'home.how.step1.desc' },
  { step: '02', titleKey: 'home.how.step2.title', descKey: 'home.how.step2.desc' },
  { step: '03', titleKey: 'home.how.step3.title', descKey: 'home.how.step3.desc' },
];

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 sm:py-24 bg-cream-light">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center max-w-xl mx-auto mb-16 space-y-3">
          <p class="section-eyebrow">{{ t('home.how.eyebrow') }}</p>
          <h2 class="section-title">{{ t('home.how.title') }}</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          <!-- Connecting line (desktop) -->
          <div class="hidden md:block absolute top-8 left-[20%] right-[20%] h-px bg-cream-dark"></div>

          <div *ngFor="let s of steps" class="text-center space-y-4 relative">
            <div class="w-14 h-14 mx-auto border border-gold/40 flex items-center justify-center bg-white relative z-10">
              <span class="font-display text-lg font-semibold text-gold">{{ s.step }}</span>
            </div>
            <h3 class="font-display text-xl font-semibold text-plum">{{ t(s.titleKey) }}</h3>
            <p class="font-body text-[13px] text-muted leading-relaxed max-w-xs mx-auto">{{ t(s.descKey) }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HowItWorksComponent {
  private readonly i18n = inject(TranslationService);
  readonly steps = steps;

  t(key: string): string {
    return this.i18n.t(key);
  }
}
