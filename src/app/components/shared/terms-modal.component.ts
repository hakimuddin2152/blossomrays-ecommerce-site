import { Component, Input, Output, EventEmitter, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { TERMS_CONTENT } from '../../i18n/terms-content';

/**
 * Small, readable Terms & Conditions of Sale popup — see
 * src/app/i18n/terms-content.ts for the (intentionally short) copy.
 *
 * Reusable: pass `showAgree` to render an "I Agree" button (used by the
 * checkout flow) or omit it for a plain read-only view (e.g. footer link).
 */
@Component({
  selector: 'app-terms-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="open">
      <div
        class="fixed inset-0 z-[110] bg-plum/40 backdrop-blur-sm"
        (click)="closeEvent.emit()"
        aria-hidden="true"
      ></div>

      <div class="fixed inset-0 z-[111] flex items-center justify-center p-4 pointer-events-none">
        <div
          class="bg-white max-w-md w-full max-h-[80vh] flex flex-col shadow-soft-xl pointer-events-auto"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="content().title"
        >
          <div class="flex items-center justify-between px-6 py-4 border-b border-cream-dark flex-shrink-0">
            <h2 class="font-display text-xl font-semibold text-plum">{{ content().title }}</h2>
            <button
              (click)="closeEvent.emit()"
              class="p-1.5 text-muted hover:text-plum transition-colors"
              [attr.aria-label]="t('terms.close')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin">
            <p class="font-body text-[10px] uppercase tracking-widest text-muted">
              {{ t('terms.updated') }}: {{ content().updated }}
            </p>
            <div *ngFor="let section of content().sections" class="space-y-1">
              <h3 class="font-body text-[12px] font-semibold text-plum uppercase tracking-wide">{{ section.heading }}</h3>
              <p class="font-body text-[13px] text-muted leading-relaxed">{{ section.body }}</p>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-cream-dark flex justify-end gap-2 flex-shrink-0">
            <button (click)="closeEvent.emit()" class="btn-outline text-[10px] px-5 py-2.5">
              {{ t('terms.close') }}
            </button>
            <button *ngIf="showAgree" (click)="agree.emit()" class="btn-primary text-[10px] px-5 py-2.5">
              {{ t('terms.agree') }}
            </button>
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
export class TermsModalComponent {
  @Input() open = false;
  @Input() showAgree = false;
  @Output() readonly closeEvent = new EventEmitter<void>();
  @Output() readonly agree = new EventEmitter<void>();

  private readonly i18n = inject(TranslationService);
  readonly content = computed(() => TERMS_CONTENT[this.i18n.lang()]);

  t(key: string): string {
    return this.i18n.t(key);
  }
}
