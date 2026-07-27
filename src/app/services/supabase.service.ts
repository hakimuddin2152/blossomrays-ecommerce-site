import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

// Supabase JS v2 uses navigator.locks to serialize token refreshes across tabs.
// When a second tab tries to acquire the lock immediately it throws an unhandled
// rejection that Zone.js surfaces as a console error. Replacing the lock
// implementation with a simple mutex keeps the behaviour correct in a single tab
// while silencing the cross-tab noise.
function noopLock<T>(
  _name: string,
  _acquireTimeout: number,
  fn: () => Promise<T>,
): Promise<T> {
  return fn();
}

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private _client: SupabaseClient | null = null;

  get client(): SupabaseClient {
    if (!this._client) {
      const { supabaseUrl, supabaseAnonKey } = environment;
      const authOptions = { lock: noopLock };
      if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
        // Return a no-op client stub until real credentials are configured.
        // App UI will still render; Supabase-dependent features will be skipped.
        console.warn('[SupabaseService] Supabase credentials not configured — fill in src/app/environments/environment.ts');
        // Create with dummy-but-valid URL so the SDK doesn't throw
        this._client = createClient('https://placeholder.supabase.co', 'placeholder', { auth: authOptions });
      } else {
        this._client = createClient(supabaseUrl, supabaseAnonKey, { auth: authOptions });
      }
    }
    return this._client;
  }
}
