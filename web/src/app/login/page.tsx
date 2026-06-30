'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/ui/Logo'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authApi } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Icon } from '@/components/ui/Icon'
import { Turnstile } from '@/components/ui/Turnstile'
import toast from 'react-hot-toast'

const schema = z.object({
  email:    z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [showPw, setShowPw] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    if (!turnstileToken) { toast.error('Conclua a verificação de segurança.'); return }
    try {
      const res = await authApi.login({ ...data, turnstileToken })
      localStorage.setItem('kite_access_token', res.data.accessToken)
      localStorage.setItem('kite_refresh_token', res.data.refreshToken)
      router.push('/painel')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg ?? 'E-mail ou senha incorretos.')
    }
  }

  return (
    <main className="flex min-h-screen w-full">
      {/* Hero image side */}
      <section className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden bg-primary">
        <Image src="/imagens/surfer.webp" alt="Surfista" fill priority sizes="60vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 p-unit-xl flex flex-col justify-end h-full">
          <div className="max-w-md mb-unit-xl">
            <Logo size={60} variant="branco" withWordmark={false} className="mb-unit-lg" />
            <h2 className="text-headline-lg font-black text-white mb-unit-md leading-tight">
              Alta performance<br />no mar.
            </h2>
            <p className="text-body-lg text-white/80">
              O marketplace definitivo para kitesurf, wingfoil e esportes aquáticos.
              Encontre equipamentos de elite e venda para quem entende de mar.
            </p>
          </div>
          <div className="flex gap-unit-lg">
            {['verified_user', 'encrypted', 'security'].map((icon) => (
              <Icon key={icon} name={icon} size={24} className="text-white/40" />
            ))}
          </div>
        </div>
      </section>

      {/* Form side */}
      <section className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center bg-surface-container-lowest px-margin-mobile md:px-margin-desktop py-unit-xl">
        <div className="w-full max-w-sm">
          <div className="text-center mb-unit-xl">
            <div className="flex justify-center"><Logo size={54} /></div>
            <p className="text-body-md text-secondary mt-unit-xs">Entre na sua conta</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-unit-lg">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Senha"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 bottom-[10px] text-outline hover:text-on-surface"
              >
                <Icon name={showPw ? 'visibility_off' : 'visibility'} size={20} />
              </button>
            </div>

            <div className="flex justify-end">
              <Link href="/recuperar-senha" className="text-label-md text-primary hover:underline">
                Esqueci minha senha
              </Link>
            </div>

            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA'}
              onVerify={setTurnstileToken}
              onError={() => setTurnstileToken(null)}
            />

            <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
              Entrar
            </Button>
          </form>

          <div className="mt-unit-xl text-center">
            <p className="text-body-md text-secondary">
              Não tem conta?{' '}
              <Link href="/cadastro" className="font-semibold text-primary hover:underline">
                Cadastre-se gratuitamente
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
