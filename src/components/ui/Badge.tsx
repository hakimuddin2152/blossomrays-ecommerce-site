import { cn } from '@/lib/utils/cn'
import type { OrderStatus } from '@/types'
import { getStatusConfig } from '@/lib/utils/orderStatus'

interface BadgeProps {
  children?: React.ReactNode
  className?: string
  status?: OrderStatus
  variant?: 'lavender' | 'rose' | 'gold' | 'success' | 'muted'
}

export default function Badge({
  children,
  className,
  status,
  variant,
}: BadgeProps) {
  if (status) {
    const config = getStatusConfig(status)
    return (
      <span className={cn('badge', config.color, className)}>
        <span className={cn('w-1.5 h-1.5 rounded-full bg-current', config.dotColor)} />
        {config.label}
      </span>
    )
  }

  const variants = {
    lavender: 'bg-lavender-light text-lavender-dark border-lavender/30',
    rose: 'bg-rose-light text-rose-dark border-rose/30',
    gold: 'bg-amber-50 text-gold border-gold/30',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    muted: 'bg-cream-dark text-muted border-cream-dark',
  }

  return (
    <span
      className={cn(
        'badge',
        variant ? variants[variant] : 'bg-cream-dark text-muted border-cream-dark',
        className,
      )}
    >
      {children}
    </span>
  )
}
