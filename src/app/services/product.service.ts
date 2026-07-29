import { Injectable, inject } from '@angular/core';
import type { Product, ProductCategory } from '../types';
import { SupabaseService } from './supabase.service';

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
      return data as Product[];
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
    if (staticMatch) return staticMatch;

    try {
      const { data } = await this.supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();
      if (data) return data as Product;
    } catch { /* fall through */ }
    return null;
  }

  private _filterStatic(category?: string): Product[] {
    if (!category) return STATIC_PRODUCTS;
    if (category === 'car-fresheners') {
      return STATIC_PRODUCTS.filter((p) => CAR_FRESHENER_CATEGORIES.includes(p.category));
    }
    return STATIC_PRODUCTS.filter((p) => p.category === category);
  }
}
