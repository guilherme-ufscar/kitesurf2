import { Module } from '@nestjs/common'
import { ListingsService } from './listings.service'
import { ListingsController } from './listings.controller'
import { UploadsModule } from '../uploads/uploads.module'
import { ContactFilterService } from '../chat/contact-filter.service'

@Module({
  imports: [UploadsModule],
  providers: [ListingsService, ContactFilterService],
  controllers: [ListingsController],
  exports: [ListingsService],
})
export class ListingsModule {}
