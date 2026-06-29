'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductCard } from '@/components/ui/ProductCard'
import { StarRating } from '@/components/ui/StarRating'
import { Icon } from '@/components/ui/Icon'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ReportModal } from '@/components/report/ReportModal'
import { usersApi, listingsApi, reviewsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { User, Listing, Review } from '@/types'
import toast from 'react-hot-toast'

export default function VendedorPage() {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [reportOpen, setReportOpen] = useState(false)

  useEffect(() => {
    Promise.all([
      usersApi.profile(id),
      listingsApi.list({ seller: id, status: 'active', limit: 8 }),
      reviewsApi.forUser(id),
    ]).then(([u, l, r]) => {
      setUser(u.data)
      setListings(l.data.data ?? [])
      setReviews(r.data.data ?? [])
    }).catch(() => toast.error('Perfil não encontrado.'))
  }, [id])

  if (!user) {
    return (
      <>
        <Header />
        <main className="mt-28 flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="mt-28 w-full max-w-container mx-auto px-margin-desktop mb-unit-xl">
        {/* Profile header */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-xl mb-unit-xl">
          <div className="flex flex-col md:flex-row gap-unit-lg items-start">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-primary flex items-center justify-center text-on-primary text-3xl font-black shrink-0">
              {user.avatar
                ? <Image src={user.avatar} alt={user.name} width={96} height={96} className="w-full h-full object-cover" />
                : user.name[0].toUpperCase()
              }
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-headline-md font-bold text-on-surface">{user.name}</h1>
                {user.isVerified && (
                  <Badge variant="verified">
                    <Icon name="verified" filled size={14} /> Verificado
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-unit-md mt-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <StarRating value={user.rating} size={16} />
                  <span className="text-body-md font-bold text-on-surface">{user.rating.toFixed(1)}</span>
                  <span className="text-body-md text-secondary">({user.reviewCount} avaliações)</span>
                </div>
              </div>

              <p className="text-body-md text-secondary mt-2">
                Membro desde {formatDate(user.createdAt)}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setReportOpen(true)}
                className="flex items-center gap-2 text-body-md text-secondary hover:text-error transition-colors"
              >
                <Icon name="flag" size={16} />
                Denunciar
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-unit-xl">
          {/* Listings */}
          <div className="flex-1">
            <h2 className="text-headline-md font-bold text-on-surface mb-unit-lg">
              Anúncios ativos ({listings.length})
            </h2>
            {listings.length === 0 ? (
              <div className="py-unit-xl text-center text-secondary">Nenhum anúncio ativo.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-gutter">
                {listings.map((l) => <ProductCard key={l.id} listing={l} />)}
              </div>
            )}
          </div>

          {/* Reviews */}
          <aside className="w-full lg:w-80 shrink-0">
            <h2 className="text-title-lg font-bold text-on-surface mb-unit-lg">Avaliações</h2>

            <div className="flex flex-col gap-unit-md">
              {reviews.length === 0 && (
                <div className="text-body-md text-secondary py-4">Nenhuma avaliação ainda.</div>
              )}
              {reviews.map((r) => (
                <div key={r.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                      {r.author.name[0]}
                    </div>
                    <div>
                      <div className="text-body-md font-bold text-on-surface">{r.author.name}</div>
                      <div className="flex items-center gap-1">
                        <StarRating value={r.rating} size={12} />
                        <span className="text-label-md text-secondary">{formatDate(r.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-body-md text-on-surface-variant">{r.comment}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        targetType="user"
        targetId={user.id}
        targetName={user.name}
      />

      <Footer />
    </>
  )
}
