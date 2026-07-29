import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-cream flex items-center justify-center px-4">
      <div class="text-center space-y-6">
        <p class="font-display text-[8rem] font-semibold text-cream-dark leading-none">404</p>
        <h1 class="font-display text-4xl font-semibold text-plum">{{ t('notFound.title') }}</h1>
        <p class="font-body text-muted max-w-sm mx-auto">
          {{ t('notFound.desc') }}
        </p>
        <div class="flex gap-4 justify-center">
          <a routerLink="/" class="btn-primary">{{ t('notFound.goHome') }}</a>
          <a routerLink="/products" class="btn-outline">{{ t('common.browseProducts') }}</a>
        </div>
      </div>
    </div>
  `,
})
export class NotFoundComponent {
  private readonly i18n = inject(TranslationService);

  t(key: string): string {
    return this.i18n.t(key);
  }
}
