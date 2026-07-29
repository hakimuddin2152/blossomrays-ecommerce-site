import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/layout/navbar.component';
import { FooterComponent } from './components/layout/footer.component';
import { AnnouncementBarComponent } from './components/layout/announcement-bar.component';
import { AnalyticsService } from './services/analytics.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, AnnouncementBarComponent],
  template: `
    <app-announcement-bar />
    <app-navbar />
    <main>
      <router-outlet />
    </main>
    <app-footer />
  `,
})
export class AppComponent implements OnInit {
  private readonly analytics = inject(AnalyticsService);

  ngOnInit(): void {
    this.analytics.init();
  }
}
