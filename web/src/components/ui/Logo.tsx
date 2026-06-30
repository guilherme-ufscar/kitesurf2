import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  /** Força uma variante específica; por padrão alterna conforme o tema */
  variant?: 'auto' | 'azul' | 'branco'
  /** Altura do emblema em px */
  size?: number
  /** Mostra o wordmark "KITE360º" ao lado */
  withWordmark?: boolean
  href?: string | null
  className?: string
  wordmarkClassName?: string
}

export function Logo({
  variant = 'auto',
  size = 36,
  withWordmark = false,
  href = '/',
  className,
  wordmarkClassName,
}: LogoProps) {
  const w = Math.round((size * 3474) / 4096)

  const emblem =
    variant === 'azul' ? (
      <Image src="/imagens/logo-azul.svg" alt="KITE360º" width={w} height={size} priority />
    ) : variant === 'branco' ? (
      <Image src="/imagens/logo-branco.svg" alt="KITE360º" width={w} height={size} priority />
    ) : (
      <>
        <Image src="/imagens/logo-azul.svg" alt="KITE360º" width={w} height={size} priority className="block dark:hidden" />
        <Image src="/imagens/logo-branco.svg" alt="KITE360º" width={w} height={size} priority className="hidden dark:block" />
      </>
    )

  const content = (
    <span className={cn('inline-flex items-center gap-2 shrink-0', className)}>
      {emblem}
      {withWordmark && (
        <span className={cn('text-2xl font-black text-primary tracking-tight', wordmarkClassName)}>
          KITE360º
        </span>
      )}
    </span>
  )

  if (href === null) return content
  return <Link href={href} aria-label="KITE360º — início">{content}</Link>
}
