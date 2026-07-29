-- Migration 009: Fix broken Rose main image reference
--
-- The images array for the Rose Car Air Freshener referenced
-- '/images/rose/Main_Image_Rose.jpg' (.jpg), which does not exist on disk —
-- only '/images/rose/Main_Image_Rose.jpeg' (.jpeg) does. This broken first
-- image made the product card / gallery show a broken image or the wrong
-- fallback on the /products listing page (which reads from this table),
-- out of sync with the frontend's STATIC_PRODUCTS fallback data.
--
-- This aligns the DB row with STATIC_PRODUCTS: Main_Image.jpeg first.

UPDATE public.products
SET images = ARRAY[
  '/images/rose/Main_Image.jpeg',
  '/images/rose/Main_Image_Rose1.jpg',
  '/images/rose/Dual_Ways.jpg',
  '/images/rose/Fragrance_Details.jpeg',
  '/images/rose/MultiUses.jpg',
  '/images/rose/Whats_In_The_Pack.jpeg',
  '/images/rose/Main_Image_With_Prod_Of_Canada.jpg',
  '/images/rose/Manual.jpeg'
]
WHERE slug = 'rose-car-air-freshener';
