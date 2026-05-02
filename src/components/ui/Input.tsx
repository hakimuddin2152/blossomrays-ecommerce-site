import { cn } from '@/lib/utils/cn'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-body font-medium text-plum"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'input-field',
            error && 'border-red-400 focus:ring-red-400/40 focus:border-red-400',
            className,
          )}
          {...props}
        />
        {error && (
          <p className="text-sm font-body text-red-600">{error}</p>
        )}
        {hint && !error && (
          <p className="text-sm font-body text-muted">{hint}</p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
