import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BannerSlot } from '@/components/ads/BannerSlot'
import { ProductCard } from '@/components/ui/ProductCard'
import type { Listing } from '@/types'
import { cookies } from 'next/headers'

async function getFeaturedListings(): Promise<Listing[]> {
  try {
    const res = await fetch(`${process.env.INTERNAL_API_URL ?? 'http://api:8000'}/api/listings?boosted=true&limit=4`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return MOCK_LISTINGS.slice(0, 4)
    const data = await res.json()
    return data.data ?? MOCK_LISTINGS.slice(0, 4)
  } catch { return MOCK_LISTINGS.slice(0, 4) }
}

async function getRecentListings(): Promise<Listing[]> {
  try {
    const res = await fetch(`${process.env.INTERNAL_API_URL ?? 'http://api:8000'}/api/listings?sortBy=newest&limit=8`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return MOCK_LISTINGS
    const data = await res.json()
    return data.data ?? MOCK_LISTINGS
  } catch { return MOCK_LISTINGS }
}

export default async function HomePage() {
  const [featured, recent] = await Promise.all([getFeaturedListings(), getRecentListings()])

  return (
    <>
      <Header activeCategory="Home" />

      <main className="mt-28 w-full max-w-container mx-auto px-margin-desktop mb-unit-xl">
        {/* Hero Banner */}
        <section className="mb-unit-xl">
          <div className="relative w-full h-[280px] md:h-[320px] rounded-xl overflow-hidden shadow-sm bg-primary">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/20 flex items-center p-unit-xl">
              <div className="max-w-md text-on-primary">
                <h1 className="text-headline-lg font-black mb-unit-sm leading-tight">
                  Alta performance<br />no mar.
                </h1>
                <p className="text-body-lg opacity-90 mb-unit-lg">
                  O marketplace definitivo para kitesurf, wingfoil e esportes aquáticos.
                  Compre e venda com segurança.
                </p>
                <a
                  href="/buscar"
                  className="inline-flex items-center gap-2 bg-on-primary text-primary font-bold px-unit-lg py-3 rounded-lg hover:opacity-90 transition-opacity text-body-md"
                >
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  Explorar equipamentos
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="flex gap-gutter">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Featured / Sponsored */}
            <section className="mb-unit-xl">
              <div className="flex items-center justify-between mb-unit-md">
                <h2 className="text-headline-md font-bold text-primary">Anúncios em Destaque</h2>
                <a href="/buscar?boosted=true" className="text-primary font-bold text-body-md hover:underline">Ver tudo</a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
                {featured.map((l) => <ProductCard key={l.id} listing={l} />)}
              </div>
            </section>

            {/* Recent */}
            <section>
              <div className="flex items-center justify-between mb-unit-md">
                <h2 className="text-headline-md font-bold text-primary">Recém-anunciados</h2>
                <a href="/buscar?sortBy=newest" className="text-primary font-bold text-body-md hover:underline">Ver tudo</a>
              </div>

              {/* Between-listings banner */}
              <BannerSlot slot="between-listings" className="w-full h-20 mb-unit-md hidden md:block" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
                {recent.map((l) => <ProductCard key={l.id} listing={l} />)}
              </div>
            </section>
          </div>

          {/* Sidebar banner */}
          <aside className="hidden lg:block w-[200px] shrink-0">
            <div className="sticky top-32 w-full h-[600px]">
              <BannerSlot slot="sidebar" className="w-full h-full" />
            </div>
          </aside>
        </div>

        {/* Categories section */}
        <section className="mt-unit-xl">
          <h2 className="text-headline-md font-bold text-primary mb-unit-lg">Explorar por categoria</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-unit-md">
            {[
              { label: 'Kitesurf',  icon: 'air',          category: 'kitesurf' },
              { label: 'Wingfoil', icon: 'surfing',       category: 'wingfoil' },
              { label: 'Kitefoil', icon: 'tsunami',       category: 'kitefoil' },
              { label: 'Kitewave', icon: 'waves',         category: 'kitewave' },
              { label: 'Acessórios', icon: 'build',       category: 'acessorios' },
            ].map((cat) => (
              <a
                key={cat.category}
                href={`/buscar?category=${cat.category}`}
                className="flex flex-col items-center gap-3 p-unit-lg bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary hover:shadow-lift transition-all group"
              >
                <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <span className="text-body-md font-bold text-on-surface">{cat.label}</span>
              </a>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

// ── Mock data (used as fallback when API is down) ──────────────────────────
const MOCK_LISTINGS: Listing[] = Array.from({ length: 8 }, (_, i) => ({
  id: `mock-${i}`,
  title: ['Duotone Rebel SLS 10m 2024', 'Core Nexus 3 12m', 'North Orbit 9m 2023', 'Wing F-One Strike V3', 'Cabrinha Switchblade 12m', 'Prancha Wing Foil Naish 85L', 'Trapézio ION Ripper', 'Prancha Bidirecional Liquid Force'][i % 8],
  description: 'Equipamento em excelente estado.',
  price: [12500, 8900, 7200, 6450, 5400, 4800, 1200, 2900][i % 8],
  category: 'kitesurf',
  condition: i % 2 === 0 ? 'new' : 'used',
  status: 'active',
  images: [{ id: '1', url: '/placeholder-product.svg', thumb: '/placeholder-product.svg', order: 0 }],
  seller: { id: `seller-${i}`, name: 'Vendedor', isVerified: i % 3 === 0, rating: 4.8, reviewCount: 23 },
  city: ['Florianópolis', 'Fortaleza', 'Ilhabela', 'Jericoacoara', 'Cumbuco', 'Preá', 'Rio de Janeiro', 'Araruama'][i % 8],
  state: ['SC', 'CE', 'SP', 'CE', 'CE', 'CE', 'RJ', 'RJ'][i % 8],
  isBoosted: i < 4,
  viewCount: Math.floor(Math.random() * 200),
  favoriteCount: Math.floor(Math.random() * 50),
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
}))
