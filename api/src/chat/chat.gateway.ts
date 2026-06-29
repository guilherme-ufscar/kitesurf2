import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ChatService } from './chat.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server

  private userSockets = new Map<string, Set<string>>()

  constructor(
    private chat: ChatService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token ?? client.handshake.headers.authorization?.replace('Bearer ', '')
      if (!token) { client.disconnect(); return }

      const payload = this.jwt.verify<{ sub: string }>(token, { secret: this.config.get('JWT_SECRET') })
      client.data.userId = payload.sub

      if (!this.userSockets.has(payload.sub)) this.userSockets.set(payload.sub, new Set())
      this.userSockets.get(payload.sub).add(client.id)
    } catch {
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId
    if (userId && this.userSockets.has(userId)) {
      this.userSockets.get(userId).delete(client.id)
      if (this.userSockets.get(userId).size === 0) this.userSockets.delete(userId)
    }
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() conversationId: string, @ConnectedSocket() client: Socket) {
    client.join(`conv:${conversationId}`)
  }

  @SubscribeMessage('leave')
  handleLeave(@MessageBody() conversationId: string, @ConnectedSocket() client: Socket) {
    client.leave(`conv:${conversationId}`)
  }

  @SubscribeMessage('send')
  async handleMessage(
    @MessageBody() data: { conversationId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId
    if (!userId) return

    try {
      const message = await this.chat.sendMessage(data.conversationId, userId, data.content)
      this.server.to(`conv:${data.conversationId}`).emit('message', message)
    } catch (err) {
      client.emit('error', { message: err.message })
    }
  }

  emitToUser(userId: string, event: string, data: unknown) {
    const sockets = this.userSockets.get(userId)
    if (sockets) sockets.forEach(sid => this.server.to(sid).emit(event, data))
  }
}
