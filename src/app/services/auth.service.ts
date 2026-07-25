import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '../types';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService).client;
  private readonly router = inject(Router);

  readonly user = signal<User | null>(null);
  readonly profile = signal<Profile | null>(null);
  readonly loading = signal(true);

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
        this._loadProfile(session.user.id);
      } else {
        this.profile.set(null);
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

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
    this.router.navigate(['/']);
  }

  isAdmin(): boolean {
    return this.profile()?.role === 'admin';
  }

  private async _loadProfile(userId: string): Promise<void> {
    const { data } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    this.profile.set(data ?? null);
  }
}
