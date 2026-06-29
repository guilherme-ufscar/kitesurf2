import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.module'

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  async getForSlot(position: string) {
    const slot = await this.prisma.adSlot.findFirst({ where: { position } })
    if (!slot) return []

    const now = new Date()
    const banners = await this.prisma.adBanner.findMany({
      where: { slotId: slot.id, status: 'active', startsAt: { lte: now }, endsAt: { gte: now } },
      orderBy: { weight: 'desc' },
    })
    return { slot, banners }
  }

  async trackImpression(bannerId: string) {
    await this.prisma.adBanner.update({ where: { id: bannerId }, data: { impressions: { increment: 1 } } })
  }

  async trackClick(bannerId: string) {
    await this.prisma.adBanner.update({ where: { id: bannerId }, data: { clicks: { increment: 1 } } })
    const banner = await this.prisma.adBanner.findUnique({ where: { id: bannerId } })
    return { redirect: banner?.linkUrl }
  }

  async findAllAdmin() {
    return this.prisma.adBanner.findMany({
      include: { slot: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findAllSlots() {
    return this.prisma.adSlot.findMany()
  }

  async createSlot(data: { name: string; position: string; isPremium?: boolean; maxBanners?: number }) {
    return this.prisma.adSlot.create({ data })
  }

  async createBanner(data: { slotId: string; advertiser: string; imageUrl: string; linkUrl: string; weight?: number; startsAt: Date; endsAt: Date }) {
    return this.prisma.adBanner.create({ data: { ...data, weight: data.weight ?? 1 } })
  }

  async updateBanner(id: string, data: Partial<{ status: string; weight: number }>) {
    return this.prisma.adBanner.update({ where: { id }, data })
  }
}
