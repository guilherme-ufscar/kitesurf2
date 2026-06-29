import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common'
import { PlansService } from './plans.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/user.decorator'

@Controller('plans')
export class PlansController {
  constructor(private plans: PlansService) {}

  @Get()
  getPlans() { return this.plans.getPlans() }

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  subscribe(@CurrentUser() user: { id: string }, @Body() body: { planId: string; billing: 'monthly' | 'annual' }) {
    return this.plans.subscribe(user.id, body.planId, body.billing)
  }

  @Post('boost/:listingId')
  @UseGuards(JwtAuthGuard)
  boost(@CurrentUser() user: { id: string }, @Param('listingId') listingId: string, @Body() body: { plan: '7d' | '15d' | '30d' }) {
    return this.plans.boost(user.id, listingId, body.plan)
  }
}
