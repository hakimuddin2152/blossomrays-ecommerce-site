import { cn } from '@/lib/utils/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export default function Card({
  hover = true,
  padding = 'md',
  className,
  children,
  ...props
}: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-soft border border-cream-dark',
        hover && 'transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1',
        paddings[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
