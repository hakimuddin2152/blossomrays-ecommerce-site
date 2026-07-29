-- ============================================================
-- Migration 005: Clean up bad/empty orders created before
-- the metadata webhook fix (August 2025).
--
-- These orders have total = 0 and no order_items because the
-- webhook was not storing cart data in Stripe metadata yet.
-- They cannot be repaired — delete them so the account page
-- does not show ghost orders with $0 totals.
-- ============================================================

-- Delete order_items first (FK constraint), then the order.
-- Replace the UUID below with any additional bad order IDs if needed.

DELETE FROM public.order_items
WHERE order_id IN (
  SELECT id FROM public.orders
  WHERE total = 0
    AND NOT EXISTS (
      SELECT 1 FROM public.order_items oi WHERE oi.order_id = orders.id
    )
);

DELETE FROM public.orders
WHERE total = 0
  AND NOT EXISTS (
    SELECT 1 FROM public.order_items oi WHERE oi.order_id = orders.id
  );

-- Verify nothing was missed
SELECT id, total, status, created_at
FROM public.orders
ORDER BY created_at DESC
LIMIT 10;
