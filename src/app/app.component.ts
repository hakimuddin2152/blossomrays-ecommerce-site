import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/layout/navbar.component';
import { FooterComponent } from './components/layout/footer.component';
import { AnnouncementBarComponent } from './components/layout/announcement-bar.component';
import { RegionModalComponent } from './components/shared/region-modal.component';
import { CookieConsentBannerComponent } from './components/shared/cookie-consent-banner.component';
import { AnalyticsService } from './services/analytics.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    AnnouncementBarComponent,
    RegionModalComponent,
    CookieConsentBannerComponent,
  ],
  template: `
    <app-announcement-bar />
    <app-navbar />
    <main>
      <router-outlet />
    </main>
    <app-footer />

    <app-region-modal />
    <app-cookie-consent-banner />
  `,
})
export class AppComponent {
  private readonly analytics = inject(AnalyticsService);

  constructor() {
    // Always start analytics/ads tags on load — see AnalyticsService for why
    // gtag('consent', ...) signals are intentionally NOT sent (empirically
    // suppressed all real traffic on this GA4 property/Ads account). The
    // cookie banner (ConsentService) still records the visitor's choice to
    // Supabase for compliance purposes, but no longer gates tracking.
    this.analytics.start();
  }
}
