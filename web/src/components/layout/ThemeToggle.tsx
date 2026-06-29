'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Icon } from '@/components/ui/Icon'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <div className="w-9 h-9" />

  const isDark = theme === 'dark'
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-2 hover:bg-surface-container rounded-full transition-colors"
      aria-label="Alternar tema"
    >
      <Icon name={isDark ? 'light_mode' : 'dark_mode'} size={22} className="text-secondary" />
    </button>
  )
}
