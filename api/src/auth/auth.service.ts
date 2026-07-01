import { Injectable, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../prisma.module'
import { MailService } from '../mail/mail.service'
import * as argon2 from 'argon2'
import { v4 as uuid } from 'uuid'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mail: MailService,
  ) {}

  async register(data: { name: string; email: string; password: string }) {
    const exists = await this.prisma.user.findUnique({ where: { email: data.email } })
    if (exists) throw new ConflictException('E-mail já cadastrado.')

    const passwordHash = await argon2.hash(data.password)
    const hasMailProvider = !!this.config.get('RESEND_API_KEY')
    const emailVerifyToken = hasMailProvider ? uuid() : null

    await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        emailVerifyToken,
        emailVerifiedAt: hasMailProvider ? null : new Date(),
      },
    })

    if (hasMailProvider) {
      await this.mail.sendEmailVerification(data.email, emailVerifyToken!)
      return { message: 'Conta criada. Verifique seu e-mail.', requiresVerification: true }
    }

    return { message: 'Conta criada com sucesso!', requiresVerification: false }
  }

  async login(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } })
    if (!user) throw new UnauthorizedException('E-mail ou senha incorretos.')
    if (user.isBanned) throw new UnauthorizedException('Conta suspensa.')

    const valid = await argon2.verify(user.passwordHash, data.password)
    if (!valid) throw new UnauthorizedException('E-mail ou senha incorretos.')

    const tokens = await this.generateTokens(user.id)
    return tokens
  }

  async refresh(refreshToken: string) {
    const record = await this.prisma.refreshToken.findUnique({ where: { token: refreshToken }, include: { user: true } })
    if (!record || record.expiresAt < new Date()) throw new UnauthorizedException('Refresh token inválido.')

    await this.prisma.refreshToken.delete({ where: { id: record.id } })
    return this.generateTokens(record.userId)
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) return // silent — don't reveal if email exists

    const resetToken = uuid()
    const expires = new Date(Date.now() + 3600000) // 1h

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpires: expires },
    })

    await this.mail.sendPasswordReset(email, resetToken)
  }

  async resetPassword(token: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { resetToken: token, resetTokenExpires: { gt: new Date() } },
    })
    if (!user) throw new BadRequestException('Link inválido ou expirado.')

    const passwordHash = await argon2.hash(password)
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetToken: null, resetTokenExpires: null },
    })
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({ where: { emailVerifyToken: token } })
    if (!user) throw new BadRequestException('Token inválido.')

    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerifyToken: null, emailVerifiedAt: new Date() },
    })
    return { message: 'E-mail verificado com sucesso!' }
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, avatar: true, isVerified: true, isAdmin: true, theme: true, rating: true, reviewCount: true, createdAt: true },
    })
    return user
  }

  private async generateTokens(userId: string) {
    const accessToken = this.jwt.sign({ sub: userId })
    const refreshToken = uuid()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    await this.prisma.refreshToken.create({ data: { token: refreshToken, userId, expiresAt } })

    return { accessToken, refreshToken }
  }
}
