import { cn } from '@/lib/utils'
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-unit-xs w-full">
        {label && (
          <label htmlFor={inputId} className="text-label-md text-on-surface uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-surface-container-lowest border border-outline-variant rounded-lg',
              'px-unit-md py-unit-md text-body-md text-on-surface placeholder:text-outline',
              'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
              'transition-colors duration-150',
              icon && 'pl-10',
              error && 'border-error',
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-label-md text-error">{error}</span>}
      </div>
    )
  }
)
Input.displayName = 'Input'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-unit-xs w-full">
        {label && (
          <label htmlFor={inputId} className="text-label-md text-on-surface uppercase tracking-wider">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-surface-container-lowest border border-outline-variant rounded-lg',
            'px-unit-md py-unit-md text-body-md text-on-surface',
            'focus:outline-none focus:border-primary',
            error && 'border-error',
            className
          )}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {error && <span className="text-label-md text-error">{error}</span>}
      </div>
    )
  }
)
Select.displayName = 'Select'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-unit-xs w-full">
        {label && (
          <label htmlFor={inputId} className="text-label-md text-on-surface uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-surface-container-lowest border border-outline-variant rounded-lg',
            'px-unit-md py-unit-md text-body-md text-on-surface placeholder:text-outline',
            'focus:outline-none focus:border-primary resize-y',
            error && 'border-error',
            className
          )}
          {...props}
        />
        {error && <span className="text-label-md text-error">{error}</span>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
