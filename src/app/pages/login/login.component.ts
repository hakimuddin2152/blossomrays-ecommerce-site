import { Component, inject, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-md">
        <div class="bg-white border border-cream-dark p-8 space-y-6">
          <div class="text-center">
            <a routerLink="/" class="font-display text-2xl font-semibold italic text-plum">BlossomRays</a>
            <h1 class="font-display text-3xl font-semibold text-plum mt-4">Welcome Back</h1>
            <p class="font-body text-muted text-sm mt-1">Sign in to your account</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">Email</label>
              <!-- #emailInput — template reference variable grabbed by @ViewChild below -->
              <input #emailInput formControlName="email" type="email" placeholder="you@example.com" class="input-field"
                [class.border-red-400]="fieldInvalid('email')" />
              <p *ngIf="fieldInvalid('email')" class="font-body text-xs text-red-500 mt-1">Enter a valid email</p>
            </div>

            <div>
              <label class="block font-body text-[11px] uppercase tracking-widest text-muted mb-1.5">Password</label>
              <input formControlName="password" type="password" placeholder="••••••••" class="input-field"
                [class.border-red-400]="fieldInvalid('password')" />
              <p *ngIf="fieldInvalid('password')" class="font-body text-xs text-red-500 mt-1">Minimum 6 characters</p>
            </div>

            <div *ngIf="error()" class="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 font-body text-sm">
              {{ error() }}
            </div>

            <button type="submit" [disabled]="loading()" class="btn-primary w-full">
              {{ loading() ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <p class="font-body text-sm text-center text-muted">
            Don't have an account?
            <a routerLink="/register" class="text-plum hover:text-gold transition-colors ml-1">Register</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent implements AfterViewInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  /**
   * INTERVIEW: @ViewChild + ElementRef
   *
   * @ViewChild queries the component's own template for a DOM element or
   * child component. { static: false } (default) means it's resolved after
   * the first change-detection cycle — safe for conditional elements.
   * { static: true } resolves before CD, required only if used in ngOnInit.
   *
   * ElementRef gives direct DOM access — use sparingly, prefer Renderer2 for
   * SSR compatibility. Here it's safe: focus is a browser-only concern.
   */
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngAfterViewInit(): void {
    // Auto-focus the email field when the login page mounts
    this.emailInput.nativeElement.focus();
  }

  fieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set(null);

    const { email, password } = this.form.value;
    const err = await this.auth.signIn(email!, password!);
    if (err) {
      this.error.set(err);
    } else {
      this.router.navigate(['/account']);
    }
    this.loading.set(false);
  }
}
