'use client'
import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { plansApi } from '@/lib/api'
import type { Plan } from '@/types'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const MOCK_PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    billingPeriod: 'monthly',
    features: ['5 anúncios ativos', 'Chat interno', 'Favoritos', 'Avaliações'],
    isPopular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29.90,
    billingPeriod: 'monthly',
    features: ['20 anúncios ativos', 'Selo Verificado', 'Chat interno', 'Favoritos', 'Avaliações', '2 impulsionamentos/mês', 'Suporte prioritário'],
    isPopular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 59.90,
    billingPeriod: 'monthly',
    features: ['Anúncios ilimitados', 'Selo Verificado Plus', 'Chat interno', 'Favoritos', 'Avaliações', '5 impulsionamentos/mês', 'Destaque permanente', 'Suporte prioritário VIP', 'Divulgação em comunidades WhatsApp'],
    isPopular: false,
  },
]

export default function PlanosPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>(MOCK_PLANS)
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    plansApi.list()
      .then((r) => r.data.data?.length && setPlans(r.data.data))
      .catch(() => {})
  }, [])

  async function subscribe(planId: string) {
    setLoading(planId)
    try {
      const { data } = await plansApi.checkout({ planId, billing })
      router.push(`/checkout?order=${data.orderId}`)
    } catch { toast.error('Faça login para assinar um plano.'); router.push('/login') }
    finally { setLoading(null) }
  }

  const discount = billing === 'annual' ? 0.2 : 0

  return (
    <>
      <Header />
      <main className="mt-28 mb-unit-xl">
        <div className="max-w-container mx-auto px-margin-desktop py-unit-xl">
          {/* Header */}
          <div className="text-center mb-unit-xl">
            <h1 className="text-headline-lg font-black text-on-surface mb-unit-md">
              Planos e Assinaturas
            </h1>
            <p className="text-body-lg text-secondary max-w-xl mx-auto">
              Escolha o plano ideal para você e venda mais rápido com maior credibilidade.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-0 bg-surface-container p-1 rounded-full mt-unit-lg">
              {(['monthly', 'annual'] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  className={`px-unit-lg py-2 rounded-full text-body-md font-semibold transition-all ${
                    billing === b ? 'bg-primary text-on-primary shadow-lift' : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  {b === 'monthly' ? 'Mensal' : 'Anual (20% off)'}
                </button>
              ))}
            </div>
          </div>

          {/* Plans grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-unit-lg">
            {plans.map((plan) => {
              const price = billing === 'annual' ? plan.price * 12 * (1 - discount) / 12 : plan.price
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col bg-surface-container-lowest rounded-xl border-2 p-unit-xl ${
                    plan.isPopular ? 'border-primary shadow-lift-md' : 'border-outline-variant'
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary font-bold text-label-md px-unit-md py-1 rounded-full">
                      Mais escolhido
                    </div>
                  )}

                  <h2 className="text-title-lg font-bold text-on-surface mb-unit-sm">{plan.name}</h2>
                  <div className="mb-unit-lg">
                    <span className="text-headline-lg font-black text-primary">
                      {price === 0 ? 'Grátis' : formatPrice(price)}
                    </span>
                    {price > 0 && <span className="text-body-md text-secondary">/mês</span>}
                    {billing === 'annual' && price > 0 && (
                      <div className="text-label-md text-green-600 mt-1">Cobrado anualmente — economia de 20%</div>
                    )}
                  </div>

                  <ul className="flex flex-col gap-3 flex-1 mb-unit-xl">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-body-md text-on-surface">
                        <Icon name="check_circle" filled size={18} className="text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => subscribe(plan.id)}
                    loading={loading === plan.id}
                    variant={plan.isPopular ? 'primary' : 'ghost'}
                    className="w-full"
                  >
                    {price === 0 ? 'Começar grátis' : 'Assinar agora'}
                  </Button>
                </div>
              )
            })}
          </div>

          {/* FAQ / trust */}
          <div className="mt-unit-xl grid grid-cols-1 md:grid-cols-3 gap-unit-lg">
            {[
              { icon: 'credit_card', title: 'Pagamento seguro', desc: 'PIX, cartão de crédito ou boleto. Seus dados são criptografados.' },
              { icon: 'cancel', title: 'Cancele quando quiser', desc: 'Sem fidelidade. Cancele a qualquer momento, sem multas.' },
              { icon: 'support_agent', title: 'Suporte humano', desc: 'Equipe de suporte disponível por chat e e-mail.' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-unit-lg bg-surface-container-low rounded-xl">
                <Icon name={item.icon} size={28} className="text-primary shrink-0" />
                <div>
                  <div className="text-body-md font-bold text-on-surface">{item.title}</div>
                  <div className="text-body-md text-secondary">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
