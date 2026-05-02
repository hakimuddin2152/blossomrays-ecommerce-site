-- ============================================================
-- BlossomRays: Initial Database Schema
-- Run in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  email       TEXT NOT NULL,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  tagline           TEXT,
  description       TEXT,
  price             INTEGER NOT NULL, -- in cents (e.g. 1299 = $12.99)
  compare_at_price  INTEGER,          -- strikethrough price in cents
  stock             INTEGER NOT NULL DEFAULT 0,
  images            TEXT[] NOT NULL DEFAULT '{}',
  category          TEXT NOT NULL CHECK (category IN ('lavender', 'rose', 'millennium')),
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  seo_title         TEXT,
  seo_description   TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed the products
INSERT INTO public.products (name, slug, tagline, description, price, compare_at_price, stock, category, images, seo_title, seo_description)
VALUES
  (
    'Lavender Car Air Freshener',
    'lavender-car-air-freshener',
    'Calm your commute',
    'Transform every drive into a serene escape. Our Lavender Car Air Freshener releases a gentle, long-lasting botanical lavender fragrance that soothes the mind and freshens your car naturally. Crafted with premium fragrance oils, an elegant wooden cap, and a double-sealed 8ml glass bottle — leak-proof and beautifully designed. Proudly made in Canada.',
    1799,
    NULL,
    100,
    'lavender',
    ARRAY[
      '/images/lavender/1.jpg',
      '/images/lavender/2.jpg',
      '/images/lavender/3.jpg',
      '/images/lavender/4.jpg',
      '/images/lavender/5.jpg',
      '/images/lavender/6.jpg',
      '/images/lavender/7.jpg',
      '/images/lavender/8.jpg'
    ],
    'Lavender Car Air Freshener | BlossomRays',
    'Premium botanical lavender car air freshener. Alcohol-free, 120+ day lasting, made in Canada. Free shipping over $30.'
  ),
  (
    'Rose Car Air Freshener',
    'rose-car-air-freshener',
    'Bloom on the road',
    'Bring the romance of a rose garden into your car. Our Fresh Rose Car Air Freshener delivers a rich, authentic floral scent that lingers beautifully throughout the day. Alcohol-free formula with a gorgeous wooden cap and vent clip design — use it as a hanging freshener or clip it to your vent. Proudly made in Canada.',
    1799,
    NULL,
    100,
    'rose',
    ARRAY[
      '/images/rose/Main_Image_Rose.jpg',
      '/images/rose/Main_Image.jpeg',
      '/images/rose/Main_Image_With_Prod_Of_Canada.jpg',
      '/images/rose/Dual_Ways.jpg',
      '/images/rose/Fragrance_Details.jpeg',
      '/images/rose/MultiUses.jpg',
      '/images/rose/Whats_In_The_Pack.jpeg',
      '/images/rose/Main_Without_Rose.jpeg'
    ],
    'Fresh Rose Car Air Freshener | BlossomRays',
    'Premium botanical rose car air freshener. Alcohol-free, 120+ day lasting, made in Canada. Free shipping over $30.'
  ),
  (
    'Millennium Car Air Freshener',
    'millennium-car-air-freshener',
    'A scent beyond time',
    'Elevate your drive with the signature Millennium fragrance — a refined, mysterious blend that transforms your daily commute. The same premium wooden cap construction, double-sealed 8ml glass bottle, and versatile vent clip or hanging installation. Long-lasting, alcohol-free, and proudly made in Canada.',
    1799,
    NULL,
    100,
    'millennium',
    ARRAY[
      '/images/millenium/1.jpg',
      '/images/millenium/2.jpg',
      '/images/millenium/3.jpg',
      '/images/millenium/4.jpg',
      '/images/millenium/5.jpg',
      '/images/millenium/6.jpg',
      '/images/millenium/7.jpg',
      '/images/millenium/8.jpg'
    ],
    'Millennium Car Air Freshener | BlossomRays',
    'Premium Millennium scent car air freshener. Alcohol-free, 120+ day lasting, made in Canada. Free shipping over $30.'
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_email               TEXT,
  status                    TEXT NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  subtotal                  INTEGER NOT NULL,  -- cents
  shipping_cost             INTEGER NOT NULL DEFAULT 499,  -- $4.99
  total                     INTEGER NOT NULL,  -- cents
  stripe_payment_intent_id  TEXT UNIQUE,
  stripe_session_id         TEXT UNIQUE,
  shipping_address          JSONB NOT NULL,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  unit_price  INTEGER NOT NULL,  -- price in cents at time of purchase
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- UPDATED_AT TRIGGER (reusable)
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- PRODUCTS policies
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ORDERS policies
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Service role can insert orders"
  ON public.orders FOR INSERT
  WITH CHECK (TRUE);  -- Webhook uses service role key

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ORDER ITEMS policies
CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON public.orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
