import { createReducer, on } from '@ngrx/store';
import type { CartItem } from '../../types';
import * as CartActions from './cart.actions';

const STORAGE_KEY = 'blossomrays-cart';

export interface CartState {
  items: CartItem[];
}

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota errors
  }
}

const initialState: CartState = {
  items: loadFromStorage(),
};

export const cartReducer = createReducer(
  initialState,

  on(CartActions.loadCartFromStorage, (state) => ({
    ...state,
    items: loadFromStorage(),
  })),

  on(CartActions.addToCart, (state, { product, quantity = 1 }) => {
    const existing = state.items.find((i) => i.product.id === product.id);
    const items = existing
      ? state.items.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        )
      : [...state.items, { product, quantity }];
    saveToStorage(items);
    return { ...state, items };
  }),

  on(CartActions.removeFromCart, (state, { productId }) => {
    const items = state.items.filter((i) => i.product.id !== productId);
    saveToStorage(items);
    return { ...state, items };
  }),

  on(CartActions.updateQuantity, (state, { productId, quantity }) => {
    const items =
      quantity <= 0
        ? state.items.filter((i) => i.product.id !== productId)
        : state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i,
          );
    saveToStorage(items);
    return { ...state, items };
  }),

  on(CartActions.clearCart, (state) => {
    saveToStorage([]);
    return { ...state, items: [] };
  }),
);
