import { createFeatureSelector, createSelector } from '@ngrx/store';
import type { CartState } from './cart.reducer';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartState,
  (state) => state.items,
);

export const selectTotalItems = createSelector(selectCartItems, (items) =>
  items.reduce((sum, i) => sum + i.quantity, 0),
);

export const selectSubtotal = createSelector(selectCartItems, (items) =>
  items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
);

export const selectItemInCart = (productId: string) =>
  createSelector(selectCartItems, (items) =>
    items.find((i) => i.product.id === productId),
  );
