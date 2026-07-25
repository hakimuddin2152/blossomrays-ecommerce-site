import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-announcement-bar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="bg-gold text-white">
      <div class="max-w-7xl mx-auto px-5 sm:px-6 h-9 flex items-center justify-center gap-4">
        <p class="font-body text-[10px] font-semibold tracking-[0.18em] uppercase text-center">
          🍁 Free Shipping on Orders $30+ across Canada &nbsp;·&nbsp;
          <a routerLink="/products" class="underline underline-offset-2 hover:no-underline">
            Shop Now
          </a>
        </p>
      </div>
    </div>
  `,
})
export class AnnouncementBarComponent {}
