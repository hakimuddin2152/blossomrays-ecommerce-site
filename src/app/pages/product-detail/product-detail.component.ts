import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { formatPrice } from '../../utils/format-price';
import { TranslationService } from '../../services/translation.service';
import { LocaleService } from '../../services/locale.service';
import { categoryLabelKey } from '../../utils/category-label';
import type { Product } from '../../types';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="bg-cream min-h-screen">
      <!-- Loading -->
      <ng-container *ngIf="loading()">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid md:grid-cols-2 gap-12">
          <div class="aspect-square bg-cream-dark animate-pulse"></div>
          <div class="space-y-4">
            <div class="h-8 bg-cream-dark animate-pulse w-3/4"></div>
            <div class="h-6 bg-cream-dark animate-pulse w-1/2"></div>
            <div class="h-24 bg-cream-dark animate-pulse"></div>
          </div>
        </div>
      </ng-container>

      <!-- Not found -->
      <ng-container *ngIf="!loading() && !product()">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center space-y-4">
          <h1 class="font-display text-3xl font-semibold text-plum">{{ t('productDetail.notFound') }}</h1>
          <p class="font-body text-muted">{{ t('productDetail.notFoundDesc') }}</p>
          <a routerLink="/products" class="btn-primary inline-flex mt-4">{{ t('common.browseAllProducts') }}</a>
        </div>
      </ng-container>

      <!-- Product -->
      <ng-container *ngIf="!loading() && product() as p">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <!-- Breadcrumb -->
          <nav class="flex items-center gap-2 font-body text-[11px] text-muted mb-8 uppercase tracking-widest">
            <a routerLink="/" class="hover:text-plum">{{ t('common.home') }}</a>
            <span>/</span>
            <a routerLink="/products" class="hover:text-plum">{{ t('common.products') }}</a>
            <span>/</span>
            <span class="text-plum">{{ p.name }}</span>
          </nav>

          <div class="grid md:grid-cols-2 gap-12 lg:gap-16">
            <!-- Images -->
            <div class="space-y-3">
              <div class="aspect-square bg-cream-light overflow-hidden">
                <img
                  [src]="selectedImage()"
                  [alt]="p.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <!-- Thumbnails -->
              <div *ngIf="p.images.length > 1" class="flex flex-wrap gap-2">
                <button
                  *ngFor="let img of p.images; let i = index"
                  (click)="selectedImage.set(img)"
                  [class]="selectedImage() === img ? 'w-14 h-14 sm:w-16 sm:h-16 border-2 border-plum overflow-hidden' : 'w-14 h-14 sm:w-16 sm:h-16 border border-cream-dark overflow-hidden opacity-60 hover:opacity-100 transition-opacity'"
                >
                  <img [src]="img" [alt]="p.name + ' ' + (i + 1)" class="w-full h-full object-cover" />
                </button>
              </div>
            </div>

            <!-- Info -->
            <div class="space-y-6">
              <div>
                <p class="section-eyebrow mb-1">{{ categoryLabel(p.category) }}</p>
                <h1 class="font-display text-3xl sm:text-4xl font-semibold text-plum leading-tight">{{ p.name }}</h1>
                <p *ngIf="p.tagline" class="font-body text-muted mt-2">{{ p.tagline }}</p>
              </div>

              <!-- Price -->
              <div class="flex items-baseline gap-3 flex-wrap">
                <span class="font-body text-2xl font-semibold text-plum">{{ formatPrice(p.price, locale.currency()) }}</span>
                <span *ngIf="p.compare_at_price" class="font-body text-base text-muted line-through">
                  {{ formatPrice(p.compare_at_price, locale.currency()) }}
                </span>
              </div>

              <hr class="border-cream-dark" />

              <!-- Description -->
              <p *ngIf="p.description" class="font-body text-sm text-muted leading-relaxed">{{ p.description }}</p>

              <!-- Trust marks -->
              <div class="grid grid-cols-2 gap-3">
                <div *ngFor="let mark of trustMarks" class="flex items-center gap-2">
                  <span class="text-lg">{{ mark.icon }}</span>
                  <span class="font-body text-[12px] text-muted">{{ t(mark.textKey) }}</span>
                </div>
              </div>

              <!-- Quantity + Add to cart -->
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <label class="font-body text-[11px] uppercase tracking-widest text-muted">{{ t('checkout.qty') }}</label>
                  <div class="flex items-center border border-cream-dark">
                    <button (click)="decQty()" class="w-10 h-10 flex items-center justify-center text-plum hover:bg-cream transition-colors">−</button>
                    <span class="w-12 text-center font-body text-sm text-plum">{{ qty() }}</span>
                    <button (click)="incQty()" class="w-10 h-10 flex items-center justify-center text-plum hover:bg-cream transition-colors">+</button>
                  </div>
                </div>

                <button
                  (click)="addToCart(p)"
                  [disabled]="p.stock === 0 || added()"
                  class="btn-primary w-full"
                >
                  {{ added() ? '✓ ' + t('common.addedToCart') : p.stock === 0 ? t('common.outOfStock') : t('common.addToCart') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cart = inject(CartService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly i18n = inject(TranslationService);
  readonly locale = inject(LocaleService);

  readonly formatPrice = formatPrice;
  readonly product = signal<Product | null>(null);
  readonly loading = signal(true);
  readonly selectedImage = signal('');
  readonly qty = signal(1);
  readonly added = signal(false);

  readonly trustMarks = [
    { icon: '🍁', textKey: 'common.madeInCanada' },
    { icon: '✓', textKey: 'common.daysLasting120' },
    { icon: '🌿', textKey: 'common.alcoholFree100' },
    { icon: '↩', textKey: 'common.returns30Day' },
  ];

  t(key: string): string {
    return this.i18n.t(key);
  }

  categoryLabel(category: string): string {
    const key = categoryLabelKey(category);
    return key ? this.t(key) : category;
  }

  ngOnInit(): void {
    /**
     * BUG FIX: Use paramMap Observable, not snapshot.
     *
     * route.snapshot.paramMap is captured once at component creation.
     * When Angular navigates from /products/rose to /products/lavender it
     * REUSES the same component instance (same route pattern), so ngOnInit
     * does NOT re-run and the page stays frozen on the first product.
     *
     * Subscribing to route.paramMap emits every time the :slug changes,
     * so the page reloads its data correctly on every navigation.
     */
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const slug = params.get('slug') ?? '';
        this.loadProduct(slug);
      });
  }

  private async loadProduct(slug: string): Promise<void> {
    this.loading.set(true);
    this.product.set(null);
    this.qty.set(1);
    this.added.set(false);
    const product = await this.productService.getProductBySlug(slug);
    this.product.set(product);
    if (product?.images[0]) this.selectedImage.set(product.images[0]);
    this.loading.set(false);
  }

  incQty(): void { this.qty.update((q) => q + 1); }
  decQty(): void { this.qty.update((q) => Math.max(1, q - 1)); }

  addToCart(product: Product): void {
    this.cart.addItem(product, this.qty());
    this.added.set(true);
    setTimeout(() => this.added.set(false), 2000);
  }
}
