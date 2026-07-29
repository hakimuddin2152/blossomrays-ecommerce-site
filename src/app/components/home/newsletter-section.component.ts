import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-newsletter-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="bg-plum py-20 px-4 sm:px-6">
      <div class="max-w-2xl mx-auto text-center space-y-6">
        <p class="font-body text-[10px] font-semibold tracking-[0.28em] uppercase text-gold">{{ t('home.newsletter.eyebrow') }}</p>
        <h2 class="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight">
          {{ t('home.newsletter.titleLine1') }} <span class="text-gold italic">{{ t('home.newsletter.titleLine2') }}</span>
        </h2>
        <p class="font-body text-[15px] text-white/50 leading-relaxed">
          {{ t('home.newsletter.subtitle') }}
        </p>

        <form (submit)="onSubmit($event)" class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            [(ngModel)]="email"
            name="email"
            required
            [placeholder]="t('home.newsletter.placeholder')"
            class="flex-1 bg-white/10 border border-white/20 px-4 py-3.5 font-body text-sm text-white placeholder:text-white/35 outline-none focus:border-gold transition-colors"
          />
          <button
            type="submit"
            [disabled]="submitted()"
            class="btn-primary hover:bg-white hover:text-plum hover:border-white whitespace-nowrap"
          >
            {{ submitted() ? t('home.newsletter.subscribed') : t('home.newsletter.subscribe') }}
          </button>
        </form>

        <p class="font-body text-[11px] text-white/30">
          {{ t('home.newsletter.disclaimer') }}
        </p>
      </div>
    </section>
  `,
})
export class NewsletterSectionComponent {
  private readonly i18n = inject(TranslationService);
  email = '';
  readonly submitted = signal(false);

  t(key: string): string {
    return this.i18n.t(key);
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    if (!this.email) return;
    // In a real app, call an API endpoint here
    this.submitted.set(true);
    this.email = '';
  }
}
