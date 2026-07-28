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

          <!-- OAuth divider -->
          <div class="relative flex items-center gap-3">
            <div class="flex-1 h-px bg-cream-dark"></div>
            <span class="font-body text-xs text-muted uppercase tracking-wider">or continue with</span>
            <div class="flex-1 h-px bg-cream-dark"></div>
          </div>

          <!-- OAuth buttons -->
          <div class="grid grid-cols-2 gap-3">
            <button type="button" (click)="signInWithGoogle()" [disabled]="oauthLoading()"
              class="flex items-center justify-center gap-2 border border-cream-dark px-4 py-2.5 font-body text-sm text-dark hover:bg-cream transition-colors disabled:opacity-50">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {{ oauthLoading() === 'google' ? 'Redirecting...' : 'Google' }}
            </button>

            <button type="button" (click)="signInWithGitHub()" [disabled]="oauthLoading()"
              class="flex items-center justify-center gap-2 border border-cream-dark px-4 py-2.5 font-body text-sm text-dark hover:bg-cream transition-colors disabled:opacity-50">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              {{ oauthLoading() === 'github' ? 'Redirecting...' : 'GitHub' }}
            </button>
          </div>

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
  readonly oauthLoading = signal<'google' | 'github' | null>(null);

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

  async signInWithGoogle(): Promise<void> {
    this.oauthLoading.set('google');
    const err = await this.auth.signInWithOAuth('google');
    if (err) { this.error.set(err); this.oauthLoading.set(null); }
    // On success the browser redirects — no need to reset state
  }

  async signInWithGitHub(): Promise<void> {
    this.oauthLoading.set('github');
    const err = await this.auth.signInWithOAuth('github');
    if (err) { this.error.set(err); this.oauthLoading.set(null); }
  }
}
