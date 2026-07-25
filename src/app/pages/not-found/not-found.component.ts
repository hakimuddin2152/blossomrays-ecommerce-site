import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-cream flex items-center justify-center px-4">
      <div class="text-center space-y-6">
        <p class="font-display text-[8rem] font-semibold text-cream-dark leading-none">404</p>
        <h1 class="font-display text-4xl font-semibold text-plum">Page Not Found</h1>
        <p class="font-body text-muted max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div class="flex gap-4 justify-center">
          <a routerLink="/" class="btn-primary">Go Home</a>
          <a routerLink="/products" class="btn-outline">Browse Products</a>
        </div>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
