import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService, STATIC_PRODUCTS } from '../../services/product.service';
import { formatPrice } from '../../utils/format-price';
import type { Product } from '../../types';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="bg-cream min-h-screen">
      <!-- Mobile top nav (shown below md where sidebar is hidden) -->
      <nav class="md:hidden bg-white border-b border-cream-dark px-4 py-2 flex gap-1 overflow-x-auto">
        <a routerLink="/admin" class="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 font-body text-[11px] uppercase tracking-wide text-muted hover:text-plum rounded transition-colors">
          📊 Overview
        </a>
        <a routerLink="/admin/orders" class="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 font-body text-[11px] uppercase tracking-wide text-muted hover:text-plum rounded transition-colors">
          📦 Orders
        </a>
        <a routerLink="/admin/products" class="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 font-body text-[11px] font-semibold uppercase tracking-wide bg-cream text-plum rounded">
          🏷️ Products
        </a>
        <a routerLink="/account" class="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 font-body text-[11px] uppercase tracking-wide text-muted hover:text-plum rounded transition-colors">
          ← Store
        </a>
      </nav>
      <div class="flex h-screen">
        <!-- Sidebar (desktop only) -->
        <aside class="w-64 bg-white border-r border-cream-dark flex-shrink-0 hidden md:flex flex-col py-6 px-4 space-y-2">
          <p class="section-eyebrow px-3 mb-4">Admin Panel</p>
          <a routerLink="/admin" class="flex items-center gap-3 px-3 py-2 font-body text-sm text-muted hover:text-plum hover:bg-cream rounded-lg transition-colors">
            <span>📊</span> Overview
          </a>
          <a routerLink="/admin/orders" class="flex items-center gap-3 px-3 py-2 font-body text-sm text-muted hover:text-plum hover:bg-cream rounded-lg transition-colors">
            <span>📦</span> Orders
          </a>
          <a routerLink="/admin/products" class="flex items-center gap-3 px-3 py-2 font-body text-sm text-plum bg-cream rounded-lg">
            <span>🏷️</span> Products
          </a>
          <hr class="border-cream-dark" />
          <a routerLink="/account" class="flex items-center gap-3 px-3 py-2 font-body text-sm text-muted hover:text-plum hover:bg-cream rounded-lg transition-colors">
            <span>←</span> Back to Store
          </a>
        </aside>

        <!-- Main -->
        <main class="flex-1 overflow-y-auto p-6 lg:p-10">
          <h1 class="font-display text-3xl font-semibold text-plum mb-8">Products</h1>

          <div class="bg-white border border-cream-dark overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-cream">
                  <tr>
                    <th class="text-left px-6 py-3 font-body text-[10px] uppercase tracking-widest text-muted">Product</th>
                    <th class="text-left px-6 py-3 font-body text-[10px] uppercase tracking-widest text-muted">Category</th>
                    <th class="text-right px-6 py-3 font-body text-[10px] uppercase tracking-widest text-muted">Price</th>
                    <th class="text-right px-6 py-3 font-body text-[10px] uppercase tracking-widest text-muted">Stock</th>
                    <th class="text-left px-6 py-3 font-body text-[10px] uppercase tracking-widest text-muted">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let p of products()" class="border-t border-cream-dark hover:bg-cream transition-colors">
                    <td class="px-6 py-3">
                      <div class="flex items-center gap-3">
                        <img [src]="p.images[0]" [alt]="p.name" class="w-10 h-10 object-cover bg-cream flex-shrink-0" />
                        <div>
                          <p class="font-body text-sm font-medium text-plum">{{ p.name }}</p>
                          <p class="font-body text-[11px] text-muted">{{ p.slug }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-3 font-body text-sm text-muted">{{ p.category }}</td>
                    <td class="px-6 py-3 font-body text-sm font-semibold text-plum text-right">{{ formatPrice(p.price) }}</td>
                    <td class="px-6 py-3 font-body text-sm text-muted text-right">{{ p.stock }}</td>
                    <td class="px-6 py-3">
                      <span [class]="p.is_active
                        ? 'badge bg-sage-light border-sage/20 text-sage-dark'
                        : 'badge bg-cream border-cream-dark text-muted'"
                      >{{ p.is_active ? 'Active' : 'Inactive' }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
})
export class AdminProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);

  readonly products = signal<Product[]>([]);
  readonly formatPrice = formatPrice;

  async ngOnInit(): Promise<void> {
    try {
      const data = await this.productService.getProducts();
      this.products.set(data);
    } catch {
      this.products.set(STATIC_PRODUCTS);
    }
  }
}
