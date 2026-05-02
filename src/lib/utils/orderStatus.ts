import type { OrderStatus } from '@/types'

interface StatusConfig {
  label: string
  color: string        // Tailwind bg + text classes
  dotColor: string     // Tailwind text class for dot
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  pending: {
    label: 'Pending',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    dotColor: 'text-amber-500',
  },
  paid: {
    label: 'Paid',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    dotColor: 'text-blue-500',
  },
  shipped: {
    label: 'Shipped',
    color: 'bg-lavender-light text-lavender-dark border-lavender',
    dotColor: 'text-lavender',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: 'text-emerald-500',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-50 text-red-700 border-red-200',
    dotColor: 'text-red-500',
  },
}

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['paid', 'cancelled'],
  paid: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
}

export function getStatusConfig(status: OrderStatus): StatusConfig {
  return ORDER_STATUS_CONFIG[status]
}

export function getNextStatuses(current: OrderStatus): OrderStatus[] {
  return ORDER_STATUS_TRANSITIONS[current]
}
