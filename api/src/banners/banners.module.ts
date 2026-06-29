import { Module } from '@nestjs/common'
import { BannersService } from './banners.service'
import { BannersController } from './banners.controller'
import { UploadsModule } from '../uploads/uploads.module'

@Module({ imports: [UploadsModule], providers: [BannersService], controllers: [BannersController] })
export class BannersModule {}
