import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import type { User, Session, Provider } from '@supabase/supabase-js';
import type { Profile } from '../types';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService).client;
  private readonly router = inject(Router);

  readonly user = signal<User | null>(null);
  readonly profile = signal<Profile | null>(null);
  readonly loading = signal(true);
  /** True once _loadProfile has finished (profile may still be null if no row exists). */
  readonly profileLoaded = signal(false);

  constructor() {
    // Initialize session — .catch() prevents a failed network call (e.g.
    // placeholder credentials in dev) from reaching Zone.js and blocking render.
    this.supabase.auth.getSession()
      .then(({ data }) => {
        this.user.set(data.session?.user ?? null);
        if (data.session?.user) this._loadProfile(data.session.user.id);
      })
      .catch(() => { /* credentials not configured or network error — stay logged out */ })
      .finally(() => { this.loading.set(false); });

    // Subscribe to auth changes
    this.supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      this.user.set(session?.user ?? null);
      if (session?.user) {
        this.profileLoaded.set(false);
        this._loadProfile(session.user.id);
      } else {
        this.profile.set(null);
        this.profileLoaded.set(false);
      }
    });
  }

  async signIn(email: string, password: string): Promise<string | null> {
    const { error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) return 'Invalid email or password. Please try again.';
    return null;
  }

  async signUp(email: string, password: string, fullName: string): Promise<string | null> {
    const { error } = await this.supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return error.message;
    return null;
  }

  /**
   * INTERVIEW: OAuth 2.0 Authorization Code + PKCE Flow
   *
   * signInWithOAuth redirects the browser to the OAuth provider (Google/GitHub).
   * The provider authenticates the user, then redirects back to redirectTo with
   * an auth code. Supabase exchanges that code for a JWT session automatically
   * (PKCE is handled by the Supabase JS SDK — it stores the code_verifier in
   * sessionStorage before the redirect).
   *
   * The onAuthStateChange listener in the constructor picks up the new session
   * when the user returns, updating this.user and this.profile signals.
   */
  async signInWithOAuth(provider: Provider): Promise<string | null> {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/account`,
        queryParams: {
          access_type: 'offline', // request refresh token
          prompt: 'consent',      // always show consent screen (Google)
        },
      },
    });
    return error ? error.message : null;
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
    this.router.navigate(['/']);
  }

  isAdmin(): boolean {
    return this.profile()?.role === 'admin';
  }

  async updateProfile(data: { full_name?: string; phone?: string; default_shipping_address?: Record<string, string> }): Promise<string | null> {
    const user = this.user();
    if (!user) return 'Not authenticated';
    // Use upsert so a missing profile row (trigger didn't fire at signup) is
    // created rather than silently succeeding with 0 rows updated.
    const { error } = await this.supabase
      .from('profiles')
      .upsert(
        { id: user.id, email: user.email ?? '', ...data, updated_at: new Date().toISOString() },
        { onConflict: 'id' },
      );
    if (error) return error.message;
    // Refresh the in-memory profile signal
    await this._loadProfile(user.id);
    return null;
  }

  private async _loadProfile(userId: string): Promise<void> {
    const { data } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    this.profile.set(data ?? null);
    this.profileLoaded.set(true);
  }
}
