import { Injectable, inject } from '@angular/core';
import type { Product, ProductCategory, ProductTranslation } from '../types';
import { SupabaseService } from './supabase.service';
import { LocaleService } from './locale.service';

const PLACEHOLDER_IMAGE = '/images/lavender/1.jpg';

export const STATIC_PRODUCTS: Product[] = [
  {
    id: 'b1f1a000-0000-4000-a000-000000000001', name: 'Rose Car Air Freshener', slug: 'rose-car-air-freshener',
    tagline: 'Bloom on the road', description: 'A delicate blend of Bulgarian rose, peony and soft musk. Handcrafted in Canada with premium botanical extracts — alcohol-free and long-lasting for 120+ days.',
    price: 1799, compare_at_price: null,
    stock: 100, category: 'rose', is_active: true,
    images: [
      '/images/rose/Main_Image.jpeg',
      '/images/rose/Main_Image_Rose1.jpg',
      '/images/rose/Dual_Ways.jpg',
      '/images/rose/Fragrance_Details.jpeg',
      '/images/rose/MultiUses.jpg',
      '/images/rose/Whats_In_The_Pack.jpeg',
      '/images/rose/Main_Image_With_Prod_Of_Canada.jpg',
      '/images/rose/Manual.jpeg',
    ],
    seo_title: null, seo_description: null,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'b1f1a000-0000-4000-a000-000000000002', name: 'Lavender Car Air Freshener', slug: 'lavender-car-air-freshener',
    tagline: 'Calm your commute', description: 'Soothing French lavender, bergamot and cedarwood — a serene botanical blend handcrafted in Canada. Alcohol-free and lasting 120+ days for a calming drive every time.',
    price: 1799, compare_at_price: null,
    stock: 100, category: 'lavender', is_active: true,
    images: [
      '/images/lavender/1.jpg',
      '/images/lavender/2.jpg',
      '/images/lavender/3.jpg',
      '/images/lavender/4.jpg',
      '/images/lavender/5.jpg',
      '/images/lavender/6.jpg',
      '/images/lavender/7.jpg',
      '/images/lavender/8.jpg',
    ],
    seo_title: null, seo_description: null,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'b1f1a000-0000-4000-a000-000000000003', name: 'Millennium Car Air Freshener', slug: 'millennium-car-air-freshener',
    tagline: 'A scent beyond time', description: 'Warm amber, sandalwood and vanilla create an timeless, sophisticated fragrance. Handcrafted in Canada with botanical extracts — alcohol-free and lasting 120+ days.',
    price: 1799, compare_at_price: null,
    stock: 100, category: 'millennium', is_active: true,
    images: [
      '/images/millenium/1.jpg',
      '/images/millenium/2.jpg',
      '/images/millenium/3.jpg',
      '/images/millenium/4.jpg',
      '/images/millenium/5.jpg',
      '/images/millenium/6.jpg',
      '/images/millenium/7.jpg',
      '/images/millenium/8.jpg',
    ],
    seo_title: null, seo_description: null,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'b1f1a000-0000-4000-a000-000000000010', name: 'Aroma Diffuser', slug: 'aroma-diffuser',
    tagline: 'Fill your space with fragrance', description: null, price: 3499, compare_at_price: 4999,
    stock: 50, category: 'diffuser', is_active: true,
    images: [PLACEHOLDER_IMAGE], seo_title: null, seo_description: null,
    created_at: '2024-01-02T00:00:00Z', updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'b1f1a000-0000-4000-a000-000000000011', name: 'Rose Fragrance Oil', slug: 'rose-fragrance-oil',
    tagline: 'Pure botanical concentrate', description: null, price: 1499, compare_at_price: null,
    stock: 80, category: 'fragrance-oil', is_active: true,
    images: [PLACEHOLDER_IMAGE], seo_title: null, seo_description: null,
    created_at: '2024-01-02T00:00:00Z', updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'b1f1a000-0000-4000-a000-000000000012', name: 'Lavender Essential Oil', slug: 'lavender-essential-oil',
    tagline: 'Pure therapeutic grade', description: null, price: 1299, compare_at_price: null,
    stock: 80, category: 'essential-oil', is_active: true,
    images: [PLACEHOLDER_IMAGE], seo_title: null, seo_description: null,
    created_at: '2024-01-02T00:00:00Z', updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'b1f1a000-0000-4000-a000-000000000013', name: 'Botanical Soy Candle', slug: 'botanical-soy-candle',
    tagline: 'Hand-poured & long-burning', description: null, price: 2499, compare_at_price: null,
    stock: 40, category: 'candle', is_active: true,
    images: [PLACEHOLDER_IMAGE], seo_title: null, seo_description: null,
    created_at: '2024-01-02T00:00:00Z', updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'b1f1a000-0000-4000-a000-000000000014', name: 'Signature Perfume', slug: 'signature-perfume',
    tagline: 'Your scent, your identity', description: null, price: 5999, compare_at_price: 7499,
    stock: 30, category: 'perfume', is_active: true,
    images: [PLACEHOLDER_IMAGE], seo_title: null, seo_description: null,
    created_at: '2024-01-02T00:00:00Z', updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 'b1f1a000-0000-4000-a000-000000000015', name: 'Luxury Ladies Bag', slug: 'luxury-ladies-bag',
    tagline: 'Elegance you can carry', description: null, price: 8999, compare_at_price: 12999,
    stock: 20, category: 'ladies-bag', is_active: true,
    images: [PLACEHOLDER_IMAGE], seo_title: null, seo_description: null,
    created_at: '2024-01-02T00:00:00Z', updated_at: '2024-01-02T00:00:00Z',
  },
];

export const CAR_FRESHENER_CATEGORIES: ProductCategory[] = ['lavender', 'rose', 'millennium'];

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly supabase = inject(SupabaseService).client;
  private readonly locale = inject(LocaleService);

  async getProducts(category?: string): Promise<Product[]> {
    try {
      let query = this.supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (category && category !== 'car-fresheners') {
        query = query.eq('category', category) as typeof query;
      } else if (category === 'car-fresheners') {
        query = query.in('category', CAR_FRESHENER_CATEGORIES) as typeof query;
      }

      const { data, error } = await query;
      if (error || !data?.length) return this._filterStatic(category);
      return this._withTranslations(data as Product[]);
    } catch {
      return this._filterStatic(category);
    }
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    /**
     * PERF FIX: Static-first lookup.
     *
     * Previously this always fired a Supabase network request first,
     * waited for it to succeed or fail, then fell back to static data.
     * That added a full round-trip (100–500 ms) even for hardcoded products.
     *
     * Now: check the static list immediately (synchronous, zero latency).
     * Only hit the DB for slugs that aren't in the static list, i.e. products
     * added dynamically via the admin panel.
     */
    const staticMatch = STATIC_PRODUCTS.find((p) => p.slug === slug);
    if (staticMatch) {
      const [translated] = await this._withTranslations([staticMatch]);
      return translated;
    }

    try {
      const { data } = await this.supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();
      if (data) {
        const [translated] = await this._withTranslations([data as Product]);
        return translated;
      }
    } catch { /* fall through */ }
    return null;
  }

  /** Admin-only: returns every product regardless of active status, English
   * (canonical) fields only — the admin UI edits translations separately. */
  async getAllProductsAdmin(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return STATIC_PRODUCTS;
    return data as Product[];
  }

  /** Fetches the French translation row for a product, if one exists. */
  async getTranslation(productId: string): Promise<ProductTranslation | null> {
    const { data } = await this.supabase
      .from('product_translations')
      .select('*')
      .eq('product_id', productId)
      .eq('language', 'fr')
      .maybeSingle();
    return (data as ProductTranslation) ?? null;
  }

  /** Creates a new product (admin). */
  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const { data, error } = await this.supabase
      .from('products')
      .insert(product)
      .select('*')
      .single();
    if (error || !data) throw error ?? new Error('Failed to create product');
    return data as Product;
  }

  /** Updates an existing product's canonical (English) fields (admin). */
  async updateProduct(id: string, patch: Partial<Product>): Promise<Product> {
    const { data, error } = await this.supabase
      .from('products')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
    if (error || !data) throw error ?? new Error('Failed to update product');
    return data as Product;
  }

  /** Creates/updates the French translation row for a product (admin). */
  async upsertTranslation(
    productId: string,
    fields: Pick<ProductTranslation, 'name' | 'tagline' | 'description' | 'seo_title' | 'seo_description'>
  ): Promise<void> {
    const { error } = await this.supabase
      .from('product_translations')
      .upsert(
        { product_id: productId, language: 'fr', ...fields, updated_at: new Date().toISOString() },
        { onConflict: 'product_id,language' }
      );
    if (error) throw error;
  }

  /** Uploads an image file to the `product-images` Supabase Storage bucket
   * (admin) and returns its public URL. See
   * supabase/migrations/012_product_images_storage.sql. */
  async uploadProductImage(file: File): Promise<string> {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await this.supabase.storage
      .from('product-images')
      .upload(path, file, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    const { data } = this.supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  }

  /** Permanently deletes a product (admin). Fails if referenced by any
   * existing order (FK ON DELETE RESTRICT) — deactivate instead in that case. */
  async deleteProduct(id: string): Promise<void> {
    const { error } = await this.supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  }

  /** Merges the current-language translation (name/tagline/description/SEO)
   * into each product, falling back to the English canonical value when no
   * translation row exists or a field is blank. No-op for English visitors. */
  private async _withTranslations(products: Product[]): Promise<Product[]> {
    if (this.locale.language() !== 'fr' || products.length === 0) return products;

    const ids = products.map((p) => p.id);
    const { data } = await this.supabase
      .from('product_translations')
      .select('*')
      .eq('language', 'fr')
      .in('product_id', ids);

    const byProductId = new Map((data as ProductTranslation[] | null)?.map((t) => [t.product_id, t]) ?? []);
    return products.map((product) => {
      const translation = byProductId.get(product.id);
      if (!translation) return product;
      return {
        ...product,
        name: translation.name || product.name,
        tagline: translation.tagline || product.tagline,
        description: translation.description || product.description,
        seo_title: translation.seo_title || product.seo_title,
        seo_description: translation.seo_description || product.seo_description,
      };
    });
  }

  private _filterStatic(category?: string): Product[] {
    if (!category) return STATIC_PRODUCTS;
    if (category === 'car-fresheners') {
      return STATIC_PRODUCTS.filter((p) => CAR_FRESHENER_CATEGORIES.includes(p.category));
    }
    return STATIC_PRODUCTS.filter((p) => p.category === category);
  }
}

