'use client'
import { useState } from 'react'
import Link from 'next/link'
import { authApi } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Icon } from '@/components/ui/Icon'
import toast from 'react-hot-toast'

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await authApi.forgotPw(email)
      setSent(true)
    } catch {
      toast.error('Erro ao enviar e-mail. Verifique o endereço informado.')
    } finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-margin-mobile py-unit-xl">
      <div className="w-full max-w-sm bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-xl shadow-lift">
        <div className="text-center mb-unit-xl">
          <Link href="/" className="text-3xl font-black text-primary tracking-tight">KITE360º</Link>
          <h1 className="text-headline-md font-bold text-on-surface mt-unit-lg">Recuperar senha</h1>
          <p className="text-body-md text-secondary mt-unit-sm">
            Informe seu e-mail e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="mark_email_read" size={32} className="text-primary" />
            </div>
            <h2 className="text-title-lg font-bold text-on-surface">E-mail enviado!</h2>
            <p className="text-body-md text-secondary">
              Se encontrarmos uma conta com o e-mail <strong>{email}</strong>, você receberá as instruções em breve.
              Verifique também sua caixa de spam.
            </p>
            <Link href="/login" className="text-primary font-semibold hover:underline text-body-md">
              Voltar para o login
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-unit-lg">
            <Input
              label="E-mail cadastrado"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" loading={loading} className="w-full">
              Enviar link de recuperação
            </Button>
            <Link href="/login" className="text-center text-body-md text-secondary hover:text-primary transition-colors">
              ← Voltar para o login
            </Link>
          </form>
        )}
      </div>
    </main>
  )
}
