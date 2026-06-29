import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.module'
import * as argon2 from 'argon2'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findPublic(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, name: true, avatar: true, isVerified: true, rating: true, reviewCount: true, createdAt: true,
        listings: {
          where: { status: 'active' },
          include: { images: { take: 1 } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        reviewsReceived: {
          include: { author: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })
    if (!user) throw new NotFoundException('Usuário não encontrado.')
    return user
  }

  async updateProfile(userId: string, data: { name?: string; theme?: string; avatarUrl?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.theme && { theme: data.theme }),
        ...(data.avatarUrl && { avatar: data.avatarUrl }),
      },
      select: { id: true, name: true, email: true, avatar: true, isVerified: true, theme: true },
    })
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    const valid = await argon2.verify(user.passwordHash, currentPassword)
    if (!valid) throw new Error('Senha atual incorreta.')

    const passwordHash = await argon2.hash(newPassword)
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } })
  }

  async deleteAccount(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } })
  }

  async getStats(userId: string) {
    const [activeListings, totalViews, unreadMessages, avgRating] = await Promise.all([
      this.prisma.listing.count({ where: { sellerId: userId, status: 'active' } }),
      this.prisma.listing.aggregate({ where: { sellerId: userId }, _sum: { viewCount: true } }),
      this.prisma.message.count({
        where: {
          isRead: false,
          senderId: { not: userId },
          conversation: { OR: [{ userAId: userId }, { userBId: userId }] },
        },
      }),
      this.prisma.review.aggregate({ where: { targetId: userId }, _avg: { rating: true } }),
    ])

    return {
      activeListings,
      totalViews: totalViews._sum.viewCount ?? 0,
      unreadMessages,
      avgRating: avgRating._avg.rating ?? 0,
    }
  }
}
