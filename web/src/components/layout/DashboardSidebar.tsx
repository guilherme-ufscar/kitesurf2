'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Dashboard',        href: '/painel',                    icon: 'dashboard' },
  { label: 'Meus Anúncios',   href: '/painel/anuncios',           icon: 'sell' },
  { label: 'Mensagens',        href: '/mensagens',                  icon: 'chat' },
  { label: 'Favoritos',        href: '/favoritos',                  icon: 'favorite' },
  { label: 'Avaliações',       href: '/painel/avaliacoes',         icon: 'star' },
  { label: 'Planos',           href: '/planos',                     icon: 'workspace_premium' },
  { label: 'Verificação',      href: '/conta/verificacao',         icon: 'verified_user' },
  { label: 'Configurações',    href: '/configuracoes',              icon: 'settings' },
]

interface DashboardSidebarProps {
  userName?: string
  userAvatar?: string
}

export function DashboardSidebar({ userName, userAvatar }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 bg-surface-container-lowest border-r border-outline-variant min-h-full flex flex-col">
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

      <nav className="flex flex-col py-unit-sm flex-1">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== '/painel' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
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
        })}
      </nav>

      <div className="p-unit-lg border-t border-outline-variant">
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
      </div>
    </aside>
  )
}
