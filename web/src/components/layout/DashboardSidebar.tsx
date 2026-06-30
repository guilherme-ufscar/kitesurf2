'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Dashboard',       href: '/painel',             icon: 'dashboard' },
  { label: 'Meus Anúncios',  href: '/painel/anuncios',    icon: 'sell' },
  { label: 'Mensagens',       href: '/mensagens',           icon: 'chat' },
  { label: 'Favoritos',       href: '/favoritos',           icon: 'favorite' },
  { label: 'Avaliações',      href: '/painel/avaliacoes',  icon: 'star' },
  { label: 'Planos',          href: '/planos',              icon: 'workspace_premium' },
  { label: 'Verificação',     href: '/conta/verificacao',  icon: 'verified_user' },
  { label: 'Configurações',   href: '/configuracoes',       icon: 'settings' },
]

interface DashboardSidebarProps {
  userName?: string
  userAvatar?: string
}

export function DashboardSidebar({ userName, userAvatar }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navLinks = NAV.map((item) => {
    const active = pathname === item.href || (item.href !== '/painel' && pathname.startsWith(item.href))
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setOpen(false)}
        className={cn(
          'flex items-center gap-3 px-unit-lg py-3 text-body-md transition-colors',
          active
            ? 'bg-primary/10 text-primary font-bold border-r-2 border-primary'
            : 'text-on-surface-variant hover:bg-surface-container'
        )}
      >
        <Icon name={item.icon} filled={active} size={20} />
        {item.label}
      </Link>
    )
  })

  const logoutBtn = (
    <button
      onClick={() => {
        localStorage.removeItem('kite_access_token')
        localStorage.removeItem('kite_refresh_token')
        window.location.href = '/login'
      }}
      className="flex items-center gap-3 text-body-md text-secondary hover:text-error transition-colors w-full"
    >
      <Icon name="logout" size={20} />
      Sair
    </button>
  )

  return (
    <>
      {/* ── Mobile top bar (in-flow, not fixed) ── */}
      <div className="md:hidden w-full bg-surface-container-lowest border-b border-outline-variant">
        <div className="flex items-center h-14 px-4 gap-3">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg hover:bg-surface-container"
            aria-label="Menu"
          >
            <Icon name={open ? 'close' : 'menu'} size={24} className="text-on-surface" />
          </button>
          <Link href="/" className="text-lg font-black text-primary">KITE360º</Link>
          {userName && (
            <div className="ml-auto w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm overflow-hidden shrink-0">
              {userAvatar
                ? <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                : userName[0].toUpperCase()
              }
            </div>
          )}
        </div>

        {/* Mobile drawer (expands below top bar) */}
        {open && (
          <div className="border-t border-outline-variant bg-surface-container-lowest shadow-lg">
            {userName && (
              <div className="flex items-center gap-3 px-unit-lg py-3 border-b border-outline-variant">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold overflow-hidden shrink-0">
                  {userAvatar
                    ? <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                    : userName[0].toUpperCase()
                  }
                </div>
                <div>
                  <div className="text-body-md font-bold text-on-surface">{userName}</div>
                  <div className="text-label-md text-secondary">Minha Conta</div>
                </div>
              </div>
            )}
            <nav className="flex flex-col py-1">{navLinks}</nav>
            <div className="px-unit-lg py-3 border-t border-outline-variant">{logoutBtn}</div>
          </div>
        )}
      </div>

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-64 shrink-0 bg-surface-container-lowest border-r border-outline-variant min-h-full flex-col">
        <div className="p-unit-lg border-b border-outline-variant">
          <Link href="/" className="text-xl font-black text-primary">KITE360º</Link>
        </div>

        {userName && (
          <div className="flex items-center gap-3 p-unit-lg border-b border-outline-variant">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold overflow-hidden shrink-0">
              {userAvatar
                ? <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                : userName[0].toUpperCase()
              }
            </div>
            <div className="overflow-hidden">
              <div className="text-body-md font-bold text-on-surface truncate">{userName}</div>
              <div className="text-label-md text-secondary">Minha Conta</div>
            </div>
          </div>
        )}

        <nav className="flex flex-col py-unit-sm flex-1">{navLinks}</nav>

        <div className="p-unit-lg border-t border-outline-variant">{logoutBtn}</div>
      </aside>
    </>
  )
}
