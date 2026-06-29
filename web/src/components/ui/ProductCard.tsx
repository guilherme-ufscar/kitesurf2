'use client'
import Link from 'next/link'
import Image from 'next/image'
import { cn, formatPrice } from '@/lib/utils'
import type { Listing } from '@/types'
import { Icon } from './Icon'
import { Badge } from './Badge'
import { useState } from 'react'
import { favoritesApi } from '@/lib/api'

interface ProductCardProps {
  listing: Listing
  className?: string
}

export function ProductCard({ listing, className }: ProductCardProps) {
  const [fav, setFav] = useState(listing.isFavorited ?? false)

  async function toggleFav(e: React.MouseEvent) {
    e.preventDefault()
    setFav(!fav)
    try {
      await favoritesApi.toggle(listing.id)
    } catch {
      setFav(!fav)
    }
  }

  const thumb = listing.images[0]?.thumb ?? listing.images[0]?.url ?? '/placeholder-product.svg'

  return (
    <Link
      href={`/anuncio/${listing.id}`}
      className={cn(
        'group bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden',
        'product-card-hover flex flex-col relative',
        className
      )}
    >
      {listing.isBoosted && (
        <Badge variant="sponsored" className="absolute top-2 left-2 z-10">
          Patrocinado
        </Badge>
      )}

      <div className="aspect-[4/3] bg-surface-container-low overflow-hidden relative">
        <Image
          src={thumb}
          alt={listing.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <button
          onClick={toggleFav}
          className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full transition-colors hover:bg-white"
          aria-label="Favoritar"
        >
          <Icon name="favorite" filled={fav} size={20} className={fav ? 'text-error' : 'text-secondary'} />
        </button>
      </div>

      <div className="p-unit-md flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <Badge variant={listing.condition === 'new' ? 'new' : 'used'}>
            {listing.condition === 'new' ? 'Novo' : 'Usado'}
          </Badge>
          {listing.seller.isVerified && (
            <div className="flex items-center gap-1 text-primary">
              <Icon name="verified" filled size={14} />
              <span className="text-[10px] font-bold uppercase">Verificado</span>
            </div>
          )}
        </div>

        <h3 className="text-body-md font-bold text-on-surface mb-2 line-clamp-2 mt-1">
          {listing.title}
        </h3>

        <div className="mt-auto">
          <div className="text-price-display font-bold text-primary">{formatPrice(listing.price)}</div>
          <div className="text-[11px] text-outline mt-1 flex items-center gap-1">
            <Icon name="location_on" size={14} />
            {listing.city}, {listing.state}
          </div>
        </div>
      </div>
    </Link>
  )
}
