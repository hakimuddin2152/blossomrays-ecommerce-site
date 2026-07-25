import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { formatPrice } from '../../utils/format-price';
import type { CartItem } from '../../types';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="bg-cream min-h-screen">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <h1 class="font-display text-4xl font-semibold text-plum mb-10">Your Cart</h1>

        <!-- Empty state -->
        <ng-container *ngIf="items().length === 0">
          <div class="text-center py-20 space-y-4">
            <span class="text-7xl block">🛒</span>
            <p class="font-body text-muted text-lg">Your cart is empty.</p>
            <a routerLink="/products" class="btn-primary inline-flex mt-4">Browse Products</a>
          </div>
        </ng-container>

        <!-- Cart content -->
        <ng-container *ngIf="items().length > 0">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Items -->
            <div class="lg:col-span-2 space-y-4">
              <div
                *ngFor="let item of items()"
                class="bg-white border border-cream-dark p-4 flex gap-4"
              >
                <img
                  [src]="item.product.images[0] || '/images/lavender/1.jpg'"
                  [alt]="item.product.name"
                  class="w-24 h-24 object-cover bg-cream flex-shrink-0"
                />
                <div class="flex-1 space-y-2">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="font-display text-lg font-semibold text-plum">{{ item.product.name }}</h3>
                      <p class="font-body text-xs text-muted">{{ item.product.category }}</p>
                    </div>
                    <button
                      (click)="remove(item.product.id)"
                      class="text-muted hover:text-red-500 transition-colors"
                      aria-label="Remove"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center border border-cream-dark">
                      <button (click)="decrement(item)" class="w-8 h-8 flex items-center justify-center hover:bg-cream transition-colors">−</button>
                      <span class="w-10 text-center font-body text-sm text-plum">{{ item.quantity }}</span>
                      <button (click)="increment(item)" class="w-8 h-8 flex items-center justify-center hover:bg-cream transition-colors">+</button>
                    </div>
                    <span class="font-body text-sm font-semibold text-plum">
                      {{ formatPrice(item.product.price * item.quantity) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Summary -->
            <div class="lg:col-span-1">
              <div class="bg-white border border-cream-dark p-6 space-y-5 sticky top-28">
                <h2 class="font-display text-xl font-semibold text-plum">Order Summary</h2>

                <div class="space-y-3 font-body text-sm">
                  <div class="flex justify-between">
                    <span class="text-muted">Subtotal ({{ cart.totalItems() }} items)</span>
                    <span class="text-plum font-medium">{{ formatPrice(subtotal()) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted">Shipping</span>
                    <span class="text-plum font-medium">{{ subtotal() >= 3000 ? 'Free' : formatPrice(999) }}</span>
                  </div>
                </div>

                <hr class="border-cream-dark" />

                <div class="flex justify-between font-body text-base font-semibold text-plum">
                  <span>Total</span>
                  <span>{{ formatPrice(subtotal() >= 3000 ? subtotal() : subtotal() + 999) }}</span>
                </div>

                <a routerLink="/checkout" class="btn-primary w-full flex items-center justify-center gap-2">
                  Proceed to Checkout
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                  </svg>
                </a>
                <a routerLink="/products" class="btn-ghost w-full justify-center">Continue Shopping</a>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
})
export class CartComponent {
  readonly cart = inject(CartService);
  readonly items = this.cart.items;
  readonly subtotal = this.cart.subtotal;
  readonly formatPrice = formatPrice;

  increment(item: CartItem): void {
    this.cart.updateQuantity(item.product.id, item.quantity + 1);
  }

  decrement(item: CartItem): void {
    this.cart.updateQuantity(item.product.id, item.quantity - 1);
  }

  remove(productId: string): void {
    this.cart.removeItem(productId);
  }
}
