import { Module } from '@nestjs/common'
import { ChatService } from './chat.service'
import { ChatController } from './chat.controller'
import { ChatGateway } from './chat.gateway'
import { ContactFilterService } from './contact-filter.service'
import { MailModule } from '../mail/mail.module'

@Module({
  imports: [MailModule],
  providers: [ChatService, ChatGateway, ContactFilterService],
  controllers: [ChatController],
})
export class ChatModule {}
