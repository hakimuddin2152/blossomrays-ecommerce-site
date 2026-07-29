import { Component, inject, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/layout/navbar.component';
import { FooterComponent } from './components/layout/footer.component';
import { AnnouncementBarComponent } from './components/layout/announcement-bar.component';
import { RegionModalComponent } from './components/shared/region-modal.component';
import { CookieConsentBannerComponent } from './components/shared/cookie-consent-banner.component';
import { AnalyticsService } from './services/analytics.service';
import { ConsentService } from './services/consent.service';

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
  private readonly consent = inject(ConsentService);

  constructor() {
    // Analytics only loads once the visitor has opted in — gated on the
    // cookie consent choice rather than firing unconditionally on load.
    effect(() => {
      if (this.consent.analyticsAllowed()) {
        this.analytics.init();
      }
    });
  }
}
