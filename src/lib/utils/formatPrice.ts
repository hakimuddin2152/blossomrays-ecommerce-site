/**
 * Converts a price in cents to a formatted string.
 * e.g. 1299 → "$12.99"
 */
export function formatPrice(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100)
}
