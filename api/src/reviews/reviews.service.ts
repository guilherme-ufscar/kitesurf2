import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma.module'

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(authorId: string, targetId: string, rating: number, comment: string) {
    if (authorId === targetId) throw new BadRequestException('Você não pode se avaliar.')
    if (rating < 1 || rating > 5) throw new BadRequestException('Avaliação deve ser entre 1 e 5.')

    const review = await this.prisma.review.upsert({
      where: { authorId_targetId: { authorId, targetId } },
      create: { authorId, targetId, rating, comment },
      update: { rating, comment },
    })

    // Recalculate target user rating
    const agg = await this.prisma.review.aggregate({ where: { targetId }, _avg: { rating: true }, _count: true })
    await this.prisma.user.update({
      where: { id: targetId },
      data: { rating: agg._avg.rating ?? 0, reviewCount: agg._count },
    })

    return review
  }

  async findByUser(userId: string) {
    return this.prisma.review.findMany({
      where: { targetId: userId },
      include: { author: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  async myReviews(userId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { targetId: userId },
      include: { author: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    })
    const agg = await this.prisma.review.aggregate({
      where: { targetId: userId },
      _avg: { rating: true },
      _count: true,
    })
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    reviews.forEach(r => { distribution[r.rating] = (distribution[r.rating] ?? 0) + 1 })
    return { reviews, avg: agg._avg.rating ?? 0, total: agg._count, distribution }
  }
}
