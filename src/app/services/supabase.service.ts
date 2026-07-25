import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private _client: SupabaseClient | null = null;

  get client(): SupabaseClient {
    if (!this._client) {
      const { supabaseUrl, supabaseAnonKey } = environment;
      if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
        // Return a no-op client stub until real credentials are configured.
        // App UI will still render; Supabase-dependent features will be skipped.
        console.warn('[SupabaseService] Supabase credentials not configured — fill in src/app/environments/environment.ts');
        // Create with dummy-but-valid URL so the SDK doesn't throw
        this._client = createClient('https://placeholder.supabase.co', 'placeholder');
      } else {
        this._client = createClient(supabaseUrl, supabaseAnonKey);
      }
    }
    return this._client;
  }
}
