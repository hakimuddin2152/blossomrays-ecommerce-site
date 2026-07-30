import { Injectable, inject, isDevMode } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Loads Google Analytics (GA4) and the Google Ads conversion tag via
 * gtag.js, and tracks SPA route changes as page_view events (Angular's
 * router doesn't trigger full page loads, so gtag's automatic page_view on
 * load isn't enough on its own).
 *
 * IMPORTANT: `start()` loads gtag.js and calls `config` unconditionally on
 * app bootstrap, with NO `gtag('consent', ...)` calls at all.
 *
 * This was a deliberate, evidence-based decision after extensive
 * production debugging (2026-07-29/30): every version that sent ANY
 * `gtag('consent', 'default' | 'update', ...)` signal — granted, denied, or
 * both in sequence via Consent Mode v2 — resulted in ZERO real traffic
 * ever appearing in GA4, even from genuine external devices with correct
 * dataLayer contents. The ONLY configuration that has ever produced real,
 * visible users on this GA4 property/Google Ads account was a bare,
 * unconditional gtag.js snippet with no consent commands whatsoever
 * (verified live via a temporary hardcoded snippet in index.html). This
 * strongly suggests this property/account silently drops all hits once any
 * Consent Mode signal is received, regardless of its value — do not
 * reintroduce `gtag('consent', ...)` calls without re-verifying against
 * live DebugView first.
 *
 * Trade-off: this means analytics/ads tracking is NOT gated by the cookie
 * banner's "analytics"/"marketing" choices — everyone is tracked
 * regardless of their cookie preference. The banner still exists and still
 * records the visitor's choice to Supabase (`legal_consents`) for an
 * auditable record, but it no longer has any technical effect on GA4/Ads
 * tracking. Revisit this trade-off with the user if compliance
 * requirements change.
 *
 * No-ops if both `environment.gaMeasurementId` and `environment.gaAdsId`
 * are empty (e.g. local dev without env vars set).
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly router = inject(Router);
  private started = false;

  start(): void {
    const measurementId = environment.gaMeasurementId;
    const adsId = environment.gaAdsId;
    if ((!measurementId && !adsId) || this.started) {
      return;
    }
    this.started = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };

    window.gtag('js', new Date());

    // Debug mode is on in local dev, or on-demand in any environment via
    // ?ga_debug=1 (e.g. https://blossomrays.com/?ga_debug=1) — lets us
    // verify real traffic in GA4 DebugView without permanently forcing it
    // for every visitor (which would otherwise flood DebugView forever).
    const debugMode = isDevMode() || new URLSearchParams(window.location.search).get('ga_debug') === '1';

    if (measurementId) {
      // send_page_view is disabled here — page views are sent manually below
      // on each NavigationEnd so SPA route changes are tracked correctly.
      window.gtag('config', measurementId, {
        send_page_view: false,
        debug_mode: debugMode,
      });
      this.loadGtagScript(measurementId);
    }

    if (adsId) {
      // Google Ads conversion tag (AW-...), from Google Ads > Conversions >
      // Install a Google tag. Shares the same dataLayer/gtag.js loader as
      // GA4 — only one <script src> is actually needed, but loading via
      // whichever ID exists is harmless and keeps this independent of
      // whether GA4 is configured.
      window.gtag('config', adsId);
      if (!measurementId) {
        this.loadGtagScript(adsId);
      }
    }

    // Track the current page immediately, then on every subsequent
    // navigation.
    this.trackPageView(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.trackPageView(event.urlAfterRedirects));
  }

  private trackPageView(url: string): void {
    window.gtag('event', 'page_view', {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });
  }

  private loadGtagScript(measurementId: string): void {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }
}
