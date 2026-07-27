import { InjectionToken } from '@angular/core';

/**
 * INTERVIEW CONCEPT: InjectionToken
 *
 * InjectionToken creates a typed, tree-shakeable DI token for non-class
 * values (objects, primitives, configs).  Unlike class-based tokens, there's
 * no risk of name collisions and the value is strongly typed.
 *
 * Pattern:
 *
 *   // 1. Declare a token with a factory default
 *   export const MY_TOKEN = new InjectionToken<Type>('description', {
 *     factory: () => defaultValue,
 *   });
 *
 *   // 2. Inject it anywhere
 *   const config = inject(MY_TOKEN);
 *
 *   // 3. Override per-component or per-module (rare):
 *   @Component({ providers: [{ provide: APP_CONFIG, useValue: { ... } }] })
 *
 * The factory in the token itself means you don't need to add anything to
 * app.config.ts — the default is used unless explicitly overridden.
 *
 * Use cases:
 *   • App-wide config (API URLs, thresholds, feature flags)
 *   • Environment-specific values without environment.ts coupling
 *   • Providing mock values in tests without modifying real services
 */

export interface AppConfig {
  storeName: string;
  currency: string;
  /** Cents — orders at or above this amount get free shipping. */
  freeShippingThreshold: number;
  /** Cents — fixed shipping cost when below threshold. */
  shippingCost: number;
  /** Max search suggestions shown in the navbar dropdown. */
  maxSearchSuggestions: number;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  // factory() provides the default value — no need to add to providers array
  factory: () => ({
    storeName: 'BlossomRays',
    currency: 'CAD',
    freeShippingThreshold: 3000,  // $30.00 — matches stripe-checkout.ts
    shippingCost: 499,             // $4.99
    maxSearchSuggestions: 5,
  }),
});
