'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { authApi } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Icon } from '@/components/ui/Icon'
import toast from 'react-hot-toast'

function Form() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token') ?? ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { toast.error('A senha precisa ter ao menos 8 caracteres.'); return }
    if (password !== confirm) { toast.error('As senhas não conferem.'); return }
    setLoading(true)
    try {
      await authApi.resetPw({ token, password })
      setDone(true)
    } catch {
      toast.error('Link inválido ou expirado. Solicite um novo.')
    } finally { setLoading(false) }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon name="lock_reset" size={32} className="text-primary" />
        </div>
        <h2 className="text-title-lg font-bold text-on-surface">Senha redefinida!</h2>
        <p className="text-body-md text-secondary">Sua nova senha foi salva com sucesso.</p>
        <Button onClick={() => router.push('/login')} className="w-full">Fazer login</Button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-unit-lg">
      <Input
        label="Nova senha"
        type="password"
        placeholder="Mínimo 8 caracteres"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Input
        label="Confirmar nova senha"
        type="password"
        placeholder="Repita a nova senha"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      <Button type="submit" loading={loading} className="w-full">Redefinir senha</Button>
      <Link href="/login" className="text-center text-body-md text-secondary hover:text-primary transition-colors">
        ← Voltar para o login
      </Link>
    </form>
  )
}

export default function RedefinirSenhaPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-margin-mobile py-unit-xl">
      <div className="w-full max-w-sm bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-xl shadow-lift">
        <div className="text-center mb-unit-xl">
          <Link href="/" className="text-3xl font-black text-primary tracking-tight">KITE360º</Link>
          <h1 className="text-headline-md font-bold text-on-surface mt-unit-lg">Definir nova senha</h1>
          <p className="text-body-md text-secondary mt-unit-sm">Crie uma senha forte para sua conta.</p>
        </div>
        <Suspense>
          <Form />
        </Suspense>
      </div>
    </main>
  )
}
