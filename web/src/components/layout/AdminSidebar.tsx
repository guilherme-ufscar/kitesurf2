'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Visão Geral',    href: '/admin',                 icon: 'bar_chart' },
  { label: 'Moderação',      href: '/admin/moderacao',       icon: 'gavel' },
  { label: 'Banners',        href: '/admin/banners',         icon: 'ad_units' },
  { label: 'Usuários',       href: '/admin/usuarios',        icon: 'group' },
  { label: 'Anúncios',       href: '/admin/anuncios',        icon: 'sell' },
  { label: 'Planos',         href: '/admin/planos',          icon: 'workspace_premium' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 bg-primary text-on-primary min-h-full flex flex-col">
      <div className="p-unit-lg border-b border-white/10">
        <Link href="/" className="text-xl font-black text-on-primary">KITE360º</Link>
        <div className="text-label-md text-on-primary/60 mt-1 uppercase tracking-wider">Admin</div>
      </div>

      <nav className="flex flex-col py-unit-sm flex-1">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-unit-lg py-3 text-body-md transition-colors',
                active
                  ? 'bg-white/10 text-white font-bold'
                  : 'text-on-primary/70 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon name={item.icon} filled={active} size={20} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-unit-lg border-t border-white/10">
        <Link href="/painel" className="flex items-center gap-3 text-body-md text-on-primary/70 hover:text-white transition-colors">
          <Icon name="arrow_back" size={20} />
          Voltar ao site
        </Link>
      </div>
    </aside>
  )
}
