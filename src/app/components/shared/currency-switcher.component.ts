import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocaleService, type Currency } from '../../services/locale.service';
import { TranslationService } from '../../services/translation.service';

/**
 * Standalone CAD/USD display-currency dropdown for the navbar. Kept
 * separate from `RegionSwitcherComponent` per user preference — a native
 * `<select>` reads more clearly for a two-option currency toggle than a
 * button-in-a-popover.
 */
@Component({
  selector: 'app-currency-switcher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <select
      class="font-body text-[11px] font-medium uppercase tracking-wide text-muted hover:text-plum transition-colors bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer"
      [attr.aria-label]="t('region.currency')"
      [ngModel]="locale.currency()"
      (ngModelChange)="setCurrency($event)"
    >
      <option value="CAD">CAD</option>
      <option value="USD">USD</option>
    </select>
  `,
})
export class CurrencySwitcherComponent {
  protected readonly locale = inject(LocaleService);
  private readonly i18n = inject(TranslationService);

  t(key: string): string {
    return this.i18n.t(key);
  }

  setCurrency(currency: Currency): void {
    this.locale.setCurrency(currency);
  }
}
