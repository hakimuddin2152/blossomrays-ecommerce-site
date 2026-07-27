import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-announcement-bar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="bg-plum text-white">
      <div class="max-w-7xl mx-auto px-5 sm:px-6 h-9 flex items-center justify-center gap-4">
        <p class="font-body text-[10px] font-medium tracking-[0.20em] uppercase text-center text-white/70">
          🍁 Free Shipping on Orders $30+ &nbsp;&middot;&nbsp;
          <a routerLink="/products" class="text-gold hover:text-gold/80 transition-colors underline underline-offset-2 hover:no-underline">
            Shop Now
          </a>
        </p>
      </div>
    </div>
  `,
})
export class AnnouncementBarComponent {}
