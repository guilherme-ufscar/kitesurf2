import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-lg'
    const variants = {
      primary:   'bg-primary text-on-primary hover:bg-primary-container',
      secondary: 'bg-secondary-container text-on-secondary-fixed hover:bg-secondary-fixed-dim',
      ghost:     'bg-transparent border border-outline-variant text-on-surface hover:bg-surface-container',
      danger:    'bg-error text-on-error hover:opacity-90',
    }
    const sizes = {
      sm: 'px-3 py-1.5 text-body-md',
      md: 'px-unit-lg py-2 text-body-md',
      lg: 'px-unit-xl py-unit-md text-title-lg',
    }
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
