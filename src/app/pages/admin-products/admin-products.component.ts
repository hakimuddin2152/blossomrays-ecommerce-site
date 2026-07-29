import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductService, STATIC_PRODUCTS } from '../../services/product.service';
import { formatPrice } from '../../utils/format-price';
import type { Product, ProductCategory } from '../../types';

const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: 'lavender', label: 'Lavender' },
  { value: 'rose', label: 'Rose' },
  { value: 'millennium', label: 'Millennium' },
  { value: 'diffuser', label: 'Diffuser' },
  { value: 'fragrance-oil', label: 'Fragrance Oil' },
  { value: 'essential-oil', label: 'Essential Oil' },
  { value: 'candle', label: 'Candle' },
  { value: 'perfume', label: 'Perfume' },
  { value: 'ladies-bag', label: 'Ladies Bag' },
];

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
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
          <div class="flex items-center justify-between mb-8">
            <h1 class="font-display text-3xl font-semibold text-plum">Products</h1>
            <button type="button" (click)="openCreate()" class="btn-primary px-6 py-2.5 text-sm">
              + Add Product
            </button>
          </div>

          <p *ngIf="listError()" class="font-body text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 mb-4">
            {{ listError() }}
          </p>

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
                    <th class="text-right px-6 py-3 font-body text-[10px] uppercase tracking-widest text-muted">Actions</th>
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
                      <button
                        type="button"
                        (click)="toggleActive(p)"
                        [class]="p.is_active
                          ? 'badge bg-sage-light border-sage/20 text-sage-dark'
                          : 'badge bg-cream border-cream-dark text-muted'"
                      >{{ p.is_active ? 'Active' : 'Inactive' }}</button>
                    </td>
                    <td class="px-6 py-3 text-right whitespace-nowrap">
                      <button type="button" (click)="openEdit(p)" class="font-body text-xs font-semibold text-plum hover:text-gold mr-4">
                        Edit
                      </button>
                      <button type="button" (click)="onDelete(p)" class="font-body text-xs font-semibold text-red-500 hover:text-red-700">
                        Delete
                      </button>
                    </td>
                  </tr>
                  <tr *ngIf="!loading() && products().length === 0">
                    <td colspan="6" class="px-6 py-10 text-center font-body text-sm text-muted">No products yet.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Create/Edit modal -->
    <div *ngIf="showModal()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-plum/40" (click)="closeModal()">
      <div class="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-soft-lg" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between px-6 py-4 border-b border-cream-dark sticky top-0 bg-white">
          <h2 class="font-display text-xl font-semibold text-plum">
            {{ editingProduct() ? 'Edit Product' : 'Add Product' }}
          </h2>
          <button type="button" (click)="closeModal()" class="text-muted hover:text-plum text-xl leading-none">×</button>
        </div>

        <!-- Language tabs -->
        <div class="flex border-b border-cream-dark px-6">
          <button
            type="button"
            (click)="activeTab.set('en')"
            [class]="activeTab() === 'en' ? 'px-4 py-3 font-body text-sm font-semibold text-plum border-b-2 border-plum' : 'px-4 py-3 font-body text-sm text-muted'"
          >English</button>
          <button
            type="button"
            (click)="activeTab.set('fr')"
            [class]="activeTab() === 'fr' ? 'px-4 py-3 font-body text-sm font-semibold text-plum border-b-2 border-plum' : 'px-4 py-3 font-body text-sm text-muted'"
          >Français</button>
        </div>

        <form [formGroup]="englishForm" (ngSubmit)="onSave()" class="p-6 space-y-4">
          <!-- English tab -->
          <div *ngIf="activeTab() === 'en'" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="font-body text-xs font-semibold text-muted uppercase tracking-wide">Name</label>
                <input formControlName="name" type="text" class="input-field w-full mt-1" />
              </div>
              <div>
                <label class="font-body text-xs font-semibold text-muted uppercase tracking-wide">Slug</label>
                <input formControlName="slug" type="text" class="input-field w-full mt-1" />
              </div>
            </div>

            <div>
              <label class="font-body text-xs font-semibold text-muted uppercase tracking-wide">Tagline</label>
              <input formControlName="tagline" type="text" class="input-field w-full mt-1" />
            </div>

            <div>
              <label class="font-body text-xs font-semibold text-muted uppercase tracking-wide">Description</label>
              <textarea formControlName="description" rows="3" class="input-field w-full mt-1"></textarea>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="font-body text-xs font-semibold text-muted uppercase tracking-wide">Price (CAD)</label>
                <input formControlName="price" type="number" step="0.01" min="0" class="input-field w-full mt-1" />
              </div>
              <div>
                <label class="font-body text-xs font-semibold text-muted uppercase tracking-wide">Compare-at Price</label>
                <input formControlName="compare_at_price" type="number" step="0.01" min="0" class="input-field w-full mt-1" />
              </div>
              <div>
                <label class="font-body text-xs font-semibold text-muted uppercase tracking-wide">Stock</label>
                <input formControlName="stock" type="number" min="0" class="input-field w-full mt-1" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="font-body text-xs font-semibold text-muted uppercase tracking-wide">Category</label>
                <select formControlName="category" class="input-field w-full mt-1">
                  <option *ngFor="let c of categoryOptions" [value]="c.value">{{ c.label }}</option>
                </select>
              </div>
              <div class="flex items-end pb-2">
                <label class="flex items-center gap-2 font-body text-sm text-plum">
                  <input formControlName="is_active" type="checkbox" />
                  Active (visible in store)
                </label>
              </div>
            </div>

            <div>
              <label class="font-body text-xs font-semibold text-muted uppercase tracking-wide">Images</label>

              <div class="flex flex-wrap gap-3 mt-2" *ngIf="images().length > 0">
                <div *ngFor="let img of images(); let i = index" class="relative w-20 h-20 flex-shrink-0">
                  <img [src]="img" class="w-full h-full object-cover bg-cream border border-cream-dark" />
                  <button
                    type="button"
                    (click)="removeImage(i)"
                    class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-plum text-white text-xs leading-none flex items-center justify-center"
                    aria-label="Remove image"
                  >×</button>
                </div>
              </div>

              <div class="flex items-center gap-3 mt-3">
                <label class="btn-outline px-4 py-2 text-xs cursor-pointer">
                  {{ uploadingImages() ? 'Uploading…' : '📤 Upload Image(s)' }}
                  <input type="file" accept="image/*" multiple class="hidden" [disabled]="uploadingImages()" (change)="onFilesSelected($event)" />
                </label>
                <span class="font-body text-[11px] text-muted">or paste a URL:</span>
                <input
                  #urlInput
                  type="text"
                  placeholder="/images/candle/1.jpg"
                  class="input-field flex-1 text-xs py-2"
                  (keydown.enter)="$event.preventDefault(); addImageUrl(urlInput.value); urlInput.value = ''"
                />
              </div>
              <p *ngIf="uploadError()" class="font-body text-xs text-red-600 mt-2">{{ uploadError() }}</p>
            </div>

            <div>
              <label class="font-body text-xs font-semibold text-muted uppercase tracking-wide">SEO Title</label>
              <input formControlName="seo_title" type="text" class="input-field w-full mt-1" />
            </div>
            <div>
              <label class="font-body text-xs font-semibold text-muted uppercase tracking-wide">SEO Description</label>
              <textarea formControlName="seo_description" rows="2" class="input-field w-full mt-1"></textarea>
            </div>
          </div>

          <!-- French tab -->
          <div *ngIf="activeTab() === 'fr'" [formGroup]="frenchForm" class="space-y-4">
            <p class="font-body text-xs text-muted italic">
              Leave any field blank to fall back to the English value on the storefront.
            </p>
            <div>
              <label class="font-body text-xs font-semibold text-muted uppercase tracking-wide">Nom (French name)</label>
              <input formControlName="name" type="text" class="input-field w-full mt-1" />
            </div>
            <div>
              <label class="font-body text-xs font-semibold text-muted uppercase tracking-wide">Slogan (French tagline)</label>
              <input formControlName="tagline" type="text" class="input-field w-full mt-1" />
            </div>
            <div>
              <label class="font-body text-xs font-semibold text-muted uppercase tracking-wide">Description (French)</label>
              <textarea formControlName="description" rows="3" class="input-field w-full mt-1"></textarea>
            </div>
            <div>
              <label class="font-body text-xs font-semibold text-muted uppercase tracking-wide">SEO Title (French)</label>
              <input formControlName="seo_title" type="text" class="input-field w-full mt-1" />
            </div>
            <div>
              <label class="font-body text-xs font-semibold text-muted uppercase tracking-wide">SEO Description (French)</label>
              <textarea formControlName="seo_description" rows="2" class="input-field w-full mt-1"></textarea>
            </div>
          </div>

          <p *ngIf="errorMsg()" class="font-body text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3">
            {{ errorMsg() }}
          </p>

          <div class="flex justify-end gap-3 pt-2">
            <button type="button" (click)="closeModal()" class="font-body text-sm font-semibold text-muted hover:text-plum px-4 py-2.5">
              Cancel
            </button>
            <button type="submit" [disabled]="saving()" class="btn-primary px-8 py-2.5 text-sm">
              {{ saving() ? 'Saving…' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class AdminProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly fb = inject(FormBuilder);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly listError = signal<string | null>(null);
  readonly formatPrice = formatPrice;
  readonly categoryOptions = CATEGORY_OPTIONS;

  readonly showModal = signal(false);
  readonly editingProduct = signal<Product | null>(null);
  readonly activeTab = signal<'en' | 'fr'>('en');
  readonly saving = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly images = signal<string[]>([]);
  readonly uploadingImages = signal(false);
  readonly uploadError = signal<string | null>(null);

  readonly englishForm = this.fb.group({
    name: ['', Validators.required],
    slug: ['', Validators.required],
    tagline: [''],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    compare_at_price: [null as number | null],
    stock: [0, [Validators.required, Validators.min(0)]],
    category: ['lavender' as ProductCategory, Validators.required],
    is_active: [true],
    seo_title: [''],
    seo_description: [''],
  });

  readonly frenchForm = this.fb.group({
    name: [''],
    tagline: [''],
    description: [''],
    seo_title: [''],
    seo_description: [''],
  });

  async ngOnInit(): Promise<void> {
    await this.reload();
  }

  private async reload(): Promise<void> {
    this.loading.set(true);
    try {
      const data = await this.productService.getAllProductsAdmin();
      this.products.set(data);
    } catch {
      this.products.set(STATIC_PRODUCTS);
    } finally {
      this.loading.set(false);
    }
  }

  openCreate(): void {
    this.editingProduct.set(null);
    this.activeTab.set('en');
    this.errorMsg.set(null);
    this.uploadError.set(null);
    this.images.set([]);
    this.englishForm.reset({
      name: '', slug: '', tagline: '', description: '',
      price: 0, compare_at_price: null, stock: 0,
      category: 'lavender', is_active: true,
      seo_title: '', seo_description: '',
    });
    this.frenchForm.reset({ name: '', tagline: '', description: '', seo_title: '', seo_description: '' });
    this.showModal.set(true);
  }

  async openEdit(product: Product): Promise<void> {
    this.editingProduct.set(product);
    this.activeTab.set('en');
    this.errorMsg.set(null);
    this.uploadError.set(null);
    this.images.set([...product.images]);
    this.englishForm.reset({
      name: product.name,
      slug: product.slug,
      tagline: product.tagline ?? '',
      description: product.description ?? '',
      price: product.price / 100,
      compare_at_price: product.compare_at_price !== null ? product.compare_at_price / 100 : null,
      stock: product.stock,
      category: product.category,
      is_active: product.is_active,
      seo_title: product.seo_title ?? '',
      seo_description: product.seo_description ?? '',
    });
    this.frenchForm.reset({ name: '', tagline: '', description: '', seo_title: '', seo_description: '' });

    const translation = await this.productService.getTranslation(product.id);
    if (translation) {
      this.frenchForm.reset({
        name: translation.name ?? '',
        tagline: translation.tagline ?? '',
        description: translation.description ?? '',
        seo_title: translation.seo_title ?? '',
        seo_description: translation.seo_description ?? '',
      });
    }
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  addImageUrl(url: string): void {
    const trimmed = url.trim();
    if (!trimmed) return;
    this.images.update((imgs) => [...imgs, trimmed]);
  }

  removeImage(index: number): void {
    this.images.update((imgs) => imgs.filter((_, i) => i !== index));
  }

  async onFilesSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    this.uploadingImages.set(true);
    this.uploadError.set(null);
    try {
      for (const file of Array.from(files)) {
        const url = await this.productService.uploadProductImage(file);
        this.images.update((imgs) => [...imgs, url]);
      }
    } catch (e) {
      this.uploadError.set(
        e instanceof Error ? e.message : 'Image upload failed. Has migration 012_product_images_storage.sql been run?'
      );
    } finally {
      this.uploadingImages.set(false);
      input.value = '';
    }
  }

  async onSave(): Promise<void> {
    if (this.englishForm.invalid) { this.englishForm.markAllAsTouched(); return; }
    this.saving.set(true);
    this.errorMsg.set(null);

    const v = this.englishForm.value;
    const images = this.images();

    const payload = {
      name: v.name ?? '',
      slug: v.slug ?? '',
      tagline: v.tagline || null,
      description: v.description || null,
      price: Math.round((v.price ?? 0) * 100),
      compare_at_price: v.compare_at_price ? Math.round(v.compare_at_price * 100) : null,
      stock: v.stock ?? 0,
      category: (v.category ?? 'lavender') as ProductCategory,
      is_active: v.is_active ?? true,
      images: images.length > 0 ? images : ['/images/lavender/1.jpg'],
      seo_title: v.seo_title || null,
      seo_description: v.seo_description || null,
    };

    try {
      const existing = this.editingProduct();
      const saved = existing
        ? await this.productService.updateProduct(existing.id, payload)
        : await this.productService.createProduct(payload);

      // Product itself is saved at this point — close/refresh regardless of
      // whether the (optional) French translation write below succeeds, so a
      // translation failure never looks like "nothing was saved".
      this.showModal.set(false);
      await this.reload();

      const fr = this.frenchForm.value;
      try {
        await this.productService.upsertTranslation(saved.id, {
          name: fr.name || null,
          tagline: fr.tagline || null,
          description: fr.description || null,
          seo_title: fr.seo_title || null,
          seo_description: fr.seo_description || null,
        });
      } catch {
        this.listError.set(
          'Product saved, but the French translation could not be saved. ' +
          'Has migration 011_product_translations.sql been run in the Supabase SQL Editor?'
        );
      }
    } catch (e) {
      this.errorMsg.set(e instanceof Error ? e.message : 'Failed to save product.');
    } finally {
      this.saving.set(false);
    }
  }

  async toggleActive(product: Product): Promise<void> {
    try {
      await this.productService.updateProduct(product.id, { is_active: !product.is_active });
      await this.reload();
    } catch {
      this.listError.set('Failed to update product status.');
    }
  }

  async onDelete(product: Product): Promise<void> {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await this.productService.deleteProduct(product.id);
      await this.reload();
    } catch {
      this.listError.set(`Could not delete "${product.name}" — it may be referenced by existing orders. Try deactivating it instead.`);
    }
  }
}
