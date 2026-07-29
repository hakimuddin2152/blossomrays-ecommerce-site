import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { formatPrice } from '../../utils/format-price';
import type { Order, OrderStatus } from '../../types';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="bg-cream min-h-screen">
      <!-- Mobile top nav (shown below md where sidebar is hidden) -->
      <nav class="md:hidden bg-white border-b border-cream-dark px-4 py-2 flex gap-1 overflow-x-auto">
        <a routerLink="/admin" class="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 font-body text-[11px] uppercase tracking-wide text-muted hover:text-plum rounded transition-colors">
          📊 Overview
        </a>
        <a routerLink="/admin/orders" class="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 font-body text-[11px] font-semibold uppercase tracking-wide bg-cream text-plum rounded">
          📦 Orders
        </a>
        <a routerLink="/admin/products" class="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 font-body text-[11px] uppercase tracking-wide text-muted hover:text-plum rounded transition-colors">
          🏷️ Products
        </a>
        <a routerLink="/account" class="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 font-body text-[11px] uppercase tracking-wide text-muted hover:text-plum rounded transition-colors">
          ← Store
        </a>
      </nav>
      <div class="flex h-screen">
        </aside>

        <!-- Main -->
        <main class="flex-1 overflow-y-auto p-6 lg:p-10">
          <h1 class="font-display text-3xl font-semibold text-plum mb-8">Orders</h1>

          <div class="bg-white border border-cream-dark overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-cream">
                  <tr>
                    <th class="text-left px-6 py-3 font-body text-[10px] uppercase tracking-widest text-muted">Order</th>
                    <th class="text-left px-6 py-3 font-body text-[10px] uppercase tracking-widest text-muted">Date</th>
                    <th class="text-left px-6 py-3 font-body text-[10px] uppercase tracking-widest text-muted">Items</th>
                    <th class="text-left px-6 py-3 font-body text-[10px] uppercase tracking-widest text-muted">Status</th>
                    <th class="text-right px-6 py-3 font-body text-[10px] uppercase tracking-widest text-muted">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let o of orders()" class="border-t border-cream-dark hover:bg-cream transition-colors">
                    <td class="px-6 py-3 font-mono text-xs text-plum">{{ o.id.slice(0, 8).toUpperCase() }}</td>
                    <td class="px-6 py-3 font-body text-sm text-muted">{{ o.created_at | date:'shortDate' }}</td>
                    <td class="px-6 py-3 font-body text-sm text-muted">
                      {{ o.order_items?.length ?? 0 }} item(s)
                    </td>
                    <td class="px-6 py-3">
                      <select
                        [value]="o.status"
                        (change)="updateStatus(o, $any($event.target).value)"
                        class="font-body text-xs border border-cream-dark px-2 py-1 bg-white text-plum outline-none"
                      >
                        <option *ngFor="let s of statusOptions" [value]="s">{{ s }}</option>
                      </select>
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
export class AdminOrdersComponent implements OnInit {
  private readonly orderService = inject(OrderService);

  readonly orders = signal<Order[]>([]);
  readonly formatPrice = formatPrice;
  readonly statusOptions = STATUS_OPTIONS;

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.orderService.getAllOrders();
      this.orders.set(data);
    } catch { /* ignore */ }
  }

  async updateStatus(order: Order, status: OrderStatus): Promise<void> {
    try {
      await this.orderService.updateOrderStatus(order.id, status);
      this.orders.update((list) =>
        list.map((o) => o.id === order.id ? { ...o, status } : o),
      );
    } catch { /* ignore */ }
  }
}
