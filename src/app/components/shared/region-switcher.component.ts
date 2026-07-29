import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocaleService, type Country, type Language } from '../../services/locale.service';
import { TranslationService } from '../../services/translation.service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

/**
 * Compact region/language control for the navbar. The trigger is the
 * flag + language-code pill. On tablet/desktop the panel is a small
 * anchored dropdown; on phone widths it becomes a centered sheet with a
 * backdrop and larger touch targets so it's easy to tap accurately, since
 * the anchored dropdown was cramped at narrow widths. Language section
 * only renders for Canada (`LocaleService.showLanguageSwitch`); USA is
 * English-only. Currency has its own dedicated dropdown
 * (`CurrencySwitcherComponent`) — kept separate per user preference.
 */
@Component({
  selector: 'app-region-switcher',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  template: `
    <div class="relative" appClickOutside (clickedOutside)="open.set(false)">
      <button
        (click)="open.set(!open())"
        class="flex items-center gap-1 px-2 py-1.5 font-body text-[11px] font-medium uppercase tracking-wide text-muted hover:text-plum transition-colors"
        [attr.aria-label]="t('region.changeRegion')"
      >
        <span class="text-base leading-none">{{ locale.country() === 'CA' ? '🇨🇦' : '🇺🇸' }}</span>
        <span *ngIf="locale.showLanguageSwitch()">{{ locale.language().toUpperCase() }}</span>
      </button>

      <!-- Backdrop: phone widths only, turns the panel into a focused sheet -->
      <div
        *ngIf="open()"
        class="fixed inset-0 z-40 bg-plum/30 backdrop-blur-sm sm:hidden"
        (click)="open.set(false)"
        aria-hidden="true"
      ></div>

      <div
        *ngIf="open()"
        class="fixed left-4 right-4 top-24 z-50 bg-white border border-cream-dark shadow-soft-xl p-5 space-y-5
               sm:absolute sm:inset-auto sm:left-auto sm:right-0 sm:top-full sm:mt-1 sm:w-56 sm:p-4 sm:space-y-4 sm:shadow-soft"
      >
        <button
          type="button"
          (click)="open.set(false)"
          class="absolute right-3 top-3 p-1 text-muted hover:text-plum sm:hidden"
          [attr.aria-label]="t('terms.close')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div>
          <p class="font-body text-[11px] sm:text-[10px] font-semibold uppercase tracking-widest text-muted mb-2 sm:mb-1.5">
            {{ t('region.changeRegion') }}
          </p>
          <div class="flex gap-2">
            <button
              (click)="setCountry('CA')"
              class="flex-1 border px-3 py-3 sm:px-2 sm:py-1.5 text-[13px] sm:text-[11px] font-body transition-colors"
              [class.border-gold]="locale.country() === 'CA'"
              [class.border-cream-dark]="locale.country() !== 'CA'"
            >🇨🇦 {{ t('region.canada') }}</button>
            <button
              (click)="setCountry('US')"
              class="flex-1 border px-3 py-3 sm:px-2 sm:py-1.5 text-[13px] sm:text-[11px] font-body transition-colors"
              [class.border-gold]="locale.country() === 'US'"
              [class.border-cream-dark]="locale.country() !== 'US'"
            >🇺🇸 {{ t('region.usa') }}</button>
          </div>
        </div>

        <div *ngIf="locale.showLanguageSwitch()">
          <p class="font-body text-[11px] sm:text-[10px] font-semibold uppercase tracking-widest text-muted mb-2 sm:mb-1.5">
            {{ t('region.language') }}
          </p>
          <div class="flex gap-2">
            <button
              (click)="setLanguage('en')"
              class="flex-1 border px-3 py-3 sm:px-2 sm:py-1.5 text-[13px] sm:text-[11px] font-body transition-colors"
              [class.border-gold]="locale.language() === 'en'"
              [class.border-cream-dark]="locale.language() !== 'en'"
            >EN</button>
            <button
              (click)="setLanguage('fr')"
              class="flex-1 border px-3 py-3 sm:px-2 sm:py-1.5 text-[13px] sm:text-[11px] font-body transition-colors"
              [class.border-gold]="locale.language() === 'fr'"
              [class.border-cream-dark]="locale.language() !== 'fr'"
            >FR</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RegionSwitcherComponent {
  protected readonly locale = inject(LocaleService);
  private readonly i18n = inject(TranslationService);
  readonly open = signal(false);

  t(key: string): string {
    return this.i18n.t(key);
  }

  setCountry(country: Country): void {
    this.locale.setCountry(country);
  }

  setLanguage(language: Language): void {
    this.locale.setLanguage(language);
  }
}


