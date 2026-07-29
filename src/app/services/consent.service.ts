import { Injectable, inject, signal, computed } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { LocaleService } from './locale.service';
import { AuthService } from './auth.service';

const COOKIE_STORAGE_KEY = 'br_cookie_consent_v1';
const SESSION_ID_KEY = 'br_session_id';

export interface CookiePreferences {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

type CookieChoice = 'accepted_all' | 'necessary_only' | 'customized';
type ConsentKind = 'cookies' | 'terms_of_sale';

interface StoredCookieConsent {
  prefs: CookiePreferences;
  choice: CookieChoice;
}

/**
 * Tracks cookie consent and Terms & Conditions of Sale acceptance.
 *
 * - The visitor's choice is kept locally (localStorage) to gate features
 *   like analytics without a network round-trip.
 * - Every decision is also best-effort logged to Supabase (`legal_consents`
 *   table, see supabase/migrations/010_legal_consents.sql) for an auditable
 *   record of what was agreed to and when. Logging failures never block the
 *   UI — consent still applies locally even if the network write fails.
 */
@Injectable({ providedIn: 'root' })
export class ConsentService {
  private readonly supabase = inject(SupabaseService);
  private readonly locale = inject(LocaleService);
  private readonly auth = inject(AuthService);

  private readonly stored = this.readStorage();

  readonly cookiePrefs = signal<CookiePreferences | null>(this.stored?.prefs ?? null);
  readonly hasDecidedCookies = computed(() => this.cookiePrefs() !== null);
  readonly analyticsAllowed = computed(() => this.cookiePrefs()?.analytics === true);

  savePreferences(prefs: CookiePreferences, choice: CookieChoice): void {
    this.cookiePrefs.set(prefs);
    this.persist({ prefs, choice });
    void this.log('cookies', choice, prefs);
  }

  acceptAll(): void {
    this.savePreferences({ necessary: true, analytics: true, marketing: true }, 'accepted_all');
  }

  acceptNecessaryOnly(): void {
    this.savePreferences({ necessary: true, analytics: false, marketing: false }, 'necessary_only');
  }

  /** Called once the visitor clicks "I Agree" in the Terms of Sale modal. */
  logTermsAcceptance(): void {
    void this.log('terms_of_sale', 'agreed', null);
  }

  private async log(kind: ConsentKind, choice: string, categories: CookiePreferences | null): Promise<void> {
    try {
      await this.supabase.client.from('legal_consents').insert({
        session_id: this.getSessionId(),
        user_id: this.auth.user()?.id ?? null,
        kind,
        choice,
        categories,
        country: this.locale.country(),
        language: this.locale.language(),
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      });
    } catch {
      /* best-effort only — local consent state already applied */
    }
  }

  private getSessionId(): string {
    try {
      let id = localStorage.getItem(SESSION_ID_KEY);
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(SESSION_ID_KEY, id);
      }
      return id;
    } catch {
      return 'unknown';
    }
  }

  private readStorage(): StoredCookieConsent | null {
    try {
      const raw = localStorage.getItem(COOKIE_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as StoredCookieConsent) : null;
    } catch {
      return null;
    }
  }

  private persist(value: StoredCookieConsent): void {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(value));
    } catch {
      /* storage unavailable — non-fatal */
    }
  }
}
