'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from './ThemeToggle'
import Image from 'next/image'

const CATEGORIES = [
  { label: 'Home', href: '/' },
  { label: 'Kitesurf', href: '/buscar?category=kitesurf' },
  { label: 'Wingfoil', href: '/buscar?category=wingfoil' },
  { label: 'Kitefoil', href: '/buscar?category=kitefoil' },
  { label: 'Kitewave', href: '/buscar?category=kitewave' },
  { label: 'Acessórios', href: '/buscar?category=acessorios' },
]

interface HeaderProps {
  user?: { id: string; name: string; avatar?: string } | null
  activeCategory?: string
}

export function Header({ user, activeCategory }: HeaderProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function onSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) router.push(`/buscar?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest border-b border-outline-variant">
      <div className="flex flex-col w-full max-w-container mx-auto px-margin-desktop">
        {/* Main row */}
        <div className="flex items-center justify-between py-unit-sm gap-gutter">
          {/* Logo */}
          <Link href="/" className="text-2xl font-black text-primary shrink-0 tracking-tight">
            KITE360º
          </Link>

          {/* Search */}
          <form onSubmit={onSearch} className="flex-1 max-w-3xl relative">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={20} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar kites, pranchas, wings..."
              className="w-full h-10 pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-lg text-body-md focus:outline-none focus:border-primary transition-colors"
            />
          </form>

          {/* Actions */}
          <div className="flex items-center gap-unit-sm">
            <ThemeToggle />

            {user ? (
              <>
                <Link href="/mensagens" className="p-2 hover:bg-surface-container rounded-full transition-colors">
                  <Icon name="mail" size={22} className="text-secondary" />
                </Link>
                <Link href="/painel/anuncios/novo">
                  <Button size="sm">Anunciar</Button>
                </Link>
                <Link href="/painel" className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant">
                  {user.avatar
                    ? <Image src={user.avatar} alt={user.name} width={36} height={36} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm">
                        {user.name[0].toUpperCase()}
                      </div>
                  }
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Entrar</Button>
                </Link>
                <Link href="/cadastro">
                  <Button size="sm">Anunciar</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Category nav */}
        <nav className="flex items-center gap-unit-lg h-10 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`text-body-md whitespace-nowrap py-2 transition-colors ${
                activeCategory === cat.label
                  ? 'active-nav-link'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
