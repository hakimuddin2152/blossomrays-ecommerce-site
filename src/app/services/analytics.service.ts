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
 * Loads Google Analytics (GA4) via gtag.js and tracks SPA route changes
 * as page_view events (Angular's router doesn't trigger full page loads,
 * so gtag's automatic page_view on load isn't enough on its own).
 *
 * IMPORTANT: `start()` loads gtag.js and calls `config` unconditionally on
 * app bootstrap — it does NOT wait for cookie consent. This is intentional
 * and follows Google's recommended Consent Mode v2 pattern: consent
 * defaults to `denied` so no cookies/identifying data are collected until
 * the visitor actually opts in (see `grantConsent()`), but the tag itself
 * is always present so consent updates take effect immediately.
 *
 * A previous version gated the entire script load behind
 * `consent.analyticsAllowed()`, meaning gtag.js never loaded at all unless
 * a visitor explicitly clicked "Accept All" — which meant almost no real
 * traffic was ever recorded, even though everything looked correct in the
 * dataLayer during testing (because the tester had accepted cookies).
 *
 * No-ops if `environment.gaMeasurementId` is empty (e.g. local dev without
 * NEXT_PUBLIC_GA_MEASUREMENT_ID set).
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

    // Consent Mode v2 defaults — must be set before the first `config`/`js`
    // call so even the very first hit (if any fires before the visitor
    // decides) is compliant. analytics_storage tracks the "analytics"
    // cookie category; ad_storage/ad_user_data/ad_personalization track
    // the "marketing" category (Google Ads conversion tag). Both default
    // to denied and only flip to granted once the visitor opts in (see
    // grantAnalyticsConsent()/grantMarketingConsent()).
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });

    window.gtag('js', new Date());

    if (measurementId) {
      // send_page_view is disabled here — page views are sent manually below
      // on each NavigationEnd so SPA route changes are tracked correctly.
      window.gtag('config', measurementId, {
        send_page_view: false,
        debug_mode: isDevMode(),
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
    // navigation. If consent is still denied, gtag.js withholds/downgrades
    // these to cookieless modeled pings rather than dropping them silently.
    this.trackPageView(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.trackPageView(event.urlAfterRedirects));
  }

  /** Call once the visitor opts into analytics cookies. */
  grantAnalyticsConsent(): void {
    window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
  }

  /** Call if the visitor withdraws analytics consent (e.g. via "Manage Preferences"). */
  revokeAnalyticsConsent(): void {
    window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
  }

  /** Call once the visitor opts into marketing cookies (enables Google Ads conversion tracking). */
  grantMarketingConsent(): void {
    window.gtag?.('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });
  }

  /** Call if the visitor withdraws marketing consent. */
  revokeMarketingConsent(): void {
    window.gtag?.('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
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
