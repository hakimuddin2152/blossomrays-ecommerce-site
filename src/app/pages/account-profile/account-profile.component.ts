import { Component, inject, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-account-profile',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-cream min-h-screen">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 py-14">

        <div class="flex items-center gap-3 mb-10">
          <a routerLink="/account" class="text-muted hover:text-plum">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.75 19.5L8.25 12l7.5-7.5"/>
            </svg>
          </a>
          <h1 class="font-display text-3xl font-semibold text-plum">My Profile</h1>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">

          <!-- Avatar -->
          <div class="bg-white border border-cream-dark p-6 flex items-center gap-5">
            <div class="w-16 h-16 rounded-full bg-plum flex items-center justify-center flex-shrink-0">
              <span class="font-display text-2xl text-cream font-semibold">{{ initials() }}</span>
            </div>
            <div>
              <p class="font-display text-lg font-semibold text-plum">{{ profile()?.full_name || 'No name set' }}</p>
              <p class="font-body text-sm text-muted">{{ user()?.email }}</p>
            </div>
          </div>

          <!-- Personal details -->
          <div class="bg-white border border-cream-dark p-6 space-y-5">
            <h2 class="font-display text-lg font-semibold text-plum">Personal Details</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">Full Name *</label>
                <input formControlName="full_name" type="text" placeholder="Jane Smith" class="input-field"
                  [class.border-red-400]="fieldInvalid('full_name')" />
                <p *ngIf="fieldInvalid('full_name')" class="font-body text-xs text-red-500 mt-1">Full name is required</p>
              </div>
              <div class="sm:col-span-2">
                <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">Email</label>
                <input type="email" [value]="user()?.email ?? ''" disabled
                  class="input-field opacity-50 cursor-not-allowed bg-cream" />
                <p class="font-body text-[11px] text-muted mt-1">Email is managed through your sign-in method</p>
              </div>
              <div class="sm:col-span-2">
                <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">Phone</label>
                <input formControlName="phone" type="tel" placeholder="+1 416 555 0100" class="input-field" />
              </div>
            </div>
          </div>

          <!-- Default shipping address -->
          <div class="bg-white border border-cream-dark p-6 space-y-5">
            <h2 class="font-display text-lg font-semibold text-plum">Default Shipping Address</h2>
            <p class="font-body text-xs text-muted -mt-2">Pre-filled automatically at checkout.</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">Street Address</label>
                <input formControlName="street_line_1" type="text" placeholder="123 Main St" class="input-field" />
              </div>
              <div class="sm:col-span-2">
                <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">Apt / Unit</label>
                <input formControlName="street_line_2" type="text" placeholder="Apt 4B" class="input-field" />
              </div>
              <div>
                <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">City</label>
                <input formControlName="city" type="text" placeholder="Toronto" class="input-field" />
              </div>
              <div>
                <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">Province / State</label>
                <input formControlName="state" type="text" placeholder="ON" class="input-field" />
              </div>
              <div>
                <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">Postal Code</label>
                <input formControlName="zip" type="text" placeholder="M5V 1J1" class="input-field" />
              </div>
              <div>
                <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">Country</label>
                <select formControlName="country" class="input-field">
                  <option value="">Select country...</option>
                  <option value="CA">Canada</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                  <option value="JP">Japan</option>
                  <option value="MX">Mexico</option>
                  <option value="NL">Netherlands</option>
                  <option value="NZ">New Zealand</option>
                  <option value="SG">Singapore</option>
                  <option value="AE">United Arab Emirates</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Feedback -->
          <p *ngIf="successMsg()" class="font-body text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-3">
            {{ successMsg() }}
          </p>
          <p *ngIf="errorMsg()" class="font-body text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3">
            {{ errorMsg() }}
          </p>

          <button type="submit" [disabled]="saving()" class="btn-primary w-full sm:w-auto px-10">
            {{ saving() ? 'Saving...' : 'Save Changes' }}
          </button>

        </form>
      </div>
    </div>
  `,
})
export class AccountProfileComponent {
  private readonly auth = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly fb = inject(FormBuilder);

  readonly user = this.auth.user;
  readonly profile = this.auth.profile;
  readonly saving = signal(false);
  readonly successMsg = signal<string | null>(null);
  readonly errorMsg = signal<string | null>(null);

  readonly form = this.fb.group({
    full_name:     ['', [Validators.required, Validators.minLength(2)]],
    phone:         [''],
    street_line_1: [''],
    street_line_2: [''],
    city:          [''],
    state:         [''],
    zip:           [''],
    country:       ['CA'],
  });

  private hasPrefilled = false;

  constructor() {
    effect(() => {
      const profileLoaded = this.auth.profileLoaded();
      if (!profileLoaded || this.hasPrefilled) return;
      this.hasPrefilled = true;

      const p = this.auth.profile();
      this.form.patchValue({ full_name: p?.full_name ?? '', phone: p?.phone ?? '' });

      const saved = p?.default_shipping_address;
      if (saved?.street_line_1) {
        this.form.patchValue({
          street_line_1: saved.street_line_1,
          street_line_2: saved.street_line_2 ?? '',
          city: saved.city, state: saved.state, zip: saved.zip,
          country: saved.country || 'CA',
        });
        return;
      }

      // Fall back to last order address (async best-effort)
      this._prefillFromLastOrder(p?.full_name ?? '');
    });
  }

  private async _prefillFromLastOrder(fullName: string): Promise<void> {
    try {
      const orders = await this.orderService.getMyOrders();
      const last = orders.find((o) => o.shipping_address?.street_line_1);
      if (last?.shipping_address) {
        const a = last.shipping_address;
        this.form.patchValue({
          full_name: fullName || a.full_name,
          street_line_1: a.street_line_1, street_line_2: a.street_line_2 ?? '',
          city: a.city, state: a.state, zip: a.zip, country: a.country || 'CA',
        });
      }
    } catch { /* best-effort */ }
  }

  initials(): string {
    const name = this.profile()?.full_name ?? this.user()?.email ?? '?';
    return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  }

  fieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    this.successMsg.set(null);
    this.errorMsg.set(null);
    const v = this.form.value;
    const err = await this.auth.updateProfile({
      full_name: v.full_name ?? '',
      phone: v.phone ?? '',
      default_shipping_address: {
        full_name: v.full_name ?? '',
        street_line_1: v.street_line_1 ?? '',
        street_line_2: v.street_line_2 ?? '',
        city: v.city ?? '', state: v.state ?? '',
        zip: v.zip ?? '', country: v.country ?? 'CA',
      },
    });
    if (err) { this.errorMsg.set(err); } else { this.successMsg.set('Profile updated successfully.'); }
    this.saving.set(false);
  }
}
