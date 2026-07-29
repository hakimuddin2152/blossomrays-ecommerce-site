import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocaleService, type Country, type Language } from '../../services/locale.service';
import { TranslationService } from '../../services/translation.service';

/**
 * First-visit overlay: choose Canada or United States. Canada additionally
 * offers an EN/FR language choice; United States is always English and the
 * language toggle never appears for it. Shown once — LocaleService persists
 * the choice in localStorage — and can be revisited later via
 * RegionSwitcherComponent in the navbar.
 */
@Component({
  selector: 'app-region-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="locale.needsSelection()"
      class="fixed inset-0 z-[100] bg-plum/40 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        class="bg-white max-w-sm w-full p-7 shadow-soft-xl space-y-5"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="t('region.title')"
      >
        <div class="text-center space-y-1.5">
          <h2 class="font-display text-2xl font-semibold text-plum">{{ t('region.title') }}</h2>
          <p class="font-body text-[13px] text-muted leading-relaxed">{{ t('region.subtitle') }}</p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button
            (click)="choose('CA')"
            class="border px-4 py-4 text-center transition-colors"
            [class.border-gold]="pending() === 'CA'"
            [class.border-cream-dark]="pending() !== 'CA'"
          >
            <span class="block text-2xl mb-1">🇨🇦</span>
            <span class="block font-body text-[12px] font-semibold text-plum">{{ t('region.canada') }}</span>
            <span class="block font-body text-[10px] text-muted mt-0.5">{{ t('region.canadaHint') }}</span>
          </button>
          <button
            (click)="choose('US')"
            class="border px-4 py-4 text-center transition-colors"
            [class.border-gold]="pending() === 'US'"
            [class.border-cream-dark]="pending() !== 'US'"
          >
            <span class="block text-2xl mb-1">🇺🇸</span>
            <span class="block font-body text-[12px] font-semibold text-plum">{{ t('region.usa') }}</span>
            <span class="block font-body text-[10px] text-muted mt-0.5">{{ t('region.usaHint') }}</span>
          </button>
        </div>

        <div *ngIf="pending() === 'CA'" class="flex gap-2 justify-center">
          <button
            (click)="language.set('en')"
            class="px-5 py-2 text-[11px] font-semibold uppercase tracking-wide border transition-colors"
            [class.bg-plum]="language() === 'en'"
            [class.text-white]="language() === 'en'"
            [class.border-plum]="language() === 'en'"
            [class.border-cream-dark]="language() !== 'en'"
            [class.text-muted]="language() !== 'en'"
          >EN</button>
          <button
            (click)="language.set('fr')"
            class="px-5 py-2 text-[11px] font-semibold uppercase tracking-wide border transition-colors"
            [class.bg-plum]="language() === 'fr'"
            [class.text-white]="language() === 'fr'"
            [class.border-plum]="language() === 'fr'"
            [class.border-cream-dark]="language() !== 'fr'"
            [class.text-muted]="language() !== 'fr'"
          >FR</button>
        </div>

        <button [disabled]="!pending()" (click)="confirm()" class="btn-primary w-full">
          {{ t('region.confirm') }}
        </button>
      </div>
    </div>
  `,
})
export class RegionModalComponent {
  protected readonly locale = inject(LocaleService);
  private readonly i18n = inject(TranslationService);

  readonly pending = signal<Country | null>(null);
  readonly language = signal<Language>('en');

  t(key: string): string {
    return this.i18n.t(key);
  }

  choose(country: Country): void {
    this.pending.set(country);
    if (country === 'US') {
      this.language.set('en');
    }
  }

  confirm(): void {
    const country = this.pending();
    if (!country) return;
    this.locale.selectRegion(country, this.language());
  }
}
