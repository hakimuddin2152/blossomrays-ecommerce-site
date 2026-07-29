import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsentService } from '../../services/consent.service';
import { TranslationService } from '../../services/translation.service';

/**
 * Bottom cookie consent banner. Shown until the visitor makes a choice
 * (persisted by ConsentService). "Manage Preferences" expands an inline
 * panel with per-category toggles — no separate page/route needed.
 */
@Component({
  selector: 'app-cookie-consent-banner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      *ngIf="!consent.hasDecidedCookies()"
      class="fixed inset-x-0 bottom-0 z-[90] bg-white border-t border-cream-dark shadow-soft-xl"
      role="dialog"
      [attr.aria-label]="t('cookie.ariaLabel')"
    >
      <div class="max-w-5xl mx-auto px-5 py-5">
        <ng-container *ngIf="!managing(); else managePanel">
          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <div class="flex-1 space-y-1">
              <p class="font-body text-[13px] font-semibold text-plum">{{ t('cookie.title') }}</p>
              <p class="font-body text-[12px] text-muted leading-relaxed">{{ t('cookie.message') }}</p>
            </div>
            <div class="flex flex-wrap items-center gap-2 flex-shrink-0">
              <button (click)="openManage()" class="btn-ghost text-[10px] px-2">{{ t('cookie.manage') }}</button>
              <button (click)="consent.acceptNecessaryOnly()" class="btn-outline text-[10px] px-4 py-2.5">
                {{ t('cookie.necessaryOnly') }}
              </button>
              <button (click)="consent.acceptAll()" class="btn-primary text-[10px] px-4 py-2.5">
                {{ t('cookie.acceptAll') }}
              </button>
            </div>
          </div>
        </ng-container>

        <ng-template #managePanel>
          <div class="space-y-4">
            <p class="font-body text-[13px] font-semibold text-plum">{{ t('cookie.manage') }}</p>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="flex items-start gap-2.5">
                <input type="checkbox" checked disabled class="mt-0.5 h-4 w-4 accent-gold opacity-60" />
                <div>
                  <p class="font-body text-[12px] font-semibold text-plum">{{ t('cookie.necessary') }}</p>
                  <p class="font-body text-[11px] text-muted leading-relaxed">{{ t('cookie.necessaryDesc') }}</p>
                </div>
              </div>
              <div class="flex items-start gap-2.5">
                <input type="checkbox" [(ngModel)]="analytics" class="mt-0.5 h-4 w-4 accent-gold cursor-pointer" id="consent-analytics" />
                <label for="consent-analytics" class="cursor-pointer">
                  <p class="font-body text-[12px] font-semibold text-plum">{{ t('cookie.analytics') }}</p>
                  <p class="font-body text-[11px] text-muted leading-relaxed">{{ t('cookie.analyticsDesc') }}</p>
                </label>
              </div>
              <div class="flex items-start gap-2.5">
                <input type="checkbox" [(ngModel)]="marketing" class="mt-0.5 h-4 w-4 accent-gold cursor-pointer" id="consent-marketing" />
                <label for="consent-marketing" class="cursor-pointer">
                  <p class="font-body text-[12px] font-semibold text-plum">{{ t('cookie.marketing') }}</p>
                  <p class="font-body text-[11px] text-muted leading-relaxed">{{ t('cookie.marketingDesc') }}</p>
                </label>
              </div>
            </div>

            <div class="flex justify-end gap-2">
              <button (click)="managing.set(false)" class="btn-ghost text-[10px] px-2">{{ t('cookie.back') }}</button>
              <button (click)="save()" class="btn-primary text-[10px] px-4 py-2.5">{{ t('cookie.save') }}</button>
            </div>
          </div>
        </ng-template>
      </div>
    </div>
  `,
})
export class CookieConsentBannerComponent {
  protected readonly consent = inject(ConsentService);
  private readonly i18n = inject(TranslationService);

  readonly managing = signal(false);
  analytics = false;
  marketing = false;

  t(key: string): string {
    return this.i18n.t(key);
  }

  openManage(): void {
    this.analytics = false;
    this.marketing = false;
    this.managing.set(true);
  }

  save(): void {
    this.consent.savePreferences(
      { necessary: true, analytics: this.analytics, marketing: this.marketing },
      'customized',
    );
    this.managing.set(false);
  }
}
