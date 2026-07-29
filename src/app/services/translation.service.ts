import { Injectable, inject } from '@angular/core';
import { LocaleService } from './locale.service';
import { TRANSLATIONS } from '../i18n/translations';

/**
 * Minimal runtime translation lookup: `t('nav.cart')` → 'Cart' / 'Panier'
 * depending on the current LocaleService language signal. See
 * src/app/i18n/translations.ts for the dictionary and scope notes.
 */
@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly locale = inject(LocaleService);

  /** Exposed so components can read the signal directly for reactivity. */
  readonly lang = this.locale.language;

  t(key: string): string {
    const lang = this.lang();
    return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
  }
}
