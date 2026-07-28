import { createAction, props } from '@ngrx/store';
import type { Product } from '../../types';

// ── Cart Item Actions ──────────────────────────────────────────────────────

export const addToCart = createAction(
  '[Cart] Add Item',
  props<{ product: Product; quantity?: number }>(),
);

export const removeFromCart = createAction(
  '[Cart] Remove Item',
  props<{ productId: string }>(),
);

export const updateQuantity = createAction(
  '[Cart] Update Quantity',
  props<{ productId: string; quantity: number }>(),
);

export const clearCart = createAction('[Cart] Clear');

// ── Persistence Actions (localStorage) ────────────────────────────────────

export const loadCartFromStorage = createAction('[Cart] Load From Storage');
