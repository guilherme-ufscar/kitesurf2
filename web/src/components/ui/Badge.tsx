import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'new' | 'used' | 'sponsored' | 'verified' | 'pending' | 'success' | 'error'
  className?: string
}

const variants = {
  new:       'bg-tertiary-fixed text-on-tertiary-fixed',
  used:      'bg-secondary-container/60 text-on-secondary-fixed-variant',
  sponsored: 'bg-secondary-container text-on-secondary-fixed text-[10px] font-bold uppercase tracking-wider',
  verified:  'bg-primary/10 text-primary',
  pending:   'bg-surface-container-high text-on-surface-variant',
  success:   'bg-green-100 text-green-800',
  error:     'bg-error-container text-on-error-container',
}

export function Badge({ children, variant = 'pending', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-label-md font-semibold', variants[variant], className)}>
      {children}
    </span>
  )
}
