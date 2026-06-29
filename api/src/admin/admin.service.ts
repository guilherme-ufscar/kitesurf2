import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.module'

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, totalListings, pendingReports, activeAds, newUsersToday, bannedUsers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.listing.count({ where: { status: 'active' } }),
      this.prisma.report.count({ where: { status: 'pending' } }),
      this.prisma.adBanner.count({ where: { status: 'active' } }),
      this.prisma.user.count({ where: { createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) } } }),
      this.prisma.user.count({ where: { isBanned: true } }),
    ])
    return { totalUsers, totalListings, pendingReports, activeAds, newUsersToday, bannedUsers }
  }

  async getUsers(params: { page?: number; search?: string; banned?: boolean }) {
    const page = params.page ?? 1
    const limit = 20
    const where: Record<string, unknown> = {
      ...(params.search && { OR: [
        { name: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
      ]}),
      ...(params.banned !== undefined && { isBanned: params.banned }),
    }
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({ where, skip: (page-1)*limit, take: limit, orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, isVerified: true, isBanned: true, isAdmin: true, createdAt: true } }),
      this.prisma.user.count({ where }),
    ])
    return { data, total, page }
  }

  async banUser(userId: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { isBanned: true } })
    await this.prisma.listing.updateMany({ where: { sellerId: userId }, data: { status: 'paused' } })
  }

  async unbanUser(userId: string) {
    return this.prisma.user.update({ where: { id: userId }, data: { isBanned: false } })
  }

  async getListings(params: { page?: number; status?: string }) {
    const page = params.page ?? 1
    const limit = 20
    const where = params.status && params.status !== 'all' ? { status: params.status } : {}
    const [data, total] = await Promise.all([
      this.prisma.listing.findMany({ where, skip: (page-1)*limit, take: limit, orderBy: { createdAt: 'desc' },
        include: { seller: { select: { id: true, name: true } }, images: { take: 1 } } }),
      this.prisma.listing.count({ where }),
    ])
    return { data, total, page }
  }

  async moderateListing(id: string, status: string) {
    return this.prisma.listing.update({ where: { id }, data: { status } })
  }
}
