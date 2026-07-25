import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { FormatPricePipe } from '../../pipes/format-price.pipe';
import type { Product } from '../../types';

/**
 * INTERVIEW CONCEPTS demonstrated here:
 *
 * 1. OnPush change detection — Angular skips this component's check unless:
 *    - an @Input reference changes
 *    - an event originates inside it
 *    - an async pipe emits
 *    - markForCheck() is called manually
 *    Perfect for pure display components like this one.
 *
 * 2. @Output / EventEmitter — parent-child communication upward.
 *    The parent (ProductsComponent) listens via (cartAdded)="onCartAdded($event)"
 *    and shows a toast without the card needing to know about toasts.
 *
 * 3. FormatPricePipe — replaces the inline function call with a declarative
 *    pipe, enabling Angular's pipe memoisation in OnPush trees.
 */
@Component({
  selector: 'app-product-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CommonModule, FormatPricePipe],
  template: `
    <div class="group card rounded-lg overflow-hidden hover:shadow-soft-lg transition-all duration-300">
      <!-- Image -->
      <a [routerLink]="['/products', product.slug]" class="block aspect-[4/3] overflow-hidden bg-cream">
        <img
          [src]="product.images[0] || '/images/lavender/1.jpg'"
          [alt]="product.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </a>

      <!-- Info -->
      <div class="p-4 flex flex-col gap-1.5">
        <p class="font-body text-[10px] font-semibold tracking-widest uppercase text-gold">{{ product.category }}</p>
        <a [routerLink]="['/products', product.slug]">
          <h3 class="font-display text-base font-semibold text-plum leading-snug group-hover:text-gold transition-colors">
            {{ product.name }}
          </h3>
        </a>
        <p *ngIf="product.tagline" class="font-body text-[11px] text-muted leading-relaxed">{{ product.tagline }}</p>

        <!-- Price row — uses FormatPricePipe instead of a function call -->
        <div class="flex items-center gap-2 mt-1">
          <span class="font-body text-sm font-semibold text-plum">{{ product.price | formatPrice }}</span>
          <span *ngIf="product.compare_at_price" class="font-body text-xs text-muted line-through">
            {{ product.compare_at_price | formatPrice }}
          </span>
          <span
            *ngIf="product.compare_at_price"
            class="ml-auto text-[10px] font-body font-semibold tracking-wide text-rose-dark"
          >
            Save {{ discount() }}%
          </span>
        </div>

        <!-- Add to cart -->
        <button
          (click)="addToCart()"
          [disabled]="product.stock === 0"
          class="btn-primary w-full mt-2 py-2.5 text-[10px]"
        >
          {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
        </button>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  /** INTERVIEW: @Input with required flag — compile-time enforcement */
  @Input({ required: true }) product!: Product;

  /**
   * INTERVIEW: @Output + EventEmitter
   * Emits the added product upward so the parent decides what to do
   * (show toast, update analytics, etc.) — keeps this component focused.
   */
  @Output() cartAdded = new EventEmitter<Product>();

  private readonly cart = inject(CartService);

  discount(): number {
    if (!this.product.compare_at_price) return 0;
    return Math.round((1 - this.product.price / this.product.compare_at_price) * 100);
  }

  addToCart(): void {
    this.cart.addItem(this.product, 1);
    this.cartAdded.emit(this.product);
  }
}
