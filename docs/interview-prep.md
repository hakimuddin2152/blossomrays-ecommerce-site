# BlossomRays — Senior Technical Architect Interview Prep
> Written as first-person narrative from the architect who built this. Study this end-to-end before your interview.

---

## What I Built & Why

BlossomRays is a **production e-commerce storefront** built with **Angular 22 (standalone architecture)**, Supabase (Postgres + Auth), Stripe Checkout, and deployed to Netlify with serverless functions handling payment and order logic. I deliberately chose the newest Angular paradigms — no NgModules, signals for state, functional APIs everywhere — because I wanted the codebase to reflect where the framework is heading, not where it's been.

---

## Architecture Decisions I'll Be Asked About

### 1. Standalone Components — No NgModules
> *"Why didn't you use NgModules?"*

NgModules are Angular's legacy grouping mechanism. Since Angular 15 (stabilised in 17), every component, directive, and pipe can be `standalone: true` — it declares its own imports and doesn't belong to a module. I used this across the entire app because it:
- Eliminates the module indirection layer (less boilerplate, easier to trace)
- Makes components truly portable — drop one file into any project
- Aligns with Angular's official future direction

The app bootstrap entry point is `ApplicationConfig` (in `app.config.ts`) with `provideRouter`, `provideHttpClient`, `provideAnimations` — all function-based, no class decorators on the app shell.

---

### 2. Angular Signals for State Management
> *"Why signals instead of RxJS everywhere / NgRx?"*

Signals are Angular's reactive primitive, introduced in v16. I used them as the primary state mechanism:

```typescript
// CartService — signal-based, zero RxJS
readonly items     = signal<CartItem[]>(this._load());       // writable state
readonly totalItems = computed(() => items().reduce(...));   // derived state (memoized)

effect(() => {                                               // side-effect
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items()));
});
```

**signal()** — creates mutable reactive state. Read it by calling it: `items()`.  
**computed()** — derives new state; re-evaluates only when dependencies change (memoized).  
**effect()** — runs a side-effect when any signal it reads changes (like `useEffect` but auto-tracked).

I kept RxJS only where it's genuinely the right tool: the HTTP interceptor uses `switchMap` to convert a Promise to an Observable because `HttpInterceptorFn` must return an Observable.

---

### 3. Dependency Injection — Modern `inject()` Function
> *"How does DI work in your codebase?"*

Instead of constructor injection, I used the `inject()` function throughout:

```typescript
private readonly cart = inject(CartService);   // inside class body
const auth = inject(AuthService);              // inside guard/interceptor function
```

This works anywhere inside an "injection context" (constructor, field initialiser, factory). It's cleaner in standalone components and mandatory in functional guards/interceptors (which are plain functions, not classes).

For non-class values I used `InjectionToken` (see `tokens/app-config.token.ts`) — it provides typed, tree-shakeable DI tokens for config objects without risk of name collisions.

---

### 4. Lazy Loading with `loadComponent`
> *"How did you handle code splitting?"*

Every route is independently lazy-loaded:

```typescript
{
  path: 'products',
  loadComponent: () => import('./pages/products/products.component')
    .then(m => m.ProductsComponent),
}
```

The browser only downloads a route's bundle when the user navigates there. This keeps initial load fast. Because components are standalone, no parent NgModule needs to be loaded first — each chunk is entirely self-contained.

---

### 5. Route Guards — Functional Style
> *"How did you protect the admin and account routes?"*

Guards are plain functions returning `true`, `false`, or a `UrlTree` (a redirect):

```typescript
export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.user()) return true;
  return router.createUrlTree(['/login']);  // redirect, not navigation
};
```

`adminGuard` additionally checks `auth.isAdmin()`, which reads the `role` field from the Supabase `profiles` table. Both guards are stacked on admin routes: `canActivate: [authGuard, adminGuard]` — Angular runs them in order; the first falsy result short-circuits.

---

### 6. HTTP Interceptor — Functional, JWT Attachment
> *"How does authentication flow to your backend?"*

The Netlify serverless functions validate a Supabase JWT. The interceptor attaches it automatically to every `HttpClient` call:

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const supabase = inject(SupabaseService);
  return from(supabase.client.auth.getSession()).pipe(
    switchMap(({ data }) => {
      const token = data.session?.access_token;
      if (!token) return next(req);
      return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
    })
  );
};
```

Key fact: `HttpRequest` is **immutable** — you must call `req.clone()` to attach headers. The interceptor is registered via `provideHttpClient(withInterceptors([authInterceptor]))`.

---

### 7. Forms — Both Strategies, For a Reason
> *"When do you use template-driven vs reactive forms?"*

- **Template-driven** (`ngModel`) — used for simple single-field inputs (search bar, newsletter). Low ceremony, Angular manages the model.
- **Reactive** (`FormBuilder`, `Validators`) — used for login, register, checkout. Code owns the form model, enabling:
  - **Custom sync validator** — `passwordMatchValidator` runs at FormGroup level to compare two controls
  - **Async validator** — could check email uniqueness against the DB while typing
  - Programmatic control (enable/disable fields, patch values)

---

### 8. `DestroyRef` + `takeUntilDestroyed` — Memory Leak Prevention
> *"How do you prevent Observable memory leaks?"*

Old pattern: `Subject` + `takeUntil` + manual `ngOnDestroy`. Modern pattern:

```typescript
// In constructor (injection context — no args needed):
this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(...)

// In ngOnInit (outside injection context — inject DestroyRef explicitly):
private readonly destroyRef = inject(DestroyRef);
this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(...)
```

The subscription auto-completes when the component is destroyed. Used in `products.component.ts` and `product-detail.component.ts` to clean up query param subscriptions.

---

### 9. Angular Animations
> *"Where did you use Angular's animation engine?"*

In `products.component.ts`, product cards stagger in when the list changes:

```typescript
trigger('listAnimation', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(16px)' }),
      stagger(40, [animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))]),
    ], { optional: true }),
  ]),
])
```

`query(':enter')` selects newly added DOM elements. `stagger(40ms)` offsets each card's animation by 40ms, creating a cascade. The trigger is applied in the template as `[@listAnimation]="products().length"` — any value change fires the transition.

---

### 10. Backend — Netlify Serverless Functions
> *"Why serverless functions instead of a separate API?"*

Three Netlify functions in `netlify/functions/`:
- **`stripe-checkout.ts`** — creates a Stripe Checkout session; keeps the secret key server-side
- **`stripe-webhook.ts`** — receives Stripe events (payment succeeded → write order to Supabase)
- **`orders.ts`** — authenticated order read/update

Stripe's secret key never reaches the browser. Webhook events are verified with `stripe.webhooks.constructEvent()` using the webhook signing secret.

---

## The Angular Mental Model (for the Interview)

| Concept | One-liner |
|---|---|
| `@Component` | Blueprint for a UI block — has template, styles, logic |
| `signal()` | Reactive variable; calling it reads it, `.set()` / `.update()` writes it |
| `computed()` | Auto-derived signal; re-runs only when its signal dependencies change |
| `effect()` | Side-effect that re-runs when its signals change (like a reactive watcher) |
| `inject()` | Ask Angular's DI system for a service — works anywhere in injection context |
| `loadComponent` | Lazy-load a route's component on first navigation to that path |
| `canActivate` | Gate a route behind a function — return true/false/UrlTree |
| `HttpInterceptorFn` | Middleware for every HttpClient request/response |
| `FormBuilder` | Factory to build typed reactive forms with validators |
| `standalone: true` | Component manages its own imports; no NgModule needed |
| `takeUntilDestroyed` | Auto-unsubscribe Observable when component destroys |
| `provideX()` | Register framework features in DI tree (router, http, animations) |

---

## Likely Interview Questions & Concise Answers

**Q: What is the difference between `signal`, `computed`, and `effect`?**
> Signal = mutable reactive state. Computed = read-only derived state (memoized). Effect = side-effect triggered by signal changes. Together they replace NgRx/BehaviorSubject for most local state.

**Q: Why is `HttpRequest` immutable and how do you modify headers?**
> Immutability allows Angular to safely pass the same request through multiple interceptors without one clobbering another's changes. You call `req.clone({ setHeaders: {...} })` to produce a modified copy.

**Q: What is the difference between `canActivate` returning `false` vs a `UrlTree`?**
> `false` blocks navigation and leaves the URL unchanged (user stays on current page). A `UrlTree` (from `router.createUrlTree(...)`) blocks navigation AND redirects to a new route — much better for auth flows.

**Q: What is `DestroyRef` and when do you use it over `ngOnDestroy`?**
> `DestroyRef` is Angular's lifecycle hook as an injectable object. You use it when you need to tear-down logic inside a service, factory, or a function that isn't a class (can't implement `ngOnDestroy`). `takeUntilDestroyed(destroyRef)` is the idiomatic RxJS cleanup pattern in Angular 16+.

**Q: Why use `loadComponent` instead of `loadChildren`?**
> `loadChildren` lazy-loads a route *module* (the old NgModule approach). `loadComponent` lazy-loads a single standalone component directly — simpler, no wrapper module needed. Both create separate JS bundles.

**Q: How does Stripe payment work in the app?**
> The Angular app calls `POST /api/stripe/checkout` via `HttpClient`. The Netlify function creates a Stripe Checkout session (secret key stays on server) and returns a session URL. Angular redirects to that URL. After payment, Stripe hits the webhook function, which writes the order to Supabase. Angular polls `/api/orders/:id` on the confirmation page to display the result.
