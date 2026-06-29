import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma.module'
import { ContactFilterService } from '../chat/contact-filter.service'

@Injectable()
export class ListingsService {
  constructor(
    private prisma: PrismaService,
    private filter: ContactFilterService,
  ) {}

  async findAll(params: {
    q?: string; category?: string; condition?: string; priceMin?: number; priceMax?: number
    state?: string; city?: string; sortBy?: string; page?: number; limit?: number
    boosted?: boolean; seller?: string; status?: string
  }) {
    const page = params.page ?? 1
    const limit = Math.min(params.limit ?? 20, 50)
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {
      status: params.status ?? 'active',
      ...(params.q && { OR: [
        { title: { contains: params.q, mode: 'insensitive' } },
        { description: { contains: params.q, mode: 'insensitive' } },
      ] }),
      ...(params.category && { category: params.category }),
      ...(params.condition && { condition: params.condition }),
      ...(params.state && { state: params.state }),
      ...(params.city && { city: { contains: params.city, mode: 'insensitive' } }),
      ...(params.boosted && { isBoosted: true }),
      ...(params.seller && { sellerId: params.seller }),
      ...(params.priceMin !== undefined && { price: { gte: params.priceMin } }),
      ...(params.priceMax !== undefined && { price: { lte: params.priceMax } }),
    }

    const orderBy = params.sortBy === 'price_asc'  ? { price: 'asc' as const }
      : params.sortBy === 'price_desc' ? { price: 'desc' as const }
      : params.sortBy === 'newest'     ? { createdAt: 'desc' as const }
      : [{ isBoosted: 'desc' as const }, { createdAt: 'desc' as const }]

    const [data, total] = await Promise.all([
      this.prisma.listing.findMany({
        where, orderBy, skip, take: limit,
        include: {
          images: { orderBy: { order: 'asc' }, take: 1 },
          seller: { select: { id: true, name: true, avatar: true, isVerified: true, rating: true, reviewCount: true } },
        },
      }),
      this.prisma.listing.count({ where }),
    ])

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: string, userId?: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        seller: { select: { id: true, name: true, avatar: true, isVerified: true, rating: true, reviewCount: true } },
        favorites: userId ? { where: { userId } } : false,
      },
    })
    if (!listing) throw new NotFoundException('Anúncio não encontrado.')

    await this.prisma.listing.update({ where: { id }, data: { viewCount: { increment: 1 } } })

    return {
      ...listing,
      isFavorited: userId ? listing.favorites?.length > 0 : false,
    }
  }

  async create(userId: string, data: { title: string; description: string; price: number; category: string; brand?: string; model?: string; condition: string; city: string; state: string; images: string[]; turnstileToken?: string }) {
    const sanitizedDesc = this.filter.sanitizeHtml(data.description)

    const listing = await this.prisma.listing.create({
      data: {
        title: data.title,
        description: sanitizedDesc,
        price: data.price,
        category: data.category.toLowerCase(),
        brand: data.brand,
        model: data.model,
        condition: data.condition,
        city: data.city,
        state: data.state,
        status: 'active',
        sellerId: userId,
        images: {
          create: data.images.map((url, i) => ({ url, thumb: url, order: i })),
        },
      },
      include: { images: true },
    })
    return listing
  }

  async update(id: string, userId: string, data: Partial<{ title: string; description: string; price: number; status: string; category: string; condition: string; city: string; state: string }>) {
    const listing = await this.prisma.listing.findUnique({ where: { id } })
    if (!listing) throw new NotFoundException()
    if (listing.sellerId !== userId) throw new ForbiddenException()

    const updateData: Record<string, unknown> = { ...data }
    if (data.description) updateData.description = this.filter.sanitizeHtml(data.description)

    return this.prisma.listing.update({ where: { id }, data: updateData })
  }

  async delete(id: string, userId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } })
    if (!listing) throw new NotFoundException()
    if (listing.sellerId !== userId) throw new ForbiddenException()
    return this.prisma.listing.delete({ where: { id } })
  }

  async mine(userId: string, params?: { page?: number; limit?: number }) {
    const page = params?.page ?? 1
    const limit = params?.limit ?? 20
    const [data, total] = await Promise.all([
      this.prisma.listing.findMany({
        where: { sellerId: userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { images: { take: 1, orderBy: { order: 'asc' } } },
      }),
      this.prisma.listing.count({ where: { sellerId: userId } }),
    ])
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }
}
