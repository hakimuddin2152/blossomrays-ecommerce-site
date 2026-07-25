import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  trigger, transition, style, animate, query, stagger,
} from '@angular/animations';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/products/product-card.component';
import { PageHeaderComponent } from '../../components/shared/page-header.component';
import type { Product } from '../../types';

/**
 * INTERVIEW CONCEPT: takeUntilDestroyed
 *
 * Before Angular 16, you had to manually unsubscribe in ngOnDestroy (or
 * use a Subject + takeUntil pattern). takeUntilDestroyed() ties the
 * Observable's lifetime to the component's DestroyRef automatically.
 *
 * Rule of thumb:
 *   - Subscriptions inside a constructor/field initialiser: pass no args
 *     (it captures DestroyRef from the injection context automatically).
 *   - Subscriptions inside ngOnInit or later: inject DestroyRef explicitly
 *     and pass it in: takeUntilDestroyed(this.destroyRef)
 */

const CATEGORY_TABS = [
  { value: '', label: 'All' },
  { value: 'car-fresheners', label: 'Car Fresheners' },
  { value: 'diffuser', label: 'Diffusers' },
  { value: 'fragrance-oil', label: 'Fragrance Oil' },
  { value: 'essential-oil', label: 'Essential Oil' },
  { value: 'candle', label: 'Candles' },
  { value: 'perfume', label: 'Perfumes' },
  { value: 'ladies-bag', label: 'Ladies Bags' },
];

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, PageHeaderComponent],
  /**
   * INTERVIEW: @angular/animations
   *
   * Animations are declared in the component metadata (not the template).
   * Key building blocks:
   *   trigger()      — names the animation, referenced in template as [@name]
   *   transition()   — defines when the animation runs ('* => *' = any change)
   *   query()        — selects child elements inside the host
   *   stagger()      — delays each child by N ms, creating a cascade effect
   *   style()        — sets CSS properties at a keyframe
   *   animate()      — transitions between styles over time
   *
   * The trigger is applied to the grid container.  Whenever `products()`
   * produces a new array reference, Angular re-renders the list and the
   * enter transition staggers each card in from below.
   */
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(16px)' }),
          stagger(40, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
          ]),
        ], { optional: true }),
      ]),
    ]),
  ],
  template: `
    <div class="bg-cream min-h-screen">
      <!--
        INTERVIEW: Content Projection in action.
        PageHeaderComponent defines the shell; we project the actual
        text in via named slots (eyebrow / title attributes).
      -->
      <app-page-header>
        <span eyebrow>Our Collection</span>
        <span title>Shop All Products</span>
      </app-page-header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <!-- Category tabs -->
        <div class="flex gap-1 overflow-x-auto pb-2 mb-8 scrollbar-thin">
          <button
            *ngFor="let tab of tabs"
            (click)="setCategory(tab.value)"
            [class]="activeCategory() === tab.value
              ? 'flex-shrink-0 px-5 py-2 font-body text-[11px] font-semibold tracking-[0.12em] uppercase bg-plum text-white border border-plum'
              : 'flex-shrink-0 px-5 py-2 font-body text-[11px] font-semibold tracking-[0.12em] uppercase border border-cream-dark text-muted hover:border-plum hover:text-plum transition-colors'"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Products grid -->
        <ng-container *ngIf="loading(); else grid">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div *ngFor="let s of skeletons" class="aspect-[3/4] bg-cream-dark animate-pulse"></div>
          </div>
        </ng-container>

        <ng-template #grid>
          <div *ngIf="products().length === 0" class="text-center py-20">
            <p class="font-body text-muted">No products found in this category.</p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
               [@listAnimation]="products().length">
            <app-product-card
              *ngFor="let product of products()"
              [product]="product"
              (cartAdded)="onCartAdded($event)"
            />
          </div>

          <!-- Toast notification — driven by @Output from ProductCardComponent -->
          <div
            *ngIf="toast()"
            class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-plum text-white font-body text-xs px-5 py-3 shadow-lg z-50 pointer-events-none"
          >
            ✓ {{ toast() }} added to cart
          </div>
        </ng-template>
      </div>
    </div>
  `,
})
export class ProductsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  /**
   * INTERVIEW: DestroyRef
   * Injected explicitly so we can pass it to takeUntilDestroyed() inside
   * ngOnInit (outside the injection context). Without this you'd need a
   * Subject<void> + takeUntil + ngOnDestroy — much more boilerplate.
   */
  private readonly destroyRef = inject(DestroyRef);

  readonly tabs = CATEGORY_TABS;
  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly activeCategory = signal('');
  readonly skeletons = Array(8);

  /** Drives the cart-added toast — set by (cartAdded) @Output handler */
  readonly toast = signal<string | null>(null);
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    /**
     * INTERVIEW: takeUntilDestroyed(destroyRef)
     * Automatically completes this subscription when the component is
     * destroyed — no ngOnDestroy boilerplate needed.
     */
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const category = params.get('category') ?? '';
        this.activeCategory.set(category);
        this.loadProducts(category);
      });
  }

  /**
   * INTERVIEW: @Output handler
   * Receives the emitted Product from ProductCardComponent and shows a
   * brief toast — the card itself stays unaware of toast logic.
   */
  onCartAdded(product: Product): void {
    this.toast.set(product.name);
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.set(null), 2500);
  }

  async setCategory(category: string): Promise<void> {
    this.activeCategory.set(category);
    await this.loadProducts(category);
  }

  private async loadProducts(category: string): Promise<void> {
    this.loading.set(true);
    try {
      const data = await this.productService.getProducts(category || undefined);
      this.products.set(data);
    } finally {
      this.loading.set(false);
    }
  }
}
