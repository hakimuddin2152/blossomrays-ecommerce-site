import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

/**
 * INTERVIEW CONCEPT: Custom Cross-Field Validator
 *
 * A validator is a function:  (control: AbstractControl) => ValidationErrors | null
 *
 * Three kinds:
 *   1. Sync validator   — returns errors or null immediately.
 *   2. Async validator  — returns Observable<errors | null> or Promise<errors | null>.
 *   3. Cross-field      — applied at the FormGroup level so it can compare
 *                         multiple controls.  That's what passwordMatchValidator is.
 *
 * Why at the group level?
 *   FormControl validators only see one field's value.  To compare
 *   'password' vs 'confirm_password' we need access to both, so we pass
 *   the validator to fb.group({}, { validators: [...] }).
 *
 * The return value is merged into FormGroup.errors (not the individual
 * control's errors), so check it with form.errors?.['passwordMismatch'].
 */
function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password        = group.get('password')?.value;
  const confirmPassword = group.get('confirm_password')?.value;

  // Only validate if both fields have a value (don't flag while user is still typing)
  if (!password || !confirmPassword) return null;

  return password === confirmPassword
    ? null                               // valid — return null
    : { passwordMismatch: true };        // invalid — return error object
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-md">
        <div class="bg-white border border-cream-dark p-8 space-y-6">
          <div class="text-center">
            <a routerLink="/" class="font-display text-2xl font-semibold italic text-plum">BlossomRays</a>
            <h1 class="font-display text-3xl font-semibold text-plum mt-4">Create Account</h1>
            <p class="font-body text-muted text-sm mt-1">Join the BlossomRays community</p>
          </div>

          <ng-container *ngIf="!success()">
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
              <div>
                <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">Full Name</label>
                <input formControlName="full_name" type="text" placeholder="Jane Smith" class="input-field"
                  [class.border-red-400]="fieldInvalid('full_name')" />
                <p *ngIf="fieldInvalid('full_name')" class="font-body text-xs text-red-500 mt-1">Name is required</p>
              </div>

              <div>
                <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">Email</label>
                <input formControlName="email" type="email" placeholder="you@example.com" class="input-field"
                  [class.border-red-400]="fieldInvalid('email')" />
                <p *ngIf="fieldInvalid('email')" class="font-body text-xs text-red-500 mt-1">Valid email required</p>
              </div>

              <div>
                <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">Password</label>
                <input formControlName="password" type="password" placeholder="••••••••" class="input-field"
                  [class.border-red-400]="fieldInvalid('password')" />
                <p *ngIf="fieldInvalid('password')" class="font-body text-xs text-red-500 mt-1">Minimum 8 characters</p>
              </div>

              <!-- Cross-field validator in action -->
              <div>
                <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">Confirm Password</label>
                <input formControlName="confirm_password" type="password" placeholder="••••••••" class="input-field"
                  [class.border-red-400]="fieldInvalid('confirm_password') || passwordMismatch()" />
                <!--
                  form.errors?.['passwordMismatch'] — the cross-field error lives on
                  the GROUP (form), not on the individual confirm_password control.
                -->
                <p *ngIf="passwordMismatch()" class="font-body text-xs text-red-500 mt-1">
                  Passwords do not match
                </p>
              </div>

              <div *ngIf="error()" class="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 font-body text-sm">
                {{ error() }}
              </div>

              <button type="submit" [disabled]="loading()" class="btn-primary w-full">
                {{ loading() ? 'Creating Account...' : 'Create Account' }}
              </button>
            </form>
          </ng-container>

          <ng-container *ngIf="success()">
            <div class="text-center space-y-4 py-4">
              <div class="text-5xl">📧</div>
              <p class="font-body text-plum font-medium">Check your email!</p>
              <p class="font-body text-sm text-muted">We've sent a confirmation link to your inbox. Click it to activate your account.</p>
            </div>
          </ng-container>

          <p class="font-body text-sm text-center text-muted">
            Already have an account?
            <a routerLink="/login" class="text-plum hover:text-gold transition-colors ml-1">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal(false);

  /**
   * INTERVIEW: Cross-field validator registration
   *
   * The second argument to fb.group() is the group-level options object.
   * validators here apply to the FormGroup — they receive the whole group
   * as their AbstractControl argument, enabling cross-field checks.
   *
   * Built-in validators applied per-control:
   *   Validators.required, Validators.email, Validators.minLength(n)
   *
   * Custom validator applied at group level:
   *   passwordMatchValidator — compares password vs confirm_password
   */
  readonly form = this.fb.group(
    {
      full_name:        ['', [Validators.required, Validators.minLength(2)]],
      email:            ['', [Validators.required, Validators.email]],
      password:         ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', [Validators.required]],
    },
    { validators: [passwordMatchValidator] },   // ← group-level validator
  );

  /** Helper: is a specific field invalid AND touched (user has visited it)? */
  fieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  /**
   * INTERVIEW: Reading group-level errors
   * form.errors — errors set by group-level validators (not control-level).
   * Show only after the user has touched confirm_password to avoid premature error.
   */
  passwordMismatch(): boolean {
    const confirmTouched = this.form.get('confirm_password')?.touched;
    return !!(confirmTouched && this.form.errors?.['passwordMismatch']);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set(null);

    const { email, password, full_name } = this.form.value;
    const err = await this.auth.signUp(email!, password!, full_name!);
    if (err) {
      this.error.set(err);
    } else {
      this.success.set(true);
    }
    this.loading.set(false);
  }
}
