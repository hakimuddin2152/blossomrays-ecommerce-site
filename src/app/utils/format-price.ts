import type { Currency } from '../services/locale.service';

/**
 * Static, approximate CAD → USD rate used for display purposes only.
 * All charges are still processed in CAD via Stripe regardless of the
 * display currency selected — the USD amount is informational, not a live
 * FX quote.
 */
const USD_PER_CAD = 0.73;

/**
 * Formats a price stored in cents (the store's base currency is always CAD)
 * in the given display currency. Defaults to CAD when omitted.
 */
export function formatPrice(cents: number, currency: Currency = 'CAD'): string {
  const amount = currency === 'USD' ? (cents / 100) * USD_PER_CAD : cents / 100;
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-CA', {
    style: 'currency',
    currency,
  }).format(amount);
}

