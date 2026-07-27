import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
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
  ],
};
