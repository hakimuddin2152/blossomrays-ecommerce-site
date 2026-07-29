-- Migration 011: Product translations (bilingual product content)
--
-- Adds a per-language override table for product display fields so admins
-- can maintain a French version of each product's name/tagline/description/
-- SEO fields without touching the canonical (English) row in `products`.
-- Any field left NULL/blank falls back to the English value at read time.
--
-- Run this in the Supabase SQL Editor after 001-010.

CREATE TABLE IF NOT EXISTS public.product_translations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id        UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  language          TEXT NOT NULL CHECK (language IN ('fr')),
  name              TEXT,
  tagline           TEXT,
  description       TEXT,
  seo_title         TEXT,
  seo_description   TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, language)
);

CREATE INDEX IF NOT EXISTS idx_product_translations_product_id
  ON public.product_translations(product_id);

ALTER TABLE public.product_translations ENABLE ROW LEVEL SECURITY;

-- Storefront (anonymous + authenticated) can read all translations — they're
-- only ever joined against already-public, active products.
CREATE POLICY "Anyone can view product translations"
  ON public.product_translations FOR SELECT
  USING (true);

-- Only admins can create/edit/delete translations, reusing the existing
-- public.is_admin() helper from migration 002.
CREATE POLICY "Admins can manage product translations"
  ON public.product_translations FOR ALL
  USING (public.is_admin());
