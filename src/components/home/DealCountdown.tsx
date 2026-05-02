'use client'

import { useState, useEffect } from 'react'

interface Props {
  endDate: string
}

function getTimeLeft(endDate: string) {
  const total = new Date(endDate).getTime() - Date.now()
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days:    Math.floor(total / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((total % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((total % (1000 * 60)) / 1000),
  }
}

const parts = (t: ReturnType<typeof getTimeLeft>) => [
  { value: t.days,    label: 'Days' },
  { value: t.hours,   label: 'Hrs' },
  { value: t.minutes, label: 'Mins' },
  { value: t.seconds, label: 'Secs' },
]

export default function DealCountdown({ endDate }: Props) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(endDate))

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(endDate)), 1000)
    return () => clearInterval(id)
  }, [endDate])

  return (
    <div className="flex items-start gap-1.5">
      {parts(timeLeft).map(({ value, label }, i) => (
        <div key={label} className="flex items-start gap-1.5">
          <div className="flex flex-col items-center">
            <div className="bg-white text-plum font-display text-2xl font-semibold w-[52px] h-[52px] flex items-center justify-center tabular-nums">
              {String(value).padStart(2, '0')}
            </div>
            <span className="font-body text-[9px] tracking-[0.14em] uppercase text-white/50 mt-1">
              {label}
            </span>
          </div>
          {i < 3 && (
            <span className="text-gold font-display text-xl font-semibold leading-[52px]">:</span>
          )}
        </div>
      ))}
    </div>
  )
}
