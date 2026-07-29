-- ============================================================
-- BlossomRays: Legal consent tracking (cookies + terms of sale)
-- Run in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.legal_consents (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   TEXT NOT NULL,
  user_id      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  kind         TEXT NOT NULL CHECK (kind IN ('cookies', 'terms_of_sale')),
  choice       TEXT NOT NULL, -- 'accepted_all' | 'necessary_only' | 'customized' | 'agreed'
  categories   JSONB,          -- e.g. {"necessary":true,"analytics":true,"marketing":false}
  country      TEXT,           -- 'CA' | 'US'
  language     TEXT,           -- 'en' | 'fr'
  user_agent   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_legal_consents_session ON public.legal_consents(session_id);
CREATE INDEX IF NOT EXISTS idx_legal_consents_kind ON public.legal_consents(kind);

ALTER TABLE public.legal_consents ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous shoppers) can record their own consent event.
-- This is an append-only audit log — there is no UPDATE/DELETE policy.
DROP POLICY IF EXISTS "Anyone can record consent" ON public.legal_consents;
CREATE POLICY "Anyone can record consent"
  ON public.legal_consents FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read the consent log (uses the existing is_admin() helper
-- from 002_fix_rls_recursion.sql — avoids recursive profile lookups).
DROP POLICY IF EXISTS "Admins can view consent log" ON public.legal_consents;
CREATE POLICY "Admins can view consent log"
  ON public.legal_consents FOR SELECT
  TO authenticated
  USING (public.is_admin());
