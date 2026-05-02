interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: string
  accent?: 'lavender' | 'rose' | 'gold' | 'plum'
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  accent = 'lavender',
}: StatsCardProps) {
  const accentClasses = {
    lavender: 'text-lavender bg-lavender-light',
    rose: 'text-rose bg-rose-light',
    gold: 'text-gold bg-amber-50',
    plum: 'text-plum bg-cream-dark',
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-cream-dark p-6 space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-body text-sm text-muted uppercase tracking-widest">{title}</p>
        {icon && (
          <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${accentClasses[accent]}`}>
            {icon}
          </span>
        )}
      </div>
      <p className="font-display text-3xl font-semibold text-plum">{value}</p>
      {subtitle && <p className="font-body text-xs text-muted">{subtitle}</p>}
    </div>
  )
}
