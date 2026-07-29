import { Injectable, signal, computed, effect } from '@angular/core';
import type { Language } from '../i18n/translations';

export type Country = 'CA' | 'US';
export type Currency = 'CAD' | 'USD';
export type { Language };

const STORAGE_KEY = 'br_locale_v1';

interface StoredLocale {
  country: Country;
  language: Language;
  currency?: Currency;
}

/**
 * Owns the visitor's region (Canada / United States) and language (EN / FR).
 *
 * Rules:
 *  - Only Canada offers a language choice (EN/FR). USA is English-only and
 *    hides the language switcher entirely.
 *  - The choice is made once via the first-visit selector (see
 *    RegionModalComponent) and persisted in localStorage; it can be changed
 *    anytime via the compact RegionSwitcherComponent in the navbar.
 */
@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly stored = this.readStorage();

  readonly country = signal<Country>(this.stored?.country ?? 'CA');
  readonly language = signal<Language>(this.stored?.language ?? 'en');

  /** Display currency (CAD/USD) — defaults from region but can be changed independently via the navbar dropdown. */
  readonly currency = signal<Currency>(this.stored?.currency ?? (this.stored?.country === 'US' ? 'USD' : 'CAD'));

  /** True until the visitor has made (or confirmed) a region choice. */
  readonly needsSelection = signal<boolean>(!this.stored);

  /** Only Canada gets the EN/FR toggle — USA is English-only. */
  readonly showLanguageSwitch = computed(() => this.country() === 'CA');

  constructor() {
    // Keep <html lang> in sync and persist the choice whenever it changes.
    effect(() => {
      const country = this.country();
      const language = this.language();
      const currency = this.currency();
      if (typeof document !== 'undefined') {
        document.documentElement.lang = language;
      }
      if (!this.needsSelection()) {
        this.persist({ country, language, currency });
      }
    });
  }

  /** Used by the first-visit modal to finalize both region and language at once. */
  selectRegion(country: Country, language?: Language): void {
    this.country.set(country);
    this.language.set(country === 'US' ? 'en' : (language ?? this.language()));
    this.currency.set(country === 'US' ? 'USD' : 'CAD');
    this.needsSelection.set(false);
  }

  setCountry(country: Country): void {
    this.country.set(country);
    if (country === 'US') {
      this.language.set('en');
    }
  }

  setLanguage(language: Language): void {
    if (this.country() === 'US') return; // USA is English-only
    this.language.set(language);
  }

  setCurrency(currency: Currency): void {
    this.currency.set(currency);
  }

  private readStorage(): StoredLocale | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<StoredLocale>;
      if (parsed?.country === 'CA' || parsed?.country === 'US') {
        return {
          country: parsed.country,
          language: parsed.language === 'fr' && parsed.country === 'CA' ? 'fr' : 'en',
          currency: parsed.currency === 'USD' ? 'USD' : parsed.currency === 'CAD' ? 'CAD' : undefined,
        };
      }
    } catch {
      /* corrupt storage or unavailable (private mode) — fall back to prompting */
    }
    return null;
  }

  private persist(value: StoredLocale): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      /* storage unavailable — non-fatal, just won't persist across visits */
    }
  }
}
