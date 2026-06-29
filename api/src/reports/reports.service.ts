import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.module'

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(reporterId: string, data: { targetType: 'listing' | 'user'; targetId: string; reason: string; details?: string }) {
    return this.prisma.report.create({
      data: {
        reporterId,
        targetType: data.targetType,
        targetId: data.targetId,
        listingId: data.targetType === 'listing' ? data.targetId : undefined,
        reason: data.reason,
        details: data.details,
      },
    })
  }

  async findAll(params?: { status?: string; page?: number; limit?: number }) {
    const page = params?.page ?? 1
    const limit = params?.limit ?? 20
    const where = params?.status && params.status !== 'all' ? { status: params.status } : {}

    const [data, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        include: {
          reporter: { select: { id: true, name: true } },
          listing: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.report.count({ where }),
    ])
    return { data, total, page }
  }

  async updateStatus(id: string, status: string, actionTaken?: string) {
    return this.prisma.report.update({ where: { id }, data: { status, actionTaken } })
  }

  async countPending() {
    return this.prisma.report.count({ where: { status: 'pending' } })
  }
}
