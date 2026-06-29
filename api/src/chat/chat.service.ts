import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma.module'
import { ContactFilterService } from './contact-filter.service'
import { MailService } from '../mail/mail.service'

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private filter: ContactFilterService,
    private mail: MailService,
  ) {}

  async getOrCreateConversation(buyerId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId }, include: { seller: true } })
    if (!listing) throw new NotFoundException('Anúncio não encontrado.')
    if (listing.sellerId === buyerId) throw new ForbiddenException('Você não pode contatar a si mesmo.')

    const [userAId, userBId] = [buyerId, listing.sellerId].sort()

    let conv = await this.prisma.conversation.findFirst({
      where: { listingId, userAId, userBId },
    })
    if (!conv) {
      conv = await this.prisma.conversation.create({ data: { listingId, userAId, userBId } })
    }
    return conv
  }

  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { OR: [{ userAId: userId }, { userBId: userId }] },
      include: {
        listing: { select: { id: true, title: true, images: { take: 1 } } },
        userA: { select: { id: true, name: true, avatar: true } },
        userB: { select: { id: true, name: true, avatar: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
    })
  }

  async getMessages(conversationId: string, userId: string) {
    const conv = await this.prisma.conversation.findUnique({ where: { id: conversationId } })
    if (!conv) throw new NotFoundException()
    if (conv.userAId !== userId && conv.userBId !== userId) throw new ForbiddenException()

    await this.prisma.message.updateMany({
      where: { conversationId, senderId: { not: userId }, isRead: false },
      data: { isRead: true },
    })

    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: { sender: { select: { id: true, name: true, avatar: true } } },
    })
  }

  async sendMessage(conversationId: string, senderId: string, content: string) {
    const conv = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        listing: true,
        userA: { select: { id: true, email: true, name: true } },
        userB: { select: { id: true, email: true, name: true } },
      },
    })
    if (!conv) throw new NotFoundException()
    if (conv.userAId !== senderId && conv.userBId !== senderId) throw new ForbiddenException()

    const filterResult = this.filter.filter(content)

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        content: filterResult.isClean ? content : '🔒 Mensagem bloqueada',
        isBlocked: !filterResult.isClean,
        blockReason: filterResult.reason ?? null,
      },
      include: { sender: { select: { id: true, name: true, avatar: true } } },
    })

    await this.prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } })

    // Notify recipient by email (non-blocking)
    const sender = conv.userAId === senderId ? conv.userA : conv.userB
    const recipient = conv.userAId === senderId ? conv.userB : conv.userA
    if (filterResult.isClean && recipient.email) {
      this.mail.sendNewMessage(recipient.email, sender.name, conv.listing.title).catch(() => {})
    }

    return message
  }
}
