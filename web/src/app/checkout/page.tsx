'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Input } from '@/components/ui/Input'
import toast from 'react-hot-toast'

function CheckoutContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [method, setMethod] = useState<'pix' | 'card'>('pix')
  const [loading, setLoading] = useState(false)

  async function pay(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    toast.success('Pagamento realizado com sucesso!')
    router.push('/painel')
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto py-unit-xl">
      <h1 className="text-headline-lg font-bold text-on-surface mb-unit-xl">Checkout Seguro</h1>

      <div className="flex flex-col lg:flex-row gap-unit-xl">
        {/* Payment form */}
        <div className="flex-1">
          {/* Payment methods */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg mb-unit-lg">
            <h2 className="text-title-lg font-bold text-on-surface mb-unit-md">Forma de pagamento</h2>
            <div className="flex gap-unit-sm mb-unit-lg">
              {(['pix', 'card'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`flex-1 flex items-center gap-3 p-unit-md rounded-xl border-2 transition-all ${
                    method === m ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/40'
                  }`}
                >
                  <Icon name={m === 'pix' ? 'qr_code' : 'credit_card'} size={22} className={method === m ? 'text-primary' : 'text-secondary'} />
                  <span className={`text-body-md font-semibold ${method === m ? 'text-primary' : 'text-secondary'}`}>
                    {m === 'pix' ? 'PIX' : 'Cartão'}
                  </span>
                </button>
              ))}
            </div>

            <form onSubmit={pay} className="flex flex-col gap-unit-md">
              {method === 'pix' ? (
                <div className="flex flex-col items-center gap-4 py-unit-lg">
                  <div className="w-48 h-48 bg-surface-container border-2 border-outline-variant rounded-xl flex items-center justify-center">
                    <Icon name="qr_code_2" size={120} className="text-on-surface" />
                  </div>
                  <p className="text-body-md text-secondary text-center">
                    Escaneie o QR code com o app do seu banco para pagar via PIX.
                  </p>
                  <div className="w-full bg-surface-container rounded-lg px-unit-md py-3 flex items-center gap-3">
                    <code className="flex-1 text-body-md text-on-surface truncate text-[12px]">
                      00020101021126580014br.gov.bcb.pix...kite360.pix.key
                    </code>
                    <button
                      type="button"
                      onClick={() => { navigator.clipboard.writeText('kite360.pix.key'); toast.success('Código copiado!') }}
                      className="text-primary hover:text-primary-container"
                    >
                      <Icon name="content_copy" size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Input label="Número do cartão" placeholder="0000 0000 0000 0000" />
                  <div className="grid grid-cols-2 gap-unit-md">
                    <Input label="Validade" placeholder="MM/AA" />
                    <Input label="CVV" placeholder="000" />
                  </div>
                  <Input label="Nome no cartão" placeholder="Como está no cartão" />
                </>
              )}

              <Button type="submit" loading={loading} size="lg" className="w-full mt-unit-md">
                <Icon name="lock" size={18} />
                {method === 'pix' ? 'Confirmar pagamento PIX' : 'Pagar com cartão'}
              </Button>
            </form>
          </div>
        </div>

        {/* Order summary */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg sticky top-32">
            <h2 className="text-title-lg font-bold text-on-surface mb-unit-md">Resumo do pedido</h2>
            <div className="flex flex-col gap-3 mb-unit-md pb-unit-md border-b border-outline-variant">
              <div className="flex justify-between text-body-md">
                <span className="text-secondary">Plano Pro (mensal)</span>
                <span className="font-bold">R$ 29,90</span>
              </div>
              <div className="flex justify-between text-body-md text-green-600">
                <span>Desconto boas-vindas</span>
                <span>- R$ 0,00</span>
              </div>
            </div>
            <div className="flex justify-between text-title-lg font-black text-on-surface mb-unit-lg">
              <span>Total</span>
              <span>R$ 29,90</span>
            </div>

            <div className="flex flex-col gap-2">
              {['Pagamento 100% seguro', 'Cancele quando quiser', 'Nota fiscal por e-mail'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-body-md text-secondary">
                  <Icon name="check_circle" filled size={16} className="text-primary shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="header-offset px-margin-desktop mb-unit-xl max-w-container mx-auto">
        <Suspense>
          <CheckoutContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
