import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CartDrawerComponent } from '../cart/cart-drawer.component';

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
  imports: [RouterLink, CommonModule, FormsModule, CartDrawerComponent],
  template: `
    <div class="sticky top-0 z-50 bg-plum">

      <!-- Top bar: Logo + Search + Icons -->
      <div class="border-b border-plum/30">
        <div class="max-w-7xl mx-auto px-5 sm:px-6 flex items-center gap-5 h-20">

          <!-- Logo -->
          <a routerLink="/" class="flex-shrink-0">
            <img
              src="/images/logo.png"
              alt="BlossomRays"
              width="180"
              height="148"
              class="h-24 w-auto object-contain"
            />
          </a>

          <!-- Search bar -->
          <div class="hidden md:flex flex-1 max-w-xl">
            <div class="flex w-full border border-cream-dark">
              <select
                class="border-r border-plum/30 px-3 text-[10px] tracking-[0.14em] uppercase text-white/70 bg-plum/80 outline-none h-10 cursor-pointer"
                [(ngModel)]="selectedCategory"
                (change)="onCategoryChange()"
                aria-label="Category"
              >
                <option *ngFor="let c of categories" [value]="c.value">{{ c.label }}</option>
              </select>
              <input
                type="search"
                [(ngModel)]="searchQuery"
                (keydown.enter)="onSearch()"
                placeholder="Search products..."
                class="flex-1 px-4 py-2.5 text-[12px] font-body text-white placeholder:text-white/40 bg-plum/80 outline-none"
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
          </div>

          <!-- Icons: account + cart -->
          <div class="ml-auto flex items-center gap-1">
            <a
              routerLink="/account"
              class="p-2.5 text-white/70 hover:text-white transition-colors"
              aria-label="Account"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </a>

            <button
              (click)="cartOpen.set(true)"
              class="relative p-2.5 text-white/70 hover:text-white transition-colors"
              aria-label="Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              <span
                *ngIf="cartCount() > 0"
                class="absolute top-1.5 right-1.5 min-w-[16px] h-4 flex items-center justify-center text-[9px] font-bold text-plum bg-gold rounded-full px-1"
              >{{ cartCount() }}</span>
            </button>

            <!-- Mobile menu toggle -->
            <button
              (click)="mobileOpen.set(!mobileOpen())"
              class="md:hidden p-2.5 text-white/70 hover:text-white"
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
      <nav class="hidden md:block border-b border-plum/30 bg-plum/90">
        <div class="max-w-7xl mx-auto px-5 sm:px-6 flex items-center gap-1 h-11">
          <a
            routerLink="/products"
            class="px-4 h-full flex items-center font-body text-[11px] font-medium tracking-[0.1em] uppercase text-white/70 hover:text-white transition-colors"
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
              class="px-4 h-full flex items-center font-body text-[11px] font-medium tracking-[0.1em] uppercase text-white/70 hover:text-white transition-colors"
            >
              {{ group.label }}
              <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-3 w-3 opacity-50" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </a>
            <!-- Dropdown -->
            <div class="absolute left-0 top-full z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 bg-plum border border-plum/30 shadow-lg min-w-[160px] py-2">
              <a
                *ngFor="let item of group.items"
                [routerLink]="item.href"
                class="block px-5 py-2 font-body text-[12px] text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                {{ item.label }}
              </a>
            </div>
          </div>
          <a
            *ngIf="isAdmin()"
            routerLink="/admin"
            class="ml-auto px-4 h-full flex items-center font-body text-[11px] font-medium tracking-[0.1em] uppercase text-white/70 hover:text-white transition-colors"
          >
            Admin
          </a>
        </div>
      </nav>

      <!-- Mobile menu -->
      <div
        *ngIf="mobileOpen()"
        class="md:hidden border-b border-plum/30 bg-plum px-5 py-4 space-y-3"
      >
        <div class="flex border border-plum/30 mb-3">
          <input
            type="search"
            [(ngModel)]="searchQuery"
            (keydown.enter)="onSearch(); mobileOpen.set(false)"
            placeholder="Search..."
            class="flex-1 px-4 py-2.5 text-[12px] font-body text-white placeholder:text-white/40 bg-plum/80 outline-none"
          />
        </div>
        <a routerLink="/products" (click)="mobileOpen.set(false)" class="block font-body text-sm uppercase tracking-widest text-white/80 hover:text-white py-1">All Products</a>
        <a *ngFor="let group of categoryGroups" [routerLink]="['/products']" [queryParams]="{ category: group.label.toLowerCase().replace(' ', '-') }" (click)="mobileOpen.set(false)" class="block font-body text-sm uppercase tracking-widest text-white/80 hover:text-white py-1">{{ group.label }}</a>
        <hr class="border-white/20" />
        <a routerLink="/account" (click)="mobileOpen.set(false)" class="block font-body text-sm uppercase tracking-widest text-white/80 hover:text-white py-1">Account</a>
        <a *ngIf="isAdmin()" routerLink="/admin" (click)="mobileOpen.set(false)" class="block font-body text-sm uppercase tracking-widest text-white/80 hover:text-white py-1">Admin</a>
      </div>
    </div>

    <app-cart-drawer [open]="cartOpen()" (closeEvent)="cartOpen.set(false)" />
  `,
})
export class NavbarComponent {
  protected readonly cart = inject(CartService);
  protected readonly auth = inject(AuthService);
  protected readonly router = inject(Router);

  readonly categoryGroups = categoryGroups;
  readonly categories = allCategories;
  readonly cartOpen = signal(false);
  readonly mobileOpen = signal(false);
  readonly cartCount = this.cart.totalItems;

  selectedCategory = '';
  searchQuery = '';

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  onCategoryChange(): void {
    this.router.navigate(['/products'], {
      queryParams: this.selectedCategory ? { category: this.selectedCategory } : {},
    });
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) return;
    this.router.navigate(['/products'], {
      queryParams: { q: this.searchQuery.trim() },
    });
    this.searchQuery = '';
  }
}
