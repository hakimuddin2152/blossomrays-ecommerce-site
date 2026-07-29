import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { formatPrice } from '../../utils/format-price';
import { TranslationService } from '../../services/translation.service';
import type { Order } from '../../types';

@Component({
  selector: 'app-account-order-detail',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="bg-cream min-h-screen">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div class="flex items-center gap-3 mb-10">
          <a routerLink="/account/orders" class="text-muted hover:text-plum">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.75 19.5L8.25 12l7.5-7.5"/>
            </svg>
          </a>
          <h1 class="font-display text-3xl font-semibold text-plum">
            {{ t('accountOrders.order') }} #{{ order()?.id?.slice(0, 8)?.toUpperCase() }}
          </h1>
        </div>

        <ng-container *ngIf="loading()">
          <div class="space-y-3">
            <div *ngFor="let s of skeletons" class="h-20 bg-white border border-cream-dark animate-pulse"></div>
          </div>
        </ng-container>

        <ng-container *ngIf="!loading() && order() as o">
          <div class="space-y-6">
            <!-- Status + date -->
            <div class="bg-white border border-cream-dark p-5 flex justify-between items-center">
              <div>
                <p class="font-body text-xs text-muted">{{ t('accountOrderDetail.placed') }}</p>
                <p class="font-body text-sm text-plum font-medium">{{ o.created_at | date:'longDate' }}</p>
              </div>
              <span class="badge bg-cream border-cream-dark text-muted">{{ o.status }}</span>
            </div>

            <!-- Items -->
            <div class="bg-white border border-cream-dark p-5 space-y-4">
              <h2 class="font-display text-lg font-semibold text-plum">{{ t('accountOrderDetail.items') }}</h2>
              <div *ngFor="let item of o.order_items" class="flex gap-4 py-3 border-b border-cream-dark last:border-0">
                <div class="flex-1">
                  <p class="font-body text-sm font-medium text-plum">{{ item.product?.name ?? t('accountOrderDetail.product') }}</p>
                  <p class="font-body text-xs text-muted">{{ t('checkout.qty') }}: {{ item.quantity }}</p>
                </div>
                <span class="font-body text-sm text-plum">{{ formatPrice(item.unit_price * item.quantity) }}</span>
              </div>
            </div>

            <!-- Totals -->
            <div class="bg-white border border-cream-dark p-5 space-y-3 font-body text-sm">
              <div class="flex justify-between"><span class="text-muted">{{ t('checkout.subtotal') }}</span><span>{{ formatPrice(o.subtotal) }}</span></div>
              <div class="flex justify-between"><span class="text-muted">{{ t('checkout.shipping') }}</span><span>{{ formatPrice(o.shipping_cost) }}</span></div>
              <hr class="border-cream-dark" />
              <div class="flex justify-between font-semibold text-plum text-base">
                <span>{{ t('checkout.total') }}</span><span>{{ formatPrice(o.total) }}</span>
              </div>
            </div>

            <!-- Shipping address -->
            <div class="bg-white border border-cream-dark p-5 space-y-2">
              <h2 class="font-display text-lg font-semibold text-plum">{{ t('accountOrderDetail.shippingAddress') }}</h2>
              <div class="font-body text-sm text-muted leading-relaxed">
                <p>{{ o.shipping_address?.full_name }}</p>
                <p>{{ o.shipping_address?.street_line_1 }}</p>
                <p *ngIf="o.shipping_address?.street_line_2">{{ o.shipping_address?.street_line_2 }}</p>
                <p>{{ o.shipping_address?.city }}, {{ o.shipping_address?.state }} {{ o.shipping_address?.zip }}</p>
                <p>{{ o.shipping_address?.country }}</p>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
})
export class AccountOrderDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);
  private readonly i18n = inject(TranslationService);

  readonly order = signal<Order | null>(null);
  readonly loading = signal(true);
  readonly formatPrice = formatPrice;
  readonly skeletons = Array(3);

  t(key: string): string {
    return this.i18n.t(key);
  }

  async ngOnInit(): Promise<void> {
    const orderId = this.route.snapshot.paramMap.get('orderId') ?? '';
    try {
      const order = await this.orderService.getOrderById(orderId);
      this.order.set(order);
    } catch { /* ignore */ }
    this.loading.set(false);
  }
}
