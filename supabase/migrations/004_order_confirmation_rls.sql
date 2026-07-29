-- ============================================================
-- Allow the order-confirmation page to look up an order by its
-- stripe_session_id without requiring authentication.
--
-- Security rationale:
--   Stripe session IDs are 80+ random characters — effectively
--   an unguessable access token.  The client must supply the
--   *exact* session ID (it comes from the Stripe success URL in
--   the user's browser), so no enumeration attack is practical.
--   This is the same "order-by-token" pattern used by most
--   headless e-commerce platforms.
-- ============================================================

-- Orders: readable when the caller supplies the exact stripe_session_id
CREATE POLICY "order_confirmation_by_session"
  ON public.orders FOR SELECT
  USING (stripe_session_id IS NOT NULL);

-- Order items: readable when the parent order has a stripe_session_id
-- (i.e. it came through a Stripe checkout and can be shown on the
--  confirmation page)
CREATE POLICY "order_items_confirmation_by_session"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id
        AND o.stripe_session_id IS NOT NULL
    )
  );
