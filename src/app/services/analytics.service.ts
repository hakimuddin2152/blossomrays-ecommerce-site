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
 * No-ops if `environment.gaMeasurementId` is empty (e.g. local dev without
 * NEXT_PUBLIC_GA_MEASUREMENT_ID set).
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly router = inject(Router);
  private initialized = false;

  init(): void {
    const measurementId = environment.gaMeasurementId;
    if (!measurementId || this.initialized) {
      return;
    }
    this.initialized = true;

    this.loadGtagScript(measurementId);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    // send_page_view is disabled here — page views are sent manually below
    // on each NavigationEnd so SPA route changes are tracked correctly.
    window.gtag('config', measurementId, {
      send_page_view: false,
      debug_mode: isDevMode(),
    });

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
