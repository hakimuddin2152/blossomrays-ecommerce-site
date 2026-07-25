import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { formatPrice } from '../../utils/format-price';
import type { Order } from '../../types';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="bg-cream min-h-screen flex items-center justify-center px-4 py-20">
      <div class="max-w-lg w-full space-y-8 text-center">
        <!-- Success icon -->
        <div class="w-20 h-20 mx-auto bg-sage-light border border-sage/20 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-sage" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>

        <div class="space-y-2">
          <h1 class="font-display text-4xl font-semibold text-plum">Order Confirmed!</h1>
          <p class="font-body text-muted">Thank you for your purchase. We'll send you a shipping confirmation soon.</p>
        </div>

        <!-- Order details -->
        <div *ngIf="order() as o" class="bg-white border border-cream-dark p-6 text-left space-y-4">
          <div class="flex justify-between font-body text-sm">
            <span class="text-muted">Order ID</span>
            <span class="text-plum font-mono text-xs">{{ o.id.slice(0, 8).toUpperCase() }}</span>
          </div>
          <div class="flex justify-between font-body text-sm">
            <span class="text-muted">Total</span>
            <span class="text-plum font-semibold">{{ formatPrice(o.total) }}</span>
          </div>
          <div class="flex justify-between font-body text-sm">
            <span class="text-muted">Status</span>
            <span class="badge bg-sage-light border-sage/20 text-sage-dark">{{ o.status }}</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a routerLink="/account/orders" class="btn-primary">View Orders</a>
          <a routerLink="/products" class="btn-outline">Continue Shopping</a>
        </div>
      </div>
    </div>
  `,
})
export class OrderConfirmationComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);

  readonly order = signal<Order | null>(null);
  readonly formatPrice = formatPrice;

  async ngOnInit(): Promise<void> {
    const orderId = this.route.snapshot.paramMap.get('orderId');
    if (orderId) {
      try {
        const order = await this.orderService.getOrderById(orderId);
        this.order.set(order);
      } catch { /* not critical */ }
    }
  }
}
