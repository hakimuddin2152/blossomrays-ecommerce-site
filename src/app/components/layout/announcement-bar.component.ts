import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-announcement-bar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="bg-plum text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-center gap-4">
        <!-- Full text on sm+, shortened on mobile -->
        <p class="hidden sm:block font-body text-[10px] font-medium tracking-[0.20em] uppercase text-center text-white/70">
          🍁 {{ t('announcement.freeShippingFull') }} &nbsp;&middot;&nbsp;
          <a routerLink="/products" class="text-gold hover:text-gold/80 transition-colors underline underline-offset-2 hover:no-underline">
            {{ t('announcement.shopNow') }}
          </a>
        </p>
        <p class="sm:hidden font-body text-[10px] font-medium tracking-[0.16em] uppercase text-center text-white/70">
          🍁 {{ t('announcement.freeShippingShort') }}&nbsp;&nbsp;
          <a routerLink="/products" class="text-gold">{{ t('announcement.shop') }} →</a>
        </p>
      </div>
    </div>
  `,
})
export class AnnouncementBarComponent {
  private readonly i18n = inject(TranslationService);

  t(key: string): string {
    return this.i18n.t(key);
  }
}
