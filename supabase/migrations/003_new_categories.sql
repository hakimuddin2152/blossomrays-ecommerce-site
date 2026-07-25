-- Migration 003: Expand product categories
-- Run this in Supabase SQL Editor after 001 and 002

-- Diffusers
INSERT INTO products (id, name, slug, tagline, description, price, compare_at_price, stock, category, is_active, images)
VALUES
  ('b1f1a000-0000-4000-a000-000000000010', 'Aroma Diffuser', 'aroma-diffuser',
   'Fill your space with fragrance',
   'Premium ultrasonic aroma diffuser. Whisper-quiet, auto shut-off, covers up to 300 sq ft.',
   3499, 4999, 50, 'diffuser', true,
   ARRAY['/images/diffuser/placeholder.jpg']),

-- Fragrance Oils
  ('b1f1a000-0000-4000-a000-000000000011', 'Rose Fragrance Oil', 'rose-fragrance-oil',
   'Pure botanical concentrate',
   'Premium rose fragrance oil. Use in diffusers, candles, or DIY products. 10ml.',
   1499, NULL, 80, 'fragrance-oil', true,
   ARRAY['/images/fragrance-oil/placeholder.jpg']),

  ('b1f1a000-0000-4000-a000-000000000016', 'Lavender Fragrance Oil', 'lavender-fragrance-oil',
   'Calming botanical blend',
   'Pure lavender fragrance oil for diffusers and candle-making. 10ml.',
   1499, NULL, 80, 'fragrance-oil', true,
   ARRAY['/images/fragrance-oil/placeholder.jpg']),

-- Essential Oils
  ('b1f1a000-0000-4000-a000-000000000012', 'Lavender Essential Oil', 'lavender-essential-oil',
   'Pure therapeutic grade',
   '100% pure lavender essential oil. Therapeutic grade, steam-distilled. 15ml.',
   1299, NULL, 80, 'essential-oil', true,
   ARRAY['/images/essential-oil/placeholder.jpg']),

  ('b1f1a000-0000-4000-a000-000000000017', 'Peppermint Essential Oil', 'peppermint-essential-oil',
   'Energizing & refreshing',
   '100% pure peppermint essential oil. Therapeutic grade. 15ml.',
   1299, NULL, 80, 'essential-oil', true,
   ARRAY['/images/essential-oil/placeholder.jpg']),

-- Candles
  ('b1f1a000-0000-4000-a000-000000000013', 'Botanical Soy Candle', 'botanical-soy-candle',
   'Hand-poured & long-burning',
   'Hand-poured soy candle with botanical fragrance. Burns up to 50 hours. 8oz.',
   2499, NULL, 40, 'candle', true,
   ARRAY['/images/candle/placeholder.jpg']),

  ('b1f1a000-0000-4000-a000-000000000018', 'Rose Soy Candle', 'rose-soy-candle',
   'Romance in every flicker',
   'Hand-poured rose soy candle. Long-burning, clean-scented. 8oz.',
   2499, NULL, 40, 'candle', true,
   ARRAY['/images/candle/placeholder.jpg']),

-- Perfumes
  ('b1f1a000-0000-4000-a000-000000000014', 'Signature Perfume', 'signature-perfume',
   'Your scent, your identity',
   'Eau de parfum inspired by our signature BlossomRays botanical collection. 50ml.',
   5999, 7499, 30, 'perfume', true,
   ARRAY['/images/perfume/placeholder.jpg']),

-- Ladies Bags
  ('b1f1a000-0000-4000-a000-000000000015', 'Luxury Ladies Bag', 'luxury-ladies-bag',
   'Elegance you can carry',
   'Handcrafted vegan leather tote bag. Spacious, durable, timeless design.',
   8999, 12999, 20, 'ladies-bag', true,
   ARRAY['/images/ladies-bag/placeholder.jpg'])

ON CONFLICT (id) DO NOTHING;
