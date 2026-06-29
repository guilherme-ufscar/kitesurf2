import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.module'

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async toggle(userId: string, listingId: string): Promise<{ favorited: boolean }> {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_listingId: { userId, listingId } },
    })

    if (existing) {
      await this.prisma.favorite.delete({ where: { id: existing.id } })
      await this.prisma.listing.update({ where: { id: listingId }, data: { favoriteCount: { decrement: 1 } } })
      return { favorited: false }
    }

    await this.prisma.favorite.create({ data: { userId, listingId } })
    await this.prisma.listing.update({ where: { id: listingId }, data: { favoriteCount: { increment: 1 } } })
    return { favorited: true }
  }

  async findAll(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        listing: {
          include: {
            images: { take: 1, orderBy: { order: 'asc' } },
            seller: { select: { id: true, name: true, isVerified: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return favorites.map(f => f.listing)
  }
}
