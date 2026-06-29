import { Injectable } from '@nestjs/common'

// ── Contact filter (server-side, critical business rule) ──────────────────
// Must run on the backend — cannot rely on front-end alone.
// Detects: phone numbers, emails, URLs, social handles in various formats.

const PHONE_REGEX = /(\+?[0-9][\s\-\.\(\)]{0,3}){10,}/g
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+\s*[@＠at]\s*[a-zA-Z0-9.\-]+\s*[.]\s*[a-zA-Z]{2,}/gi
const URL_REGEX = /https?:\/\/|www\.|\.com|\.br|\.net|\.org|\.io|bit\.ly|t\.me|wa\.me/gi
const SOCIAL_REGEX = /@[a-zA-Z0-9_]{3,}|\bwhatsapp\b|\btelegram\b|\binstagram\b|\bfacebook\b|\bpix\s+\w+/gi

// Text representations of numbers (extended)
const NUMBER_WORDS_REGEX = /\b(zero|um|dois|três|quatro|cinco|seis|sete|oito|nove)\b.*\b(zero|um|dois|três|quatro|cinco|seis|sete|oito|nove)\b.*\b(zero|um|dois|três|quatro|cinco|seis|sete|oito|nove)\b/gi

export interface FilterResult {
  isClean: boolean
  reason?: 'phone' | 'email' | 'url' | 'social' | 'number_words'
  sanitized: string
}

@Injectable()
export class ContactFilterService {
  filter(text: string): FilterResult {
    if (PHONE_REGEX.test(text))   return { isClean: false, reason: 'phone',        sanitized: this.mask(text) }
    if (EMAIL_REGEX.test(text))   return { isClean: false, reason: 'email',        sanitized: this.mask(text) }
    if (URL_REGEX.test(text))     return { isClean: false, reason: 'url',          sanitized: this.mask(text) }
    if (SOCIAL_REGEX.test(text))  return { isClean: false, reason: 'social',       sanitized: this.mask(text) }
    if (NUMBER_WORDS_REGEX.test(text)) return { isClean: false, reason: 'number_words', sanitized: this.mask(text) }
    return { isClean: true, sanitized: text }
  }

  private mask(text: string): string {
    return '[Mensagem bloqueada — contato externo detectado]'
  }

  // Sanitize HTML for listing descriptions (TipTap output)
  sanitizeHtml(html: string): string {
    const { JSDOM } = require('jsdom')
    const { window } = new JSDOM('')
    const DOMPurify = require('dompurify')(window)

    const clean = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'img', 'blockquote'],
      ALLOWED_ATTR: ['src', 'alt', 'class', 'width', 'height'],
      FORBID_ATTR: ['href', 'onclick', 'onerror', 'onload'],
    })

    // Extra: remove any contact info from text nodes
    const result = this.filter(clean)
    return result.isClean ? clean : result.sanitized
  }
}
