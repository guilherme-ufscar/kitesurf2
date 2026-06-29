import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common'
import { ReviewsService } from './reviews.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/user.decorator'

@Controller('reviews')
export class ReviewsController {
  constructor(private reviews: ReviewsService) {}

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  myReviews(@CurrentUser() user: { id: string }) {
    return this.reviews.myReviews(user.id)
  }

  @Get('user/:id')
  findByUser(@Param('id') id: string) {
    return this.reviews.findByUser(id)
  }

  @Post('user/:id')
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: { id: string },
    @Param('id') targetId: string,
    @Body() body: { rating: number; comment: string },
  ) {
    return this.reviews.create(user.id, targetId, body.rating, body.comment)
  }
}
