import { Component, Input, Output, EventEmitter, inject, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { formatPrice } from '../../utils/format-price';
import type { CartItem } from '../../types';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <ng-container *ngIf="open">
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-50 bg-plum/30 backdrop-blur-sm transition-opacity"
        (click)="closeEvent.emit()"
        aria-hidden="true"
      ></div>

      <!-- Drawer -->
      <aside
        class="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-soft-xl flex flex-col"
        role="dialog"
        aria-label="Shopping cart"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-cream-dark">
          <h2 class="font-display text-2xl font-semibold text-plum">Your Cart</h2>
          <button
            (click)="closeEvent.emit()"
            class="p-2 rounded-full text-muted hover:text-plum hover:bg-cream-dark transition-colors"
            aria-label="Close cart"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Items -->
        <div class="flex-1 overflow-y-auto px-6 py-2 scrollbar-thin">
          <ng-container *ngIf="items().length === 0; else itemList">
            <div class="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <span class="text-6xl">🛒</span>
              <p class="font-body text-muted">Your cart is empty</p>
              <a
                routerLink="/products"
                (click)="closeEvent.emit()"
                class="btn-outline text-xs px-6 py-2.5"
              >Start Shopping</a>
            </div>
          </ng-container>
          <ng-template #itemList>
            <div *ngFor="let item of items()" class="flex gap-4 py-4 border-b border-cream-dark last:border-0">
              <img
                [src]="item.product.images[0] || '/images/lavender/1.jpg'"
                [alt]="item.product.name"
                class="w-20 h-20 object-cover flex-shrink-0 bg-cream"
              />
              <div class="flex-1 min-w-0">
                <h4 class="font-display text-base font-medium text-plum leading-tight truncate">{{ item.product.name }}</h4>
                <p class="font-body text-xs text-muted mt-0.5">{{ formatPrice(item.product.price) }} each</p>
                <div class="flex items-center gap-2 mt-2">
                  <button
                    (click)="decrement(item)"
                    class="w-7 h-7 border border-cream-dark flex items-center justify-center text-plum hover:bg-cream transition-colors"
                    aria-label="Decrease quantity"
                  >−</button>
                  <span class="font-body text-sm text-plum w-6 text-center">{{ item.quantity }}</span>
                  <button
                    (click)="increment(item)"
                    class="w-7 h-7 border border-cream-dark flex items-center justify-center text-plum hover:bg-cream transition-colors"
                    aria-label="Increase quantity"
                  >+</button>
                  <button
                    (click)="remove(item.product.id)"
                    class="ml-auto text-muted hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="text-right flex-shrink-0">
                <span class="font-body text-sm font-semibold text-plum">
                  {{ formatPrice(item.product.price * item.quantity) }}
                </span>
              </div>
            </div>
          </ng-template>
        </div>

        <!-- Footer -->
        <div *ngIf="items().length > 0" class="px-6 py-5 border-t border-cream-dark space-y-4 bg-cream">
          <div class="flex justify-between font-body text-sm">
            <span class="text-muted">Subtotal</span>
            <span class="font-semibold text-plum">{{ formatPrice(subtotal()) }}</span>
          </div>
          <p class="font-body text-[11px] text-muted/70">Shipping calculated at checkout</p>
          <a
            routerLink="/checkout"
            (click)="closeEvent.emit()"
            class="btn-primary w-full flex items-center justify-center gap-2"
          >
            Proceed to Checkout
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
            </svg>
          </a>
        </div>
      </aside>
    </ng-container>
  `,
})
export class CartDrawerComponent {
  @Input() open = false;
  @Output() closeEvent = new EventEmitter<void>();

  private readonly cart = inject(CartService);
  readonly items = this.cart.items;
  readonly subtotal = this.cart.subtotal;
  readonly formatPrice = formatPrice;

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) this.closeEvent.emit();
  }

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
