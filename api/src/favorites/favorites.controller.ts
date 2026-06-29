import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common'
import { FavoritesService } from './favorites.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/user.decorator'

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private favorites: FavoritesService) {}

  @Get()
  findAll(@CurrentUser() user: { id: string }) {
    return this.favorites.findAll(user.id)
  }

  @Post(':listingId')
  toggle(@CurrentUser() user: { id: string }, @Param('listingId') listingId: string) {
    return this.favorites.toggle(user.id, listingId)
  }
}
