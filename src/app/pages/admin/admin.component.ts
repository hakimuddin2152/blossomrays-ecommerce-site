import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { formatPrice } from '../../utils/format-price';
import type { Order } from '../../types';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="bg-cream min-h-screen">
      <div class="flex h-screen">
        <!-- Sidebar -->
        <aside class="w-64 bg-white border-r border-cream-dark flex-shrink-0 hidden md:flex flex-col py-6 px-4 space-y-2">
          <p class="section-eyebrow px-3 mb-4">Admin Panel</p>
          <a routerLink="/admin" class="flex items-center gap-3 px-3 py-2 font-body text-sm text-plum bg-cream rounded-lg">
            <span>📊</span> Overview
          </a>
          <a routerLink="/admin/orders" class="flex items-center gap-3 px-3 py-2 font-body text-sm text-muted hover:text-plum hover:bg-cream rounded-lg transition-colors">
            <span>📦</span> Orders
          </a>
          <a routerLink="/admin/products" class="flex items-center gap-3 px-3 py-2 font-body text-sm text-muted hover:text-plum hover:bg-cream rounded-lg transition-colors">
            <span>🏷️</span> Products
          </a>
          <hr class="border-cream-dark" />
          <a routerLink="/account" class="flex items-center gap-3 px-3 py-2 font-body text-sm text-muted hover:text-plum hover:bg-cream rounded-lg transition-colors">
            <span>←</span> Back to Store
          </a>
        </aside>

        <!-- Main -->
        <main class="flex-1 overflow-y-auto p-6 lg:p-10">
          <h1 class="font-display text-3xl font-semibold text-plum mb-8">Overview</h1>

          <!-- Stats cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div *ngFor="let stat of stats()" class="bg-white border border-cream-dark p-5 space-y-2">
              <p class="font-body text-[11px] uppercase tracking-widest text-muted">{{ stat.label }}</p>
              <p class="font-display text-3xl font-semibold text-plum">{{ stat.value }}</p>
            </div>
          </div>

          <!-- Recent orders table -->
          <div class="bg-white border border-cream-dark overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-cream-dark">
              <h2 class="font-display text-lg font-semibold text-plum">Recent Orders</h2>
              <a routerLink="/admin/orders" class="font-body text-xs text-muted hover:text-gold">View all →</a>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-cream">
                  <tr>
                    <th class="text-left px-6 py-3 font-body text-[10px] uppercase tracking-widest text-muted">Order ID</th>
                    <th class="text-left px-6 py-3 font-body text-[10px] uppercase tracking-widest text-muted">Date</th>
                    <th class="text-left px-6 py-3 font-body text-[10px] uppercase tracking-widest text-muted">Status</th>
                    <th class="text-right px-6 py-3 font-body text-[10px] uppercase tracking-widest text-muted">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let o of orders().slice(0, 10)" class="border-t border-cream-dark hover:bg-cream transition-colors">
                    <td class="px-6 py-3 font-mono text-xs text-plum">{{ o.id.slice(0, 8).toUpperCase() }}</td>
                    <td class="px-6 py-3 font-body text-sm text-muted">{{ o.created_at | date:'shortDate' }}</td>
                    <td class="px-6 py-3">
                      <span class="badge bg-cream border-cream-dark text-muted">{{ o.status }}</span>
                    </td>
                    <td class="px-6 py-3 font-body text-sm font-semibold text-plum text-right">{{ formatPrice(o.total) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
})
export class AdminComponent implements OnInit {
  private readonly orderService = inject(OrderService);

  readonly orders = signal<Order[]>([]);
  readonly formatPrice = formatPrice;

  readonly stats = signal<{ label: string; value: string }[]>([]);

  async ngOnInit(): Promise<void> {
    try {
      const orders = await this.orderService.getAllOrders();
      this.orders.set(orders);

      const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
      const paid = orders.filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered').length;

      this.stats.set([
        { label: 'Total Orders', value: String(orders.length) },
        { label: 'Revenue', value: formatPrice(revenue) },
        { label: 'Paid Orders', value: String(paid) },
        { label: 'Pending', value: String(orders.filter(o => o.status === 'pending').length) },
      ]);
    } catch { /* ignore */ }
  }
}
