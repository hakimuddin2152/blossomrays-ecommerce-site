import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-announcement-bar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="bg-plum text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-center gap-4">
        <!-- Full text on sm+, shortened on mobile -->
        <p class="hidden sm:block font-body text-[10px] font-medium tracking-[0.20em] uppercase text-center text-white/70">
          🍁 Free Shipping on Orders $30+ &nbsp;&middot;&nbsp;
          <a routerLink="/products" class="text-gold hover:text-gold/80 transition-colors underline underline-offset-2 hover:no-underline">
            Shop Now
          </a>
        </p>
        <p class="sm:hidden font-body text-[10px] font-medium tracking-[0.16em] uppercase text-center text-white/70">
          🍁 Free Shipping $30+&nbsp;&nbsp;
          <a routerLink="/products" class="text-gold">Shop →</a>
        </p>
      </div>
    </div>
  `,
})
export class AnnouncementBarComponent {}
