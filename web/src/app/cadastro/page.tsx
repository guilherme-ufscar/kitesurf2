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
import toast from 'react-hot-toast'

const schema = z.object({
  name:     z.string().min(2, 'Nome muito curto'),
  email:    z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirm:  z.string(),
}).refine((d) => d.password === d.confirm, { message: 'Senhas não conferem', path: ['confirm'] })

type FormData = z.infer<typeof schema>

export default function CadastroPage() {
  const router = useRouter()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    try {
      const res = await authApi.register({ name: data.name, email: data.email, password: data.password })
      if (res.data?.requiresVerification) {
        router.push('/verificar-email?registered=1')
      } else {
        toast.success('Conta criada! Faça login para continuar.')
        router.push('/login')
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg ?? 'Erro ao criar conta. Tente novamente.')
    }
  }

  return (
    <main className="flex min-h-screen w-full">
      {/* Hero side */}
      <section className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden bg-primary flex-col justify-end p-unit-xl">
        <Image src="/imagens/wakesurf.webp" alt="Wakesurf" fill priority sizes="60vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-md mb-unit-xl">
          <Logo size={60} variant="branco" withWordmark={false} className="mb-unit-lg" />
          <h2 className="text-headline-lg font-black text-white mb-unit-md leading-tight">
            Venda seus equipamentos<br />para quem entende.
          </h2>
          <p className="text-body-lg text-white/80">
            Crie sua conta gratuitamente e anuncie para milhares de esportistas aquáticos em todo o Brasil.
          </p>
          <ul className="mt-unit-lg flex flex-col gap-3">
            {['Anuncie grátis', 'Chat seguro com bloqueio de contato externo', 'Selo de verificação para mais credibilidade', 'Avaliações e reputação do vendedor'].map((item) => (
              <li key={item} className="flex items-center gap-3 text-white/90 text-body-md">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Form side */}
      <section className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center bg-surface-container-lowest px-margin-mobile md:px-margin-desktop py-unit-xl">
        <div className="w-full max-w-sm">
          <div className="text-center mb-unit-xl">
            <div className="flex justify-center mb-2">
              <Logo size={54} />
            </div>
            <p className="text-body-md text-secondary mt-unit-xs">Crie sua conta gratuita</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-unit-md">
            <Input label="Nome completo" placeholder="Seu nome" error={errors.name?.message} {...register('name')} />
            <Input label="E-mail" type="email" placeholder="seu@email.com" error={errors.email?.message} {...register('email')} />
            <Input label="Senha" type="password" placeholder="Mínimo 8 caracteres" error={errors.password?.message} {...register('password')} />
            <Input label="Confirmar senha" type="password" placeholder="Repita a senha" error={errors.confirm?.message} {...register('confirm')} />

            <p className="text-[11px] text-secondary text-center">
              Ao cadastrar, você concorda com os{' '}
              <Link href="/termos" className="text-primary hover:underline">Termos de Uso</Link>{' '}
              e a{' '}
              <Link href="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>.
            </p>

            <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
              Criar conta gratuita
            </Button>
          </form>

          <div className="mt-unit-lg text-center">
            <p className="text-body-md text-secondary">
              Já tem conta?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">Entrar</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
