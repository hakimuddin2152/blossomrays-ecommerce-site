import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import type { Product } from '../types';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectTotalItems,
  selectSubtotal,
} from '../store/cart';

/**
 * INTERVIEW: NgRx Facade Pattern
 *
 * CartService is now a thin facade over the NgRx Store.
 * All six consumers (NavbarComponent, CartDrawerComponent, CartComponent,
 * ProductCardComponent, ProductDetailComponent, CheckoutComponent) continue
 * to inject CartService — their code is unchanged.
 *
 * Why a facade?
 *   • Consumers don't need to know NgRx exists — no Store/selector imports scattered everywhere
 *   • Easy to swap state library in the future
 *   • Centralises dispatch logic — business rules stay here (e.g. max quantity cap)
 *
 * toSignal() bridges an NgRx selector (Observable) into an Angular Signal,
 * so templates using items() / totalItems() / subtotal() continue to work
 * without any changes.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly store = inject(Store);

  // ── Signals (same public API as before) ─────────────────────────────────
  readonly items = toSignal(this.store.select(selectCartItems), {
    initialValue: [],
  });

  readonly totalItems = toSignal(this.store.select(selectTotalItems), {
    initialValue: 0,
  });

  readonly subtotal = toSignal(this.store.select(selectSubtotal), {
    initialValue: 0,
  });

  // ── Dispatch wrappers ────────────────────────────────────────────────────

  addItem(product: Product, quantity = 1): void {
    this.store.dispatch(addToCart({ product, quantity }));
  }

  removeItem(productId: string): void {
    this.store.dispatch(removeFromCart({ productId }));
  }

  updateQuantity(productId: string, quantity: number): void {
    this.store.dispatch(updateQuantity({ productId, quantity }));
  }

  clearCart(): void {
    this.store.dispatch(clearCart());
  }
}

