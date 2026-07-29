-- Migration 008: Align car-freshener product UUIDs with STATIC_PRODUCTS
--
-- Migration 001 inserted the three car air fresheners without explicit UUIDs,
-- so Postgres assigned auto-generated IDs.  The Angular frontend uses hardcoded
-- UUIDs in STATIC_PRODUCTS (and the Netlify TRUSTED_PRODUCTS fallback list)
-- because getProductBySlug() returns the static object before hitting the DB.
-- When a user checks out, the cart carries the static UUID.  The webhook then
-- tries to insert order_items with that UUID, which fails the FK constraint
-- (products.id doesn't contain the static UUID) — silently, because the webhook
-- logs the error but still returns 200.  Result: orders created, items missing.
--
-- This migration reassigns the three rows to their canonical UUIDs.
-- order_items is empty at the time of writing so no FK references exist.
-- The UPDATE inside the DO block is guarded against re-running (idempotent).

DO $$
DECLARE
  v_old uuid;
BEGIN

  -- ── Rose Car Air Freshener ─────────────────────────────────────────────────
  SELECT id INTO v_old FROM public.products
    WHERE slug = 'rose-car-air-freshener'
      AND id <> 'b1f1a000-0000-4000-a000-000000000001';

  IF v_old IS NOT NULL THEN
    -- Safety net: migrate any existing order_items (should be none)
    UPDATE public.order_items
      SET product_id = 'b1f1a000-0000-4000-a000-000000000001'
      WHERE product_id = v_old;
    DELETE FROM public.products WHERE id = v_old;
  END IF;

  -- ── Lavender Car Air Freshener ─────────────────────────────────────────────
  SELECT id INTO v_old FROM public.products
    WHERE slug = 'lavender-car-air-freshener'
      AND id <> 'b1f1a000-0000-4000-a000-000000000002';

  IF v_old IS NOT NULL THEN
    UPDATE public.order_items
      SET product_id = 'b1f1a000-0000-4000-a000-000000000002'
      WHERE product_id = v_old;
    DELETE FROM public.products WHERE id = v_old;
  END IF;

  -- ── Millennium Car Air Freshener ───────────────────────────────────────────
  SELECT id INTO v_old FROM public.products
    WHERE slug = 'millennium-car-air-freshener'
      AND id <> 'b1f1a000-0000-4000-a000-000000000003';

  IF v_old IS NOT NULL THEN
    UPDATE public.order_items
      SET product_id = 'b1f1a000-0000-4000-a000-000000000003'
      WHERE product_id = v_old;
    DELETE FROM public.products WHERE id = v_old;
  END IF;

END $$;

-- Re-insert with canonical UUIDs (no-op if already correct after the DO block)
INSERT INTO public.products (id, name, slug, tagline, description, price, compare_at_price, stock, category, images, is_active, seo_title, seo_description)
VALUES
  (
    'b1f1a000-0000-4000-a000-000000000001',
    'Rose Car Air Freshener',
    'rose-car-air-freshener',
    'Bloom on the road',
    'Bring the romance of a rose garden into your car. Our Fresh Rose Car Air Freshener delivers a rich, authentic floral scent that lingers beautifully throughout the day. Alcohol-free formula with a gorgeous wooden cap and vent clip design — use it as a hanging freshener or clip it to your vent. Proudly made in Canada.',
    1799, NULL, 100, 'rose',
    ARRAY['/images/rose/Main_Image_Rose.jpg', '/images/rose/Main_Image.jpeg', '/images/rose/Main_Image_With_Prod_Of_Canada.jpg', '/images/rose/Main_Without_Rose.jpeg'],
    true,
    'Fresh Rose Car Air Freshener | BlossomRays',
    'Premium botanical rose car air freshener. Alcohol-free, 120+ day lasting, made in Canada. Free shipping over $30.'
  ),
  (
    'b1f1a000-0000-4000-a000-000000000002',
    'Lavender Car Air Freshener',
    'lavender-car-air-freshener',
    'Calm your commute',
    'Transform every drive into a serene escape. Our Lavender Car Air Freshener releases a gentle, long-lasting botanical lavender fragrance that soothes the mind and freshens your car naturally. Crafted with premium fragrance oils, an elegant wooden cap, and a double-sealed 8ml glass bottle — leak-proof and beautifully designed. Proudly made in Canada.',
    1799, NULL, 100, 'lavender',
    ARRAY['/images/lavender/1.jpg', '/images/lavender/2.jpg', '/images/lavender/3.jpg', '/images/lavender/4.jpg', '/images/lavender/5.jpg', '/images/lavender/6.jpg', '/images/lavender/7.jpg', '/images/lavender/8.jpg'],
    true,
    'Lavender Car Air Freshener | BlossomRays',
    'Premium botanical lavender car air freshener. Alcohol-free, 120+ day lasting, made in Canada. Free shipping over $30.'
  ),
  (
    'b1f1a000-0000-4000-a000-000000000003',
    'Millennium Car Air Freshener',
    'millennium-car-air-freshener',
    'A scent beyond time',
    'Experience the ultimate luxury fragrance for your car. Our Millennium Car Air Freshener combines warm amber, sandalwood and subtle vanilla in a timeless, sophisticated scent. Alcohol-free, long-lasting 120+ days, with a premium wooden cap. Handcrafted in Canada.',
    1799, NULL, 100, 'millennium',
    ARRAY['/images/millenium/1.jpg', '/images/millenium/2.jpg', '/images/millenium/3.jpg', '/images/millenium/4.jpg', '/images/millenium/5.jpg', '/images/millenium/6.jpg', '/images/millenium/7.jpg', '/images/millenium/8.jpg'],
    true,
    'Millennium Car Air Freshener | BlossomRays',
    'Premium botanical millennium car air freshener. Alcohol-free, 120+ day lasting, made in Canada. Free shipping over $30.'
  )
ON CONFLICT (id) DO NOTHING;
