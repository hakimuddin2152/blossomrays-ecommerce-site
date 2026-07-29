-- Migration 012: Supabase Storage bucket for product images
--
-- Lets admins upload product photos directly from the admin panel instead of
-- only being able to paste existing image URLs. Images are publicly
-- readable (needed for the storefront) but only admins can upload/replace/
-- delete them.
--
-- Run this in the Supabase SQL Editor after 001-011.

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone (including anonymous storefront visitors) can view product images.
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Only admins can upload new product images.
CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

-- Only admins can replace/rename existing product images.
CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND public.is_admin());

-- Only admins can remove product images.
CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.is_admin());
