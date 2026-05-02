import { formatPrice } from '@/lib/utils/formatPrice'

const SHIPPING_COST = 499 // $4.99
const FREE_SHIPPING_THRESHOLD = 3000 // $30.00

interface CartSummaryProps {
  subtotal: number
  showFreeShippingNote?: boolean
}

export default function CartSummary({
  subtotal,
  showFreeShippingNote = true,
}: CartSummaryProps) {
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + shipping
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal

  return (
    <div className="space-y-3 font-body text-sm">
      {showFreeShippingNote && subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
        <div className="bg-lavender-light text-lavender-dark rounded-xl px-4 py-2.5 text-xs font-medium">
          Add {formatPrice(remaining)} more for free shipping! 🎉
        </div>
      )}

      <div className="flex justify-between text-muted">
        <span>Subtotal</span>
        <span className="font-medium text-plum">{formatPrice(subtotal)}</span>
      </div>

      <div className="flex justify-between text-muted">
        <span>Shipping</span>
        <span className={shipping === 0 ? 'text-emerald-600 font-medium' : 'font-medium text-plum'}>
          {shipping === 0 ? 'FREE' : formatPrice(shipping)}
        </span>
      </div>

      <div className="flex justify-between pt-3 border-t border-cream-dark font-semibold text-plum text-base">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  )
}

export { SHIPPING_COST, FREE_SHIPPING_THRESHOLD }
