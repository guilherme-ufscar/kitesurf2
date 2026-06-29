import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { ListingsService } from './listings.service'
import { UploadsService } from '../uploads/uploads.service'
import { JwtAuthGuard, OptionalJwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/user.decorator'
import { IsString, IsNumber, IsOptional, Min } from 'class-validator'
import { Transform } from 'class-transformer'

class CreateListingDto {
  @IsString() title: string
  @IsString() description: string
  @IsNumber() @Transform(({ value }) => parseFloat(value)) price: number
  @IsString() category: string
  @IsOptional() @IsString() brand?: string
  @IsOptional() @IsString() model?: string
  @IsString() condition: string
  @IsString() city: string
  @IsString() state: string
  @IsOptional() @IsString() turnstileToken?: string
}

@Controller('listings')
export class ListingsController {
  constructor(
    private listings: ListingsService,
    private uploads: UploadsService,
  ) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  findAll(
    @Query('q') q?: string,
    @Query('category') category?: string,
    @Query('condition') condition?: string,
    @Query('priceMin') priceMin?: string,
    @Query('priceMax') priceMax?: string,
    @Query('state') state?: string,
    @Query('city') city?: string,
    @Query('sortBy') sortBy?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('seller') seller?: string,
  ) {
    return this.listings.findAll({
      q, category, condition, state, city, sortBy, seller,
      priceMin: priceMin ? parseFloat(priceMin) : undefined,
      priceMax: priceMax ? parseFloat(priceMax) : undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    })
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  mine(
    @CurrentUser() user: { id: string },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.listings.mine(user.id, { page: parseInt(page ?? '1'), limit: parseInt(limit ?? '20') })
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  findOne(@Param('id') id: string, @CurrentUser() user?: { id: string }) {
    return this.listings.findOne(id, user?.id)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10, { storage: memoryStorage() }))
  async create(
    @CurrentUser() user: { id: string },
    @Body() body: CreateListingDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const imageUrls: string[] = []
    if (files?.length) {
      const results = await Promise.all(files.map(f => this.uploads.saveImage(f, 'anuncios')))
      imageUrls.push(...results.map(r => r.url))
    }
    return this.listings.create(user.id, { ...body, images: imageUrls })
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() body: Partial<CreateListingDto>,
  ) {
    return this.listings.update(id, user.id, body)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.listings.delete(id, user.id)
  }
}
