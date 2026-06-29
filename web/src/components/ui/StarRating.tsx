import { Icon } from './Icon'

interface StarRatingProps {
  value: number
  max?: number
  size?: number
}

export function StarRating({ value, max = 5, size = 16 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Icon
          key={i}
          name="star"
          filled={i < Math.round(value)}
          size={size}
          className={i < Math.round(value) ? 'text-amber-400' : 'text-outline-variant'}
        />
      ))}
    </div>
  )
}
