'use client'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { authApi } from '@/lib/api'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'

function Content() {
  const params = useSearchParams()
  const token = params.get('token')
  const registered = params.get('registered')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (!token) return
    setStatus('loading')
    authApi.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  if (registered && !token) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon name="mail" size={32} className="text-primary" />
        </div>
        <h2 className="text-title-lg font-bold text-on-surface">Verifique seu e-mail</h2>
        <p className="text-body-md text-secondary max-w-xs">
          Enviamos um link de verificação para o seu e-mail. Clique no link para ativar sua conta.
        </p>
        <p className="text-label-md text-outline">Não recebeu? Verifique sua caixa de spam.</p>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-body-md text-secondary">Verificando seu e-mail...</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <Icon name="check_circle" filled size={32} className="text-green-600" />
        </div>
        <h2 className="text-title-lg font-bold text-on-surface">E-mail verificado!</h2>
        <p className="text-body-md text-secondary">Sua conta foi ativada com sucesso. Bem-vindo ao KITE360º!</p>
        <a href="/login"><Button>Fazer login</Button></a>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center">
          <Icon name="error" size={32} className="text-error" />
        </div>
        <h2 className="text-title-lg font-bold text-on-surface">Link inválido</h2>
        <p className="text-body-md text-secondary">Este link de verificação expirou ou já foi utilizado.</p>
        <Link href="/login" className="text-primary font-semibold hover:underline">Voltar ao login</Link>
      </div>
    )
  }

  return null
}

export default function VerificarEmailPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-margin-mobile py-unit-xl">
      <div className="w-full max-w-sm bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-xl shadow-lift text-center">
        <div className="flex justify-center mb-unit-xl"><Logo size={54} /></div>
        <Suspense>
          <Content />
        </Suspense>
      </div>
    </main>
  )
}
