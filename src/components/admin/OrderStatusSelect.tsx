'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getNextStatuses, getStatusConfig } from '@/lib/utils/orderStatus'
import { cn } from '@/lib/utils/cn'
import type { OrderStatus } from '@/types'

interface OrderStatusSelectProps {
  orderId: string
  currentStatus: OrderStatus
}

export default function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const router = useRouter()
  const [status, setStatus] = useState<OrderStatus>(currentStatus)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const nextStatuses = getNextStatuses(status)

  const handleUpdate = async (newStatus: OrderStatus) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        const json = await res.json()
        setError(json.error ?? 'Failed to update status')
        return
      }

      setStatus(newStatus)
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const config = getStatusConfig(status)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className={cn('badge text-sm', config.color)}>
          <span className={cn('w-2 h-2 rounded-full bg-current', config.dotColor)} />
          {config.label}
        </span>
        {loading && <span className="font-body text-xs text-muted animate-pulse">Updating...</span>}
      </div>

      {nextStatuses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {nextStatuses.map((next) => (
            <button
              key={next}
              onClick={() => handleUpdate(next)}
              disabled={loading}
              className={cn(
                'px-4 py-2 rounded-full font-body text-sm font-medium border transition-all duration-200 disabled:opacity-50',
                next === 'cancelled'
                  ? 'border-red-200 text-red-600 hover:bg-red-50'
                  : 'border-lavender/30 text-lavender-dark hover:bg-lavender-light',
              )}
            >
              → Mark as {getStatusConfig(next).label}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="font-body text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
