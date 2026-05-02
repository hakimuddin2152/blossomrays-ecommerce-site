import { cn } from '@/lib/utils/cn'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-body font-medium rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none'

    const variants = {
      primary:
        'text-white bg-plum hover:bg-plum/85 hover:-translate-y-px active:translate-y-0',
      outline:
        'text-plum border border-plum/25 bg-transparent hover:bg-cream-dark hover:border-plum/50 hover:-translate-y-px active:translate-y-0',
      ghost:
        'text-muted hover:text-plum hover:bg-cream-dark',
    }

    const sizes = {
      sm: 'px-5 py-2 text-sm',
      md: 'px-7 py-3 text-base',
      lg: 'px-9 py-4 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button
