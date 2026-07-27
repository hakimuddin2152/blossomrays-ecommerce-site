import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';

/**
 * INTERVIEW CONCEPT: Functional HTTP Interceptor
 *
 * Interceptors sit in the HttpClient pipeline and can inspect/transform
 * every request and response.  Common uses:
 *   • Attach auth tokens (this file)
 *   • Global error handling / toast on 500
 *   • Request logging
 *   • Retry on network failure
 *   • Adding correlation IDs
 *
 * Angular 15+ supports FUNCTIONAL interceptors (HttpInterceptorFn) — a
 * plain function, no class/interface boilerplate.
 *
 * Registration (app.config.ts):
 *   provideHttpClient(withInterceptors([authInterceptor]))
 *
 * Multiple interceptors are applied in declaration order (like middleware).
 *
 * Signature:
 *   (req: HttpRequest, next: HttpHandlerFn) => Observable<HttpEvent<unknown>>
 *
 * IMPORTANT — HttpRequest is IMMUTABLE.  To modify it you must call
 *   req.clone({ ... }) and pass the clone to next().
 *
 * This interceptor:
 *   1. Reads the Supabase session (async via Promise → from())
 *   2. If a JWT exists, attaches Authorization: Bearer <token> header
 *   3. Passes the (possibly cloned) request to the next handler
 *
 * The token is only attached to calls made via Angular's HttpClient —
 * the Supabase SDK manages its own auth headers internally.
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const supabase = inject(SupabaseService);

  // Convert the Promise → Observable so we can use pipe/switchMap
  return from(supabase.client.auth.getSession()).pipe(
    switchMap(({ data }) => {
      const token = data.session?.access_token;

      if (!token) {
        // No session — pass request through unchanged
        return next(req);
      }

      // Clone the request (immutable) and add the Authorization header
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next(authReq);
    }),
  );
};
