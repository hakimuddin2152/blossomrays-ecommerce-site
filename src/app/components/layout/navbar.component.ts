import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Observable, of, from } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, startWith } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { CartDrawerComponent } from '../cart/cart-drawer.component';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { APP_CONFIG } from '../../tokens/app-config.token';
import type { Product } from '../../types';

const categoryGroups = [
  {
    label: 'Car Fresheners',
    href: '/products?category=car-fresheners',
    items: [
      { href: '/products/lavender-car-air-freshener', label: 'Lavender' },
      { href: '/products/rose-car-air-freshener', label: 'Rose' },
      { href: '/products/millennium-car-air-freshener', label: 'Millennium' },
    ],
  },
  {
    label: 'Fragrances',
    href: '/products?category=fragrances',
    items: [
      { href: '/products?category=perfume', label: 'Perfumes' },
      { href: '/products?category=fragrance-oil', label: 'Fragrance Oil' },
      { href: '/products?category=essential-oil', label: 'Essential Oil' },
    ],
  },
  {
    label: 'Home & Lifestyle',
    href: '/products?category=home',
    items: [
      { href: '/products?category=diffuser', label: 'Diffusers' },
      { href: '/products?category=candle', label: 'Candles' },
    ],
  },
  {
    label: 'Accessories',
    href: '/products?category=ladies-bag',
    items: [
      { href: '/products?category=ladies-bag', label: 'Ladies Bags' },
    ],
  },
];

const allCategories = [
  { value: '', label: 'All Categories' },
  { value: 'rose', label: 'Rose' },
  { value: 'lavender', label: 'Lavender' },
  { value: 'millennium', label: 'Millennium' },
  { value: 'perfume', label: 'Perfumes' },
  { value: 'fragrance-oil', label: 'Fragrance Oil' },
  { value: 'essential-oil', label: 'Essential Oil' },
  { value: 'diffuser', label: 'Diffusers' },
  { value: 'candle', label: 'Candles' },
  { value: 'ladies-bag', label: 'Ladies Bags' },
];

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, CartDrawerComponent, AsyncPipe, ClickOutsideDirective],
  template: `
    <div class="sticky top-0 z-50 bg-white">

      <!-- Top bar: Logo + Search + Icons -->
      <div class="border-b border-cream-dark">
        <div class="max-w-7xl mx-auto px-5 sm:px-6 flex items-center gap-5 h-20">

          <!-- Logo -->
          <a routerLink="/" class="flex-shrink-0">
            <img
              src="/images/logo.png"
              alt="BlossomRays"
              width="180"
              height="148"
              class="h-20 w-auto object-contain"
            />
          </a>

          <!-- Search bar with RxJS-powered live suggestions -->
          <div class="hidden md:flex flex-1 max-w-xl relative" appClickOutside (clickedOutside)="showSuggestions.set(false)">
            <div class="flex w-full border border-cream-dark">
              <select
                class="border-r border-cream-dark px-3 text-[10px] tracking-[0.14em] uppercase text-muted bg-cream-light outline-none h-10 cursor-pointer"
                [(ngModel)]="selectedCategory"
                (change)="onCategoryChange()"
                aria-label="Category"
              >
                <option *ngFor="let c of categories" [value]="c.value">{{ c.label }}</option>
              </select>
              <input
                type="search"
                [(ngModel)]="searchQuery"
                (input)="onSearchInput($event)"
                (focus)="showSuggestions.set(true)"
                (keydown.enter)="onSearch()"
                placeholder="Search products..."
                class="flex-1 px-4 py-2.5 text-[12px] font-body text-plum placeholder:text-stone bg-white outline-none"
              />
              <button
                (click)="onSearch()"
                class="px-4 bg-gold text-white hover:bg-gold/80 transition-colors"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </div>

            <!--
              INTERVIEW: async pipe
              searchSuggestions$ is an Observable<Product[]> built with RxJS operators.
              The async pipe:
                • Subscribes when the component renders
                • Automatically unsubscribes when the component is destroyed (no memory leak)
                • Triggers change detection when a new value arrives
                • Works with both Observables and Promises
              @let (Angular 17) assigns the unwrapped value to a template-local variable.
            -->
            @let suggestions = searchSuggestions$ | async;
            @if (showSuggestions() && suggestions && suggestions.length > 0) {
              <div class="absolute left-0 right-0 top-full z-50 bg-white border border-cream-dark shadow-soft mt-0.5">
                <a
                  *ngFor="let p of suggestions"
                  [routerLink]="['/products', p.slug]"
                  (click)="showSuggestions.set(false); searchQuery = ''"
                  class="flex items-center gap-3 px-4 py-2.5 hover:bg-cream-light transition-colors cursor-pointer"
                >
                  <img [src]="p.images[0]" [alt]="p.name" class="w-8 h-8 object-cover bg-cream flex-shrink-0" />
                  <div>
                    <p class="font-body text-[12px] text-plum font-medium">{{ p.name }}</p>
                    <p class="font-body text-[10px] text-muted uppercase tracking-wide">{{ p.category }}</p>
                  </div>
                </a>
              </div>
            }
          </div>

          <!-- Icons: account + cart -->
          <div class="ml-auto flex items-center gap-1">
            <a
              routerLink="/account"
              class="p-2.5 text-muted hover:text-plum transition-colors"
              aria-label="Account"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </a>

            <button
              (click)="cartOpen.set(true)"
              class="relative p-2.5 text-muted hover:text-plum transition-colors"
              aria-label="Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              <span
                *ngIf="cartCount() > 0"
                class="absolute top-1.5 right-1.5 min-w-[16px] h-4 flex items-center justify-center text-[9px] font-bold text-white bg-gold rounded-full px-1"
              >{{ cartCount() }}</span>
            </button>

            <!-- Mobile menu toggle -->
            <button
              (click)="mobileOpen.set(!mobileOpen())"
              class="md:hidden p-2.5 text-muted hover:text-plum"
              aria-label="Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop category navigation -->
      <nav class="hidden md:block border-b border-cream-dark bg-white">
        <div class="max-w-7xl mx-auto px-5 sm:px-6 flex items-center gap-1 h-10">
          <a
            routerLink="/products"
            class="px-4 h-full flex items-center font-body text-[11px] font-medium tracking-[0.12em] uppercase text-muted hover:text-plum transition-colors"
          >
            All
          </a>
          <div
            *ngFor="let group of categoryGroups"
            class="relative group h-full flex items-center"
          >
            <a
              [routerLink]="['/products']"
              [queryParams]="{ category: group.label.toLowerCase().replace(' ', '-') }"
              class="px-4 h-full flex items-center font-body text-[11px] font-medium tracking-[0.12em] uppercase text-muted hover:text-plum transition-colors"
            >
              {{ group.label }}
              <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-3 w-3 opacity-40" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </a>
            <!-- Dropdown -->
            <div class="absolute left-0 top-full z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white border border-cream-dark shadow-soft min-w-[160px] py-2">
              <a
                *ngFor="let item of group.items"
                [routerLink]="item.href"
                class="block px-5 py-2.5 font-body text-[12px] text-muted hover:text-plum hover:bg-cream-light transition-colors"
              >
                {{ item.label }}
              </a>
            </div>
          </div>
          <a
            *ngIf="isAdmin()"
            routerLink="/admin"
            class="ml-auto px-4 h-full flex items-center font-body text-[11px] font-medium tracking-[0.12em] uppercase text-muted hover:text-plum transition-colors"
          >
            Admin
          </a>
        </div>
      </nav>

      <!-- Mobile menu — ClickOutsideDirective closes it when user taps elsewhere -->
      <div
        *ngIf="mobileOpen()"
        appClickOutside
        (clickedOutside)="mobileOpen.set(false)"
        class="md:hidden border-b border-cream-dark bg-white px-5 py-4 space-y-3"
      >
        <div class="flex border border-cream-dark mb-3">
          <input
            type="search"
            [(ngModel)]="searchQuery"
            (keydown.enter)="onSearch(); mobileOpen.set(false)"
            placeholder="Search..."
            class="flex-1 px-4 py-2.5 text-[12px] font-body text-plum placeholder:text-stone bg-white outline-none"
          />
        </div>
        <a routerLink="/products" (click)="mobileOpen.set(false)" class="block font-body text-[11px] uppercase tracking-[0.14em] text-muted hover:text-plum py-1.5">All Products</a>
        <a *ngFor="let group of categoryGroups" [routerLink]="['/products']" [queryParams]="{ category: group.label.toLowerCase().replace(' ', '-') }" (click)="mobileOpen.set(false)" class="block font-body text-[11px] uppercase tracking-[0.14em] text-muted hover:text-plum py-1.5">{{ group.label }}</a>
        <hr class="border-cream-dark" />
        <a routerLink="/account" (click)="mobileOpen.set(false)" class="block font-body text-[11px] uppercase tracking-[0.14em] text-muted hover:text-plum py-1.5">Account</a>
        <a *ngIf="isAdmin()" routerLink="/admin" (click)="mobileOpen.set(false)" class="block font-body text-[11px] uppercase tracking-[0.14em] text-muted hover:text-plum py-1.5">Admin</a>
      </div>
    </div>

    <app-cart-drawer [open]="cartOpen()" (closeEvent)="cartOpen.set(false)" />
  `,
})
export class NavbarComponent {
  protected readonly cart = inject(CartService);
  protected readonly auth = inject(AuthService);
  protected readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly config = inject(APP_CONFIG);

  readonly categoryGroups = categoryGroups;
  readonly categories = allCategories;
  readonly cartOpen = signal(false);
  readonly mobileOpen = signal(false);
  readonly showSuggestions = signal(false);
  readonly cartCount = this.cart.totalItems;

  selectedCategory = '';
  searchQuery = '';

  /**
   * INTERVIEW: Subject as event bus
   *
   * Subject is both an Observable (you can subscribe to it) and an Observer
   * (you can call .next() to push values).  Here it acts as a bridge between
   * the imperative world (user typing → DOM event) and the reactive world
   * (RxJS pipeline → Observable<Product[]>).
   *
   * We never subscribe to search$ directly — instead we derive
   * searchSuggestions$ from it using pipe operators.
   */
  private readonly search$ = new Subject<string>();

  /**
   * INTERVIEW: RxJS operator chain
   *
   * This Observable is wired to the search input via the Subject above.
   * Each operator in the pipe does one thing:
   *
   *   startWith('')         — emit an initial empty value so the Observable
   *                           is "warm" before the user types anything.
   *
   *   debounceTime(300)     — wait 300 ms after the LAST emission before
   *                           passing it downstream.  Prevents a network call
   *                           on every keypress.
   *
   *   distinctUntilChanged()— discard emissions where the value didn't change
   *                           (e.g. user types 'a', deletes, types 'a' again).
   *
   *   switchMap(query => …) — cancels any pending inner Observable when a new
   *                           query arrives.  This prevents stale results from
   *                           an older (slower) request arriving after a newer
   *                           (faster) one.  from() converts the Promise
   *                           returned by getProducts() into an Observable.
   *
   * takeUntilDestroyed() — automatically unsubscribes when the component
   *   is destroyed.  The async pipe (used in the template) also manages
   *   subscriptions, so this is just extra safety for the Subject pipeline.
   */
  readonly searchSuggestions$: Observable<Product[]> = this.search$.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((query) => {
      if (query.trim().length < 2) return of([]);
      // from() wraps a Promise → Observable
      return from(this.productService.getProducts()).pipe(
        map((products) =>
          products
            .filter((p) =>
              p.name.toLowerCase().includes(query.toLowerCase()) ||
              p.category.toLowerCase().includes(query.toLowerCase()),
            )
            .slice(0, this.config.maxSearchSuggestions),
        ),
      );
    }),
  );

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  /** Called on every keystroke — pushes value into the RxJS Subject. */
  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value ?? '';
    this.searchQuery = value;
    this.search$.next(value);
    this.showSuggestions.set(true);
  }

  onCategoryChange(): void {
    this.router.navigate(['/products'], {
      queryParams: this.selectedCategory ? { category: this.selectedCategory } : {},
    });
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) return;
    this.showSuggestions.set(false);
    this.router.navigate(['/products'], {
      queryParams: { q: this.searchQuery.trim() },
    });
    this.searchQuery = '';
    this.search$.next('');
  }
}
