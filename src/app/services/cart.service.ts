import { Injectable, signal, computed, effect } from '@angular/core';
import type { CartItem, Product } from '../types';

const STORAGE_KEY = 'blossomrays-cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>(this._load());

  readonly totalItems = computed(() =>
    this.items().reduce((sum, i) => sum + i.quantity, 0),
  );

  readonly subtotal = computed(() =>
    this.items().reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  );

  constructor() {
    // Persist to localStorage whenever items change
    effect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
      } catch {
        // ignore quota errors
      }
    });
  }

  addItem(product: Product, quantity = 1): void {
    this.items.update((current) => {
      const existing = current.find((i) => i.product.id === product.id);
      if (existing) {
        return current.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...current, { product, quantity }];
    });
  }

  removeItem(productId: string): void {
    this.items.update((current) =>
      current.filter((i) => i.product.id !== productId),
    );
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    this.items.update((current) =>
      current.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i,
      ),
    );
  }

  clearCart(): void {
    this.items.set([]);
  }

  private _load(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }
}
