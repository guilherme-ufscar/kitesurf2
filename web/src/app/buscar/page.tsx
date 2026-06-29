import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductCard } from '@/components/ui/ProductCard'
import { BannerSlot } from '@/components/ads/BannerSlot'
import type { Listing, PaginatedResponse } from '@/types'
import Link from 'next/link'

interface SearchPageProps {
  searchParams: { q?: string; category?: string; condition?: string; priceMin?: string; priceMax?: string; sortBy?: string; state?: string; page?: string }
}

async function search(params: SearchPageProps['searchParams']): Promise<PaginatedResponse<Listing>> {
  const qs = new URLSearchParams()
  if (params.q)         qs.set('q', params.q)
  if (params.category)  qs.set('category', params.category)
  if (params.condition) qs.set('condition', params.condition)
  if (params.priceMin)  qs.set('priceMin', params.priceMin)
  if (params.priceMax)  qs.set('priceMax', params.priceMax)
  if (params.sortBy)    qs.set('sortBy', params.sortBy)
  if (params.state)     qs.set('state', params.state)
  qs.set('page', params.page ?? '1')
  qs.set('limit', '20')

  try {
    const res = await fetch(`${process.env.INTERNAL_API_URL ?? 'http://api:8000'}/api/listings?${qs}`, { cache: 'no-store' })
    if (!res.ok) throw new Error()
    return await res.json()
  } catch {
    return { data: [], total: 0, page: 1, limit: 20, totalPages: 0 }
  }
}

const CATEGORIES = ['Kitesurf', 'Wingfoil', 'Kitefoil', 'Kitewave', 'Acessórios']
const STATES = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']
const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'newest',    label: 'Mais recentes' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc',label: 'Maior preço' },
]

export default async function BuscarPage({ searchParams }: SearchPageProps) {
  const result = await search(searchParams)

  return (
    <>
      <Header />
      <main className="mt-28 w-full max-w-container mx-auto px-margin-desktop mb-unit-xl">
        <div className="flex gap-gutter">
          {/* Filters sidebar */}
          <aside className="hidden lg:flex flex-col gap-unit-lg w-64 shrink-0">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg">
              <h3 className="text-label-md uppercase tracking-wider text-on-surface-variant mb-unit-md">Categoria</h3>
              <div className="flex flex-col gap-2">
                <Link
                  href={`/buscar?${new URLSearchParams({ ...searchParams, category: '' })}`}
                  className={`text-body-md py-1 ${!searchParams.category ? 'text-primary font-bold' : 'text-secondary hover:text-primary'}`}
                >
                  Todas
                </Link>
                {CATEGORIES.map((c) => (
                  <Link
                    key={c}
                    href={`/buscar?${new URLSearchParams({ ...searchParams, category: c.toLowerCase() })}`}
                    className={`text-body-md py-1 ${searchParams.category === c.toLowerCase() ? 'text-primary font-bold' : 'text-secondary hover:text-primary'}`}
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg">
              <h3 className="text-label-md uppercase tracking-wider text-on-surface-variant mb-unit-md">Condição</h3>
              <div className="flex flex-col gap-2">
                {[['', 'Todos'], ['new', 'Novo'], ['used', 'Usado']].map(([val, label]) => (
                  <label key={val} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="condition"
                      defaultChecked={searchParams.condition === val || (!searchParams.condition && val === '')}
                      className="w-4 h-4 text-primary"
                      onChange={() => {
                        const p = new URLSearchParams(searchParams as Record<string, string>)
                        val ? p.set('condition', val) : p.delete('condition')
                        window?.history?.pushState({}, '', `/buscar?${p}`)
                      }}
                    />
                    <span className="text-body-md text-on-surface">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg">
              <h3 className="text-label-md uppercase tracking-wider text-on-surface-variant mb-unit-md">Preço</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  defaultValue={searchParams.priceMin}
                  className="w-full border border-outline-variant rounded-lg px-2 py-2 text-body-md bg-surface-container-lowest focus:outline-none focus:border-primary"
                />
                <input
                  type="number"
                  placeholder="Max"
                  defaultValue={searchParams.priceMax}
                  className="w-full border border-outline-variant rounded-lg px-2 py-2 text-body-md bg-surface-container-lowest focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg">
              <h3 className="text-label-md uppercase tracking-wider text-on-surface-variant mb-unit-md">Estado</h3>
              <select
                defaultValue={searchParams.state ?? ''}
                className="w-full border border-outline-variant rounded-lg px-3 py-2 text-body-md bg-surface-container-lowest focus:outline-none focus:border-primary"
              >
                <option value="">Todos</option>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-unit-lg flex-wrap gap-3">
              <div>
                <h1 className="text-headline-md font-bold text-on-surface">
                  {searchParams.q ? `Resultados para "${searchParams.q}"` : searchParams.category ? searchParams.category.charAt(0).toUpperCase() + searchParams.category.slice(1) : 'Todos os anúncios'}
                </h1>
                <p className="text-body-md text-secondary">{result.total} anúncios encontrados</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-body-md text-secondary">Ordenar:</label>
                <select
                  defaultValue={searchParams.sortBy ?? 'relevance'}
                  className="border border-outline-variant rounded-lg px-3 py-2 text-body-md bg-surface-container-lowest focus:outline-none focus:border-primary"
                >
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Top banner */}
            <BannerSlot slot="top" className="w-full h-20 mb-unit-lg" />

            {/* Grid */}
            {result.data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-unit-xl gap-4 text-center">
                <span className="material-symbols-outlined text-6xl text-outline-variant">search_off</span>
                <h2 className="text-title-lg font-bold text-on-surface">Nenhum anúncio encontrado</h2>
                <p className="text-body-md text-secondary">Tente outros termos ou remova alguns filtros.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
                {result.data.map((l) => <ProductCard key={l.id} listing={l} />)}
              </div>
            )}

            {/* Pagination */}
            {result.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-unit-xl">
                {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/buscar?${new URLSearchParams({ ...searchParams, page: String(p) })}`}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-body-md border transition-colors ${
                      result.page === p
                        ? 'bg-primary text-on-primary border-primary'
                        : 'border-outline-variant hover:border-primary text-on-surface'
                    }`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
