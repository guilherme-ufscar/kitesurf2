import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common'
import { ChatService } from './chat.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/user.decorator'

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chat: ChatService) {}

  @Get('conversations')
  getConversations(@CurrentUser() user: { id: string }) {
    return this.chat.getConversations(user.id)
  }

  @Post('conversations')
  startConversation(@CurrentUser() user: { id: string }, @Body() body: { listingId: string }) {
    return this.chat.getOrCreateConversation(user.id, body.listingId)
  }

  @Get('conversations/:id/messages')
  getMessages(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.chat.getMessages(id, user.id)
  }

  @Post('conversations/:id/messages')
  sendMessage(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() body: { content: string },
  ) {
    return this.chat.sendMessage(id, user.id, body.content)
  }
}
