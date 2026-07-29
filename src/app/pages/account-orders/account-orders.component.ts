import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { formatPrice } from '../../utils/format-price';
import type { Order } from '../../types';

@Component({
  selector: 'app-account-orders',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="bg-cream min-h-screen">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div class="flex items-center gap-3 mb-10">
          <a routerLink="/account" class="text-muted hover:text-plum transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.75 19.5L8.25 12l7.5-7.5"/>
            </svg>
          </a>
          <h1 class="font-display text-3xl sm:text-4xl font-semibold text-plum">Order History</h1>
        </div>

        <ng-container *ngIf="loading()">
          <div *ngFor="let s of skeletons" class="h-24 bg-white border border-cream-dark mb-3 animate-pulse"></div>
        </ng-container>

        <ng-container *ngIf="!loading()">
          <p *ngIf="orders().length === 0" class="font-body text-muted text-center py-16">
            No orders yet. <a routerLink="/products" class="text-plum hover:text-gold">Start shopping →</a>
          </p>

          <div class="space-y-4">
            <div *ngFor="let o of orders()" class="bg-white border border-cream-dark p-5 hover:shadow-soft transition-shadow">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="space-y-1">
                  <p class="font-body text-[11px] uppercase tracking-widest text-muted">Order</p>
                  <p class="font-display text-lg font-semibold text-plum">#{{ o.id.slice(0, 8).toUpperCase() }}</p>
                  <p class="font-body text-sm text-muted">{{ o.created_at | date:'longDate' }}</p>
                </div>
                <div class="flex items-center gap-6">
                  <div class="text-right">
                    <p class="font-body text-xs text-muted">Total</p>
                    <p class="font-body text-base font-semibold text-plum">{{ formatPrice(o.total) }}</p>
                  </div>
                  <span class="badge bg-cream border-cream-dark text-muted">{{ o.status }}</span>
                  <a [routerLink]="['/account/orders', o.id]" class="btn-ghost py-2 px-4 text-[10px]">Details</a>
                </div>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
})
export class AccountOrdersComponent implements OnInit {
  private readonly orderService = inject(OrderService);

  readonly orders = signal<Order[]>([]);
  readonly loading = signal(true);
  readonly formatPrice = formatPrice;
  readonly skeletons = Array(4);

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.orderService.getMyOrders();
      this.orders.set(data);
    } catch { /* ignore */ }
    this.loading.set(false);
  }
}
