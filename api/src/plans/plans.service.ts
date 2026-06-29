import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.module'

const PLANS = [
  { id: 'free',    name: 'Free',    monthlyPrice: 0,    annualPrice: 0,    listingLimit: 3,  features: ['3 anúncios ativos', 'Fotos básicas', 'Suporte por e-mail'] },
  { id: 'pro',     name: 'Pro',     monthlyPrice: 49.9, annualPrice: 39.9, listingLimit: 20, features: ['20 anúncios ativos', '10 fotos por anúncio', 'Impulsionamento mensal', 'Suporte prioritário', 'Estatísticas de visualização'] },
  { id: 'premium', name: 'Premium', monthlyPrice: 99.9, annualPrice: 79.9, listingLimit: -1, features: ['Anúncios ilimitados', '20 fotos por anúncio', 'Impulsionamento semanal', 'Selo de verificado premium', 'Destaque na busca', 'Suporte 24/7', 'Relatórios avançados'] },
]

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  getPlans() { return PLANS }

  async subscribe(userId: string, planId: string, billing: 'monthly' | 'annual') {
    const plan = PLANS.find(p => p.id === planId)
    if (!plan) throw new Error('Plano não encontrado.')

    const price = billing === 'annual' ? plan.annualPrice * 12 : plan.monthlyPrice
    const months = billing === 'annual' ? 12 : 1
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + months)

    await this.prisma.subscription.updateMany({
      where: { userId, status: 'active' },
      data: { status: 'cancelled' },
    })

    return this.prisma.subscription.create({
      data: { userId, planId, billing, price, expiresAt },
    })
  }

  async boost(userId: string, listingId: string, plan: '7d' | '15d' | '30d') {
    const days = parseInt(plan)
    const prices = { '7d': 19.9, '15d': 34.9, '30d': 59.9 }
    const price = prices[plan]
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + days)

    await this.prisma.listing.update({
      where: { id: listingId },
      data: { isBoosted: true, boostExpiresAt: expiresAt },
    })

    return this.prisma.boost.create({
      data: { listingId, plan, price, expiresAt },
    })
  }
}
