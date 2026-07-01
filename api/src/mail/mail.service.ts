import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  private resend: Resend
  private smtpTransporter: nodemailer.Transporter

  constructor(private config: ConfigService) {
    this.resend = new Resend(config.get('RESEND_API_KEY'))

    this.smtpTransporter = nodemailer.createTransport({
      host: config.get('SMTP_HOST'),
      port: parseInt(config.get('SMTP_PORT') ?? '587'),
      auth: {
        user: config.get('SMTP_USER'),
        pass: config.get('SMTP_PASS'),
      },
    })
  }

  /** Base URL do app sem barra final (evita // nos links). */
  private appUrl(): string {
    return (this.config.get<string>('APP_URL') ?? '').replace(/\/+$/, '')
  }

  async send(options: { to: string; subject: string; html: string }) {
    const from = this.config.get('EMAIL_FROM') ?? 'no-reply@kite360.com.br'

    // Skip sending if no mail provider configured (dev)
    if (!this.config.get('RESEND_API_KEY') && this.config.get('EMAIL_FALLBACK_ENABLED') !== 'true') {
      this.logger.warn(`[DEV] Email not sent to ${options.to} — no mail provider configured. Subject: ${options.subject}`)
      return
    }

    // Try Resend first
    try {
      await this.resend.emails.send({ from, to: options.to, subject: options.subject, html: options.html })
      this.logger.log(`Mail sent via Resend to ${options.to}`)
      return
    } catch (err: unknown) {
      const isQuota = (err as { statusCode?: number })?.statusCode === 429
      if (!isQuota) {
        this.logger.error(`Resend failed: ${(err as Error).message}`)
        if (this.config.get('EMAIL_FALLBACK_ENABLED') !== 'true') return
      }
      this.logger.warn('Resend quota exceeded — falling back to SMTP')
    }

    // Fallback to SMTP
    if (this.config.get('EMAIL_FALLBACK_ENABLED') !== 'true') throw new Error('SMTP fallback disabled.')
    await this.smtpTransporter.sendMail({ from, to: options.to, subject: options.subject, html: options.html })
    this.logger.log(`Mail sent via SMTP fallback to ${options.to}`)
  }

  async sendEmailVerification(to: string, token: string) {
    const url = `${this.appUrl()}/verificar-email?token=${token}`
    await this.send({
      to,
      subject: 'Verifique seu e-mail — KITE360º',
      html: `
        <h2>Bem-vindo ao KITE360º!</h2>
        <p>Clique no link abaixo para verificar seu e-mail:</p>
        <a href="${url}" style="background:#001e40;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;">
          Verificar e-mail
        </a>
        <p>Link válido por 24 horas.</p>
        <p>Se você não criou uma conta, ignore este e-mail.</p>
      `,
    })
  }

  async sendPasswordReset(to: string, token: string) {
    const url = `${this.appUrl()}/redefinir-senha?token=${token}`
    await this.send({
      to,
      subject: 'Redefinir senha — KITE360º',
      html: `
        <h2>Redefinição de senha</h2>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <a href="${url}" style="background:#001e40;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;">
          Redefinir senha
        </a>
        <p>Link válido por 1 hora. Se você não solicitou a redefinição, ignore este e-mail.</p>
      `,
    })
  }

  async sendNewMessage(to: string, senderName: string, listingTitle: string) {
    await this.send({
      to,
      subject: `Nova mensagem de ${senderName} — KITE360º`,
      html: `
        <h2>Você tem uma nova mensagem!</h2>
        <p><strong>${senderName}</strong> enviou uma mensagem sobre <strong>${listingTitle}</strong>.</p>
        <a href="${this.appUrl()}/mensagens" style="background:#001e40;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;">
          Ver mensagens
        </a>
      `,
    })
  }
}

@Injectable()
export class MailModule {}
