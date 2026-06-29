import { Module } from '@nestjs/common'
import { CheckoutController } from './checkout.controller'
import { PlansModule } from '../plans/plans.module'

@Module({ imports: [PlansModule], controllers: [CheckoutController] })
export class CheckoutModule {}
