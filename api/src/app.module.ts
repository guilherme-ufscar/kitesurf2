import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { PrismaModule } from './prisma.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { ListingsModule } from './listings/listings.module'
import { ChatModule } from './chat/chat.module'
import { ReviewsModule } from './reviews/reviews.module'
import { FavoritesModule } from './favorites/favorites.module'
import { PlansModule } from './plans/plans.module'
import { BannersModule } from './banners/banners.module'
import { ReportsModule } from './reports/reports.module'
import { AdminModule } from './admin/admin.module'
import { MailModule } from './mail/mail.module'
import { UploadsModule } from './uploads/uploads.module'
import { CheckoutModule } from './checkout/checkout.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    MailModule,
    UploadsModule,
    AuthModule,
    UsersModule,
    ListingsModule,
    ChatModule,
    ReviewsModule,
    FavoritesModule,
    PlansModule,
    BannersModule,
    ReportsModule,
    AdminModule,
    CheckoutModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
