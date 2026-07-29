import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Session already resolved (normal navigation) — answer immediately
  if (!auth.loading()) {
    return auth.user() ? true : router.createUrlTree(['/login']);
  }

  // First load or OAuth callback — wait for getSession() to finish
  return toObservable(auth.loading).pipe(
    filter((loading) => !loading),
    take(1),
    map(() => (auth.user() ? true : router.createUrlTree(['/login']))),
  );
};
