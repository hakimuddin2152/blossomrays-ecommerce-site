import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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

  readonly form = this.fb.group({
    full_name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  fieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
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
