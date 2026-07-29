import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withRouterConfig, withInMemoryScrolling } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { cartReducer } from './store/cart';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),
    provideAnimations(),

    /**
     * INTERVIEW: provideHttpClient + withInterceptors
     *
     * provideHttpClient() registers Angular's HttpClient in the DI tree.
     * Any component or service can then inject HttpClient to make typed
     * HTTP requests that return Observables.
     *
     * withInterceptors([...]) registers functional interceptors in order.
     * authInterceptor attaches the Supabase JWT to every outgoing request,
     * so Netlify functions (and any other API) receive the auth header
     * automatically — no manual header management per-call.
     */
    provideHttpClient(withInterceptors([authInterceptor])),

    /**
     * INTERVIEW: NgRx Store
     *
     * provideStore({ cart: cartReducer }) registers the global Redux store.
     * The key 'cart' maps to state.cart — accessed via createFeatureSelector.
     *
     * provideEffects() wires NgRx Effects (async side-effect handlers).
     * No effects are needed for cart (sync/localStorage), but the provider
     * must be present so effect classes can be registered later.
     *
     * provideStoreDevtools() enables Redux DevTools browser extension —
     * time-travel debugging, action log, state diff. logOnly in production.
     */
    provideStore({ cart: cartReducer }),
    provideEffects(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
    }),
  ],
};
