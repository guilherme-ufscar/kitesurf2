'use client'
import { useEffect, useState } from 'react'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { ProductCard } from '@/components/ui/ProductCard'
import { Icon } from '@/components/ui/Icon'
import { favoritesApi, authApi } from '@/lib/api'
import type { Listing, User } from '@/types'
import Link from 'next/link'

export default function FavoritosPage() {
  const [user, setUser] = useState<User | null>(null)
  const [favorites, setFavorites] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([authApi.me(), favoritesApi.list()])
      .then(([u, f]) => { setUser(u.data); setFavorites(f.data.data ?? []) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar userName={user?.name} userAvatar={user?.avatar} />

      <main className="flex-1 p-unit-xl overflow-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-headline-lg font-bold text-on-surface mb-unit-xl">Favoritos</h1>

          {loading ? (
            <div className="flex items-center justify-center py-unit-xl">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-unit-xl gap-4 text-center">
              <Icon name="favorite" size={64} className="text-outline-variant" />
              <h2 className="text-title-lg font-bold text-on-surface">Nenhum favorito ainda</h2>
              <p className="text-body-md text-secondary">Salve anúncios interessantes para acompanhar depois.</p>
              <Link href="/buscar" className="inline-flex items-center gap-2 bg-primary text-on-primary font-bold px-unit-lg py-3 rounded-lg hover:bg-primary-container transition-colors text-body-md">
                <Icon name="search" size={18} />
                Explorar anúncios
              </Link>
            </div>
          ) : (
            <>
              <p className="text-body-md text-secondary mb-unit-lg">{favorites.length} anúncios favoritados</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
                {favorites.map((l) => <ProductCard key={l.id} listing={{ ...l, isFavorited: true }} />)}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
