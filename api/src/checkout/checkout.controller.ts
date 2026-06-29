import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { PlansService } from '../plans/plans.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/user.decorator'
import { v4 as uuid } from 'uuid'

@Controller('checkout')
@UseGuards(JwtAuthGuard)
export class CheckoutController {
  constructor(private plans: PlansService) {}

  @Post()
  async checkout(
    @CurrentUser() user: { id: string },
    @Body() body: { planId: string; billing: 'monthly' | 'annual'; method: 'pix' | 'card' },
  ) {
    // In production: integrate with payment gateway (Stripe, Mercado Pago, etc.)
    // For now: simulate PIX code or confirm subscription directly for card
    const pixCode = `00020126360014BR.GOV.BCB.PIX0114+5511999999990204KITE52040000530398654${(body.billing === 'monthly' ? 49.9 : 39.9 * 12).toFixed(2).replace('.', '')}5802BR5924KITE360 MARKETPLACE6009SAO PAULO62070503***6304${uuid().substring(0, 4).toUpperCase()}`

    if (body.method === 'pix') {
      return { method: 'pix', pixCode, expiresAt: new Date(Date.now() + 1800000) }
    }

    // Card: direct subscription (payment gateway webhook would do this in prod)
    const sub = await this.plans.subscribe(user.id, body.planId, body.billing)
    return { method: 'card', subscription: sub, success: true }
  }
}
