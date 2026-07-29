import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { formatPrice } from '../../utils/format-price';
import { TranslationService } from '../../services/translation.service';
import type { Order } from '../../types';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="bg-cream min-h-screen">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div class="flex items-center justify-between mb-10">
          <div>
            <p class="section-eyebrow mb-1">{{ t('account.eyebrow') }}</p>
            <h1 class="font-display text-4xl font-semibold text-plum">
              {{ profile()?.full_name ?? t('account.welcomeBack') }}
            </h1>
            <p class="font-body text-sm text-muted mt-1">{{ user()?.email }}</p>
          </div>
          <button (click)="signOut()" class="btn-ghost text-red-500 hover:text-red-700">{{ t('account.signOut') }}</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <a routerLink="/account/orders" class="bg-white border border-cream-dark p-6 hover:shadow-soft transition-shadow group">
            <div class="text-3xl mb-3">📦</div>
            <h3 class="font-display text-lg font-semibold text-plum group-hover:text-gold transition-colors">{{ t('account.orders.title') }}</h3>
            <p class="font-body text-sm text-muted mt-1">{{ t('account.orders.desc') }}</p>
          </a>
          <a routerLink="/account/profile" class="bg-white border border-cream-dark p-6 hover:shadow-soft transition-shadow group">
            <div class="text-3xl mb-3">👤</div>
            <h3 class="font-display text-lg font-semibold text-plum group-hover:text-gold transition-colors">{{ t('account.profile.title') }}</h3>
            <p class="font-body text-sm text-muted mt-1">{{ t('account.profile.desc') }}</p>
          </a>
          <a routerLink="/products" class="bg-white border border-cream-dark p-6 hover:shadow-soft transition-shadow group">
            <div class="text-3xl mb-3">🛍️</div>
            <h3 class="font-display text-lg font-semibold text-plum group-hover:text-gold transition-colors">{{ t('account.shop.title') }}</h3>
            <p class="font-body text-sm text-muted mt-1">{{ t('account.shop.desc') }}</p>
          </a>
          <div *ngIf="isAdmin()" class="bg-white border border-cream-dark p-6 hover:shadow-soft transition-shadow group">
            <a routerLink="/admin">
              <div class="text-3xl mb-3">⚙️</div>
              <h3 class="font-display text-lg font-semibold text-plum group-hover:text-gold transition-colors">{{ t('account.admin.title') }}</h3>
              <p class="font-body text-sm text-muted mt-1">{{ t('account.admin.desc') }}</p>
            </a>
          </div>
        </div>

        <!-- Recent orders -->
        <div class="bg-white border border-cream-dark p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="font-display text-xl font-semibold text-plum">{{ t('account.recentOrders') }}</h2>
            <a routerLink="/account/orders" class="font-body text-xs text-muted hover:text-gold transition-colors">{{ t('common.viewAll') }} →</a>
          </div>

          <ng-container *ngIf="loadingOrders()">
            <div *ngFor="let s of skeletons" class="h-14 bg-cream-dark animate-pulse"></div>
          </ng-container>

          <ng-container *ngIf="!loadingOrders()">
            <p *ngIf="recentOrders().length === 0" class="font-body text-sm text-muted py-4">{{ t('account.noOrders') }}</p>
            <div *ngFor="let o of recentOrders()" class="flex items-center justify-between py-3 border-b border-cream-dark last:border-0">
              <div>
                <p class="font-body text-sm font-medium text-plum">{{ t('account.order') }} #{{ o.id.slice(0, 8).toUpperCase() }}</p>
                <p class="font-body text-xs text-muted">{{ o.created_at | date:'mediumDate' }}</p>
              </div>
              <div class="flex items-center gap-4">
                <span class="badge bg-cream border-cream-dark text-muted">{{ o.status }}</span>
                <span class="font-body text-sm font-semibold text-plum">{{ formatPrice(o.total) }}</span>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `,
})
export class AccountComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly i18n = inject(TranslationService);

  readonly user = this.auth.user;
  readonly profile = this.auth.profile;
  readonly formatPrice = formatPrice;
  readonly loadingOrders = signal(true);
  readonly recentOrders = signal<Order[]>([]);
  readonly skeletons = Array(3);

  isAdmin(): boolean { return this.auth.isAdmin(); }

  t(key: string): string {
    return this.i18n.t(key);
  }

  async ngOnInit(): Promise<void> {
    try {
      const orders = await this.orderService.getMyOrders();
      this.recentOrders.set(orders.slice(0, 5));
    } catch { /* ignore */ }
    this.loadingOrders.set(false);
  }

  signOut(): void { this.auth.signOut(); }
}
