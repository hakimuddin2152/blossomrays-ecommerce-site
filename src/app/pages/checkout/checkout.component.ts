import { Component, inject, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { ConsentService } from '../../services/consent.service';
import { TranslationService } from '../../services/translation.service';
import { LocaleService } from '../../services/locale.service';
import { TermsModalComponent } from '../../components/shared/terms-modal.component';
import { formatPrice } from '../../utils/format-price';
import { APP_CONFIG } from '../../tokens/app-config.token';
import type { Profile } from '../../types';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, TermsModalComponent],
  template: `    <div class="bg-cream min-h-screen">
      <!-- Empty cart redirect -->
      <ng-container *ngIf="items().length === 0">
        <div class="min-h-screen flex items-center justify-center">
          <div class="text-center space-y-4">
            <p class="font-body text-muted text-lg">{{ t('checkout.emptyCart') }}</p>
            <a routerLink="/products" class="btn-outline inline-flex">{{ t('common.browseProducts') }}</a>
          </div>
        </div>
      </ng-container>

      <ng-container *ngIf="items().length > 0">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <h1 class="font-display text-3xl sm:text-4xl font-semibold text-plum mb-10">{{ t('checkout.title') }}</h1>

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <!-- Shipping form -->
              <div class="lg:col-span-3 space-y-6">
                <div class="bg-white border border-cream-dark p-6 space-y-5">
                  <h2 class="font-display text-xl font-semibold text-plum">{{ t('checkout.shippingInfo') }}</h2>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="sm:col-span-2">
                      <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">{{ t('checkout.fullName') }} *</label>
                      <input formControlName="full_name" type="text" [placeholder]="t('checkout.fullNamePlaceholder')" class="input-field"
                        [class.border-red-400]="fieldInvalid('full_name')" />
                      <p *ngIf="fieldInvalid('full_name')" class="font-body text-xs text-red-500 mt-1">{{ t('checkout.fullNameRequired') }}</p>
                    </div>

                    <div class="sm:col-span-2">
                      <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">{{ t('checkout.email') }} *</label>
                      <input formControlName="email" type="email" placeholder="you@example.com" class="input-field"
                        [class.border-red-400]="fieldInvalid('email')" />
                      <p *ngIf="fieldInvalid('email')" class="font-body text-xs text-red-500 mt-1">{{ t('checkout.emailValidRequired') }}</p>
                    </div>

                    <div class="sm:col-span-2">
                      <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">{{ t('checkout.streetAddress') }} *</label>
                      <input formControlName="street_line_1" type="text" [placeholder]="t('checkout.streetPlaceholder')" class="input-field"
                        [class.border-red-400]="fieldInvalid('street_line_1')" />
                      <p *ngIf="fieldInvalid('street_line_1')" class="font-body text-xs text-red-500 mt-1">{{ t('checkout.addressRequired') }}</p>
                    </div>

                    <div class="sm:col-span-2">
                      <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">{{ t('checkout.aptUnit') }}</label>
                      <input formControlName="street_line_2" type="text" [placeholder]="t('checkout.aptPlaceholder')" class="input-field" />
                    </div>

                    <div>
                      <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">{{ t('checkout.city') }} *</label>
                      <input formControlName="city" type="text" [placeholder]="t('checkout.cityPlaceholder')" class="input-field"
                        [class.border-red-400]="fieldInvalid('city')" />
                    </div>

                    <div>
                      <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">{{ t('checkout.stateProvince') }} *</label>
                      <input formControlName="state" type="text" [placeholder]="t('checkout.statePlaceholder')" class="input-field"
                        [class.border-red-400]="fieldInvalid('state')" />
                    </div>

                    <div>
                      <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">{{ t('checkout.postalCode') }} *</label>
                      <input formControlName="zip" type="text" [placeholder]="t('checkout.zipPlaceholder')" class="input-field"
                        [class.border-red-400]="fieldInvalid('zip')" />
                    </div>

                    <div>
                      <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">{{ t('checkout.country') }} *</label>
                      <select formControlName="country" class="input-field"
                        [class.border-red-400]="fieldInvalid('country')">
                        <option value="">{{ t('checkout.selectCountry') }}</option>
                        <option value="CA">{{ t('country.CA') }}</option>
                        <option value="US">{{ t('country.US') }}</option>
                        <option value="GB">{{ t('country.GB') }}</option>
                        <option value="AU">{{ t('country.AU') }}</option>
                        <option value="FR">{{ t('country.FR') }}</option>
                        <option value="DE">{{ t('country.DE') }}</option>
                        <option value="JP">{{ t('country.JP') }}</option>
                        <option value="MX">{{ t('country.MX') }}</option>
                        <option value="NL">{{ t('country.NL') }}</option>
                        <option value="NZ">{{ t('country.NZ') }}</option>
                        <option value="SG">{{ t('country.SG') }}</option>
                        <option value="AE">{{ t('country.AE') }}</option>
                      </select>
                      <p *ngIf="fieldInvalid('country')" class="font-body text-xs text-red-500 mt-1">{{ t('checkout.countryRequired') }}</p>
                    </div>
                  </div>
                </div>

                <!-- Error -->
                <div *ngIf="error()" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 font-body text-sm">
                  {{ error() }}
                </div>

                <!-- Terms & Conditions of Sale -->
                <div
                  id="terms-section"
                  class="bg-white border p-4 transition-colors"
                  [class.border-cream-dark]="!(termsTouched() && !agreedToTerms())"
                  [class.border-red-400]="termsTouched() && !agreedToTerms()"
                  [class.bg-red-50]="termsTouched() && !agreedToTerms()"
                >
                  <div class="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="terms-checkbox"
                      [checked]="agreedToTerms()"
                      (click)="$event.preventDefault(); onTermsCheckboxClick()"
                      class="mt-0.5 h-4 w-4 accent-gold cursor-pointer"
                    />
                    <label
                      for="terms-checkbox"
                      (click)="$event.preventDefault(); onTermsCheckboxClick()"
                      class="font-body text-[12px] text-muted leading-relaxed cursor-pointer"
                    >
                      {{ t('checkout.agreePrefix') }}
                      <button
                        type="button"
                        (click)="$event.stopPropagation(); termsOpen.set(true)"
                        class="text-gold underline hover:text-plum"
                      >{{ t('terms.viewLink') }}</button>
                    </label>
                  </div>
                  <p *ngIf="termsTouched() && !agreedToTerms()" class="font-body text-xs text-red-500 mt-2">
                    {{ t('checkout.agreeRequired') }}
                  </p>
                </div>
              </div>

              <!-- Order summary -->
              <div class="lg:col-span-2">
                <div class="bg-white border border-cream-dark p-6 space-y-4 sticky top-28">
                  <h2 class="font-display text-xl font-semibold text-plum">{{ t('checkout.orderSummary') }}</h2>

                  <div *ngFor="let item of items()" class="flex gap-3 py-2 border-b border-cream-dark last:border-0">
                    <img [src]="item.product.images[0] || '/images/lavender/1.jpg'" [alt]="item.product.name"
                      class="w-12 h-12 object-cover bg-cream flex-shrink-0" />
                    <div class="flex-1 min-w-0">
                      <p class="font-body text-[13px] font-medium text-plum truncate">{{ item.product.name }}</p>
                      <p class="font-body text-[11px] text-muted">{{ t('checkout.qty') }}: {{ item.quantity }}</p>
                    </div>
                    <span class="font-body text-[13px] font-semibold text-plum flex-shrink-0">
                      {{ formatPrice(item.product.price * item.quantity, locale.currency()) }}
                    </span>
                  </div>

                  <div class="space-y-2 font-body text-sm pt-2">
                    <div class="flex justify-between">
                      <span class="text-muted">{{ t('checkout.subtotal') }}</span>
                      <span class="text-plum">{{ formatPrice(subtotal(), locale.currency()) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted">{{ t('checkout.shipping') }}</span>
                      <span class="text-plum">{{ subtotal() >= config.freeShippingThreshold ? t('checkout.free') : formatPrice(config.shippingCost, locale.currency()) }}</span>
                    </div>
                  </div>

                  <hr class="border-cream-dark" />

                  <div class="flex justify-between font-body font-semibold text-plum">
                    <span>{{ t('checkout.total') }}</span>
                    <span>{{ formatPrice(subtotal() >= config.freeShippingThreshold ? subtotal() : subtotal() + config.shippingCost, locale.currency()) }}</span>
                  </div>

                  <p *ngIf="termsTouched() && !agreedToTerms()" class="font-body text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2">
                    {{ t('checkout.agreeRequired') }}
                  </p>

                  <button type="submit" [disabled]="loading()" class="btn-primary w-full">
                    {{ loading() ? t('checkout.processing') : t('checkout.proceed') }}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </ng-container>
    </div>

    <app-terms-modal
      [open]="termsOpen()"
      [showAgree]="true"
      (closeEvent)="termsOpen.set(false)"
      (agree)="onAgreeTerms()"
    />
  `,
})
export class CheckoutComponent {
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly consentService = inject(ConsentService);
  private readonly i18n = inject(TranslationService);
  readonly locale = inject(LocaleService);
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  readonly config = inject(APP_CONFIG);

  readonly items = this.cartService.items;
  readonly subtotal = this.cartService.subtotal;
  readonly formatPrice = formatPrice;
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly termsOpen = signal(false);
  readonly agreedToTerms = signal(false);
  readonly termsTouched = signal(false);

  t(key: string): string {
    return this.i18n.t(key);
  }

  onTermsCheckboxClick(): void {
    if (this.agreedToTerms()) {
      this.agreedToTerms.set(false);
    } else {
      this.termsOpen.set(true);
    }
  }

  onAgreeTerms(): void {
    this.agreedToTerms.set(true);
    this.termsTouched.set(false);
    this.termsOpen.set(false);
    this.consentService.logTermsAcceptance();
  }

  readonly form = this.fb.group({
    full_name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    street_line_1: ['', [Validators.required, Validators.minLength(3)]],
    street_line_2: [''],
    city: ['', [Validators.required, Validators.minLength(2)]],
    state: ['', [Validators.required, Validators.minLength(2)]],
    zip: ['', [Validators.required, Validators.minLength(4)]],
    country: ['CA', [Validators.required]],
  });

  /** Prevents the effect from prefilling more than once per component lifetime. */
  private hasPrefilled = false;

  constructor() {
    // Reactively prefill the form once the profile finishes loading.
    // This fixes the race condition where ngOnInit ran before _loadProfile() resolved.
    effect(() => {
      const user = this.authService.user();
      const profileLoaded = this.authService.profileLoaded();

      if (!user || !profileLoaded || this.hasPrefilled) return;
      this.hasPrefilled = true;

      const profile = this.authService.profile();

      // Always set email + name
      this.form.patchValue({
        email:     user.email ?? '',
        full_name: profile?.full_name ?? '',
      });

      // Saved profile address takes priority
      const saved = profile?.default_shipping_address;
      if (saved?.street_line_1) {
        this.form.patchValue({
          full_name:     saved.full_name || profile?.full_name || '',
          street_line_1: saved.street_line_1,
          street_line_2: saved.street_line_2 ?? '',
          city:          saved.city,
          state:         saved.state,
          zip:           saved.zip,
          country:       saved.country || 'CA',
        });
        return;
      }

      // Fall back to last order's shipping address (async, best-effort)
      this._prefillFromLastOrder(profile);
    });
  }

  private async _prefillFromLastOrder(profile: Profile | null): Promise<void> {
    try {
      const orders = await this.orderService.getMyOrders();
      const last = orders.find((o) => o.shipping_address?.street_line_1);
      if (last?.shipping_address) {
        const a = last.shipping_address;
        this.form.patchValue({
          full_name:     a.full_name || profile?.full_name || '',
          street_line_1: a.street_line_1,
          street_line_2: a.street_line_2 ?? '',
          city:          a.city,
          state:         a.state,
          zip:           a.zip,
          country:       a.country || 'CA',
        });
      }
    } catch { /* best-effort */ }
  }

  fieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.agreedToTerms()) {
      this.termsTouched.set(true);
      document.getElementById('terms-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    const { email, ...shipping } = this.form.value;

    try {
      /**
       * INTERVIEW: HttpClient vs fetch
       *
       * this.http.post<T>() returns an Observable<T>.
       * firstValueFrom() converts it to a Promise so we can use async/await.
       *
       * Advantages over fetch:
       *   • Typed response body (generic <T>)
       *   • Interceptors run automatically (authInterceptor adds JWT)
       *   • Error handling via catchError / throwError operators
       *   • Progress events for uploads
       *   • Testable with HttpClientTestingModule
       *
       * The authInterceptor adds Authorization: Bearer <token> to this POST,
       * so Netlify can optionally verify the caller is authenticated.
       */
      const json = await firstValueFrom(
        this.http.post<{ url: string }>('/.netlify/functions/stripe-checkout', {
          items: this.items(),
          shipping,
          email,
        }, {
          // Tell the function our actual origin so it builds the correct
          // success_url regardless of what Netlify CLI injects as URL env var.
          headers: { 'X-Origin': window.location.origin },
        }),
      );

      if (json.url) {
        this.cartService.clearCart();
        window.location.href = json.url;
      }
    } catch (err: unknown) {
      // HttpClient throws HttpErrorResponse on non-2xx status
      const message =
        (err as { error?: { error?: string } })?.error?.error
        ?? this.i18n.t('checkout.somethingWrong');
      this.error.set(message);
    } finally {
      this.loading.set(false);
    }
  }
}
