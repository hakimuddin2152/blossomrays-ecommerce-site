import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <footer class="bg-[#1A1A1A] text-white/60">

      <!-- Main grid -->
      <div class="max-w-7xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/10">

        <!-- Brand + newsletter -->
        <div class="space-y-5">
          <img src="/images/logo.png" alt="BlossomRays" width="110" height="90"
            class="h-20 w-auto object-contain brightness-0 invert opacity-80" />
          <p class="font-body text-sm text-white/40 leading-relaxed max-w-xs">
            Premium botanical fragrances, diffusers, candles, and accessories. Handcrafted in Canada.
          </p>
          <form class="flex border border-white/20 max-w-xs" (submit)="$event.preventDefault()">
            <input
              type="email"
              [(ngModel)]="newsletterEmail"
              name="email"
              placeholder="Your email"
              class="flex-1 bg-transparent px-3 py-2.5 text-[12px] text-white/70 placeholder:text-white/35 outline-none"
            />
            <button
              type="submit"
              class="px-4 text-[10px] font-semibold tracking-[0.14em] uppercase text-white/80 hover:text-gold transition-colors"
            >
              Join
            </button>
          </form>
        </div>

        <!-- Shop links -->
        <div class="space-y-5">
          <h3 class="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">Shop</h3>
          <ul class="space-y-3">
            <li *ngFor="let link of shopLinks">
              <a [routerLink]="link.href" class="font-body text-sm text-white/40 hover:text-gold transition-colors duration-150">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Information -->
        <div class="space-y-5">
          <h3 class="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">Information</h3>
          <ul class="space-y-3">
            <li *ngFor="let link of infoLinks">
              <a [routerLink]="link.href" class="font-body text-sm text-white/40 hover:text-gold transition-colors duration-150">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="space-y-5">
          <h3 class="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">Contact</h3>
          <div class="space-y-3 font-body text-sm text-white/40">
            <p>Made in Canada 🍁</p>
            <a href="mailto:hello@blossomrays.ca" class="block hover:text-gold transition-colors">hello&#64;blossomrays.ca</a>
          </div>
          <!-- Social icons placeholder -->
          <div class="flex gap-3 pt-1">
            <a href="#" aria-label="Instagram" class="text-white/30 hover:text-gold transition-colors">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="font-body text-[11px] text-white/30">
          &copy; {{ year }} BlossomRays. All rights reserved.
        </p>
        <div class="flex items-center gap-5 font-body text-[11px] text-white/30">
          <a href="#" class="hover:text-white/60 transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-white/60 transition-colors">Terms of Service</a>
          <a href="#" class="hover:text-white/60 transition-colors">Shipping Policy</a>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
  newsletterEmail = '';

  readonly shopLinks = [
    { href: '/products', label: 'All Products' },
    { href: '/products?category=car-fresheners', label: 'Car Fresheners' },
    { href: '/products?category=diffuser', label: 'Diffusers' },
    { href: '/products?category=fragrance-oil', label: 'Fragrance Oil' },
    { href: '/products?category=essential-oil', label: 'Essential Oil' },
    { href: '/products?category=candle', label: 'Candles' },
    { href: '/products?category=perfume', label: 'Perfumes' },
    { href: '/products?category=ladies-bag', label: 'Ladies Bags' },
  ];

  readonly infoLinks = [
    { href: '/account/orders', label: 'Track Order' },
    { href: '/account', label: 'My Account' },
    { href: '/login', label: 'Login' },
    { href: '/register', label: 'Register' },
  ];
}
