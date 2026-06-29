import { Controller, Get, Put, Param, Body, Query, UseGuards } from '@nestjs/common'
import { AdminService } from './admin.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { AdminGuard } from '../common/guards/admin.guard'

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('stats')
  stats() { return this.admin.getStats() }

  @Get('users')
  users(@Query('page') page?: string, @Query('search') search?: string, @Query('banned') banned?: string) {
    return this.admin.getUsers({ page: parseInt(page ?? '1'), search, banned: banned === 'true' ? true : undefined })
  }

  @Put('users/:id/ban')
  ban(@Param('id') id: string) { return this.admin.banUser(id) }

  @Put('users/:id/unban')
  unban(@Param('id') id: string) { return this.admin.unbanUser(id) }

  @Get('listings')
  listings(@Query('page') page?: string, @Query('status') status?: string) {
    return this.admin.getListings({ page: parseInt(page ?? '1'), status })
  }

  @Put('listings/:id/status')
  moderateListing(@Param('id') id: string, @Body() body: { status: string }) {
    return this.admin.moderateListing(id, body.status)
  }
}
