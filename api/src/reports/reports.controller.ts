import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ReportsService } from './reports.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { AdminGuard } from '../common/guards/admin.guard'
import { CurrentUser } from '../common/decorators/user.decorator'

@Controller('reports')
export class ReportsController {
  constructor(private reports: ReportsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: { id: string },
    @Body() body: { targetType: 'listing' | 'user'; targetId: string; reason: string; details?: string },
  ) {
    return this.reports.create(user.id, body)
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  findAll(@Query('status') status?: string, @Query('page') page?: string) {
    return this.reports.findAll({ status, page: parseInt(page ?? '1') })
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  updateStatus(@Param('id') id: string, @Body() body: { status: string; actionTaken?: string }) {
    return this.reports.updateStatus(id, body.status, body.actionTaken)
  }
}
