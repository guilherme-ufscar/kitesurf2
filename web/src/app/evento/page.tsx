import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { BannerSlot } from '@/components/ads/BannerSlot'

export default function EventoPage() {
  if (process.env.EVENT_MODULE_ENABLED !== 'true' && process.env.NEXT_PUBLIC_EVENT_ENABLED !== 'true') {
    return null
  }

  return (
    <>
      <Header />
      <main className="mt-28 mb-unit-xl">
        {/* Hero */}
        <div className="relative bg-primary text-on-primary py-unit-xl mb-unit-xl overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-on-primary to-transparent" />
          <div className="relative max-w-container mx-auto px-margin-desktop text-center">
            <div className="inline-flex items-center gap-2 bg-on-primary/10 rounded-full px-unit-md py-2 mb-unit-lg text-label-md uppercase tracking-wider">
              <Icon name="event" size={16} /> Evento Presencial
            </div>
            <h1 className="text-display-lg font-black mb-unit-md">KITE 360º</h1>
            <p className="text-headline-md font-bold mb-unit-sm">O Maior Encontro de Kitesurf do Norte e Nordeste</p>
            <p className="text-body-lg opacity-80 max-w-2xl mx-auto mb-unit-xl">
              Dois dias de adrenalina, negócios, experiências e conexões no universo do kitesurf.
              Na praia, com os melhores atletas, marcas e comunidade do Brasil.
            </p>
            <div className="flex justify-center gap-unit-md flex-wrap">
              <a href="#inscricao">
                <Button size="lg" className="!bg-on-primary !text-primary">Garantir minha vaga</Button>
              </a>
              <a href="#programacao">
                <Button size="lg" variant="ghost" className="!border-on-primary !text-on-primary">Ver programação</Button>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-container mx-auto px-margin-desktop">
          {/* Event info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-unit-lg mb-unit-xl">
            {[
              { icon: 'calendar_today', label: 'Data', value: 'Outubro 2025', sub: '2 dias de evento' },
              { icon: 'location_on',    label: 'Local', value: 'Praia do Cumbuco', sub: 'Caucaia, Ceará' },
              { icon: 'people',         label: 'Público', value: '2.000+', sub: 'Atletas e praticantes' },
            ].map((item) => (
              <div key={item.label} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-lg flex items-center gap-unit-md">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon name={item.icon} size={28} className="text-primary" />
                </div>
                <div>
                  <div className="text-label-md text-secondary uppercase tracking-wider">{item.label}</div>
                  <div className="text-title-lg font-bold text-on-surface">{item.value}</div>
                  <div className="text-body-md text-secondary">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Programming */}
          <section id="programacao" className="mb-unit-xl">
            <h2 className="text-headline-md font-bold text-on-surface mb-unit-lg">Programação</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
              {[
                { icon: 'surfing',      title: 'Downwinds Especiais',  desc: 'Percursos exclusivos com atletas profissionais e amadores.' },
                { icon: 'mic',         title: 'Palestras e Painéis',   desc: 'Profissionais do setor, inovações e o futuro do kitesurf.' },
                { icon: 'store',       title: 'Demo Day',              desc: 'Teste os equipamentos mais modernos do mercado.' },
                { icon: 'music_note',  title: 'Shows ao Vivo',         desc: 'Bandas locais e regionais para animar a festa.' },
                { icon: 'handshake',   title: 'Networking',            desc: 'Conecte-se com atletas, marcas e investidores do setor.' },
                { icon: 'security',    title: 'Palestras de Segurança', desc: 'Prevenção de acidentes e boas práticas no esporte.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 p-unit-md bg-surface-container-lowest border border-outline-variant rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon name={item.icon} size={22} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-body-md font-bold text-on-surface">{item.title}</div>
                    <div className="text-body-md text-secondary">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Banner */}
          <div className="mb-unit-xl">
            <BannerSlot slot="event-top" className="w-full h-32" />
          </div>

          {/* Registration form */}
          <section id="inscricao" className="mb-unit-xl">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-xl max-w-xl mx-auto">
              <h2 className="text-headline-md font-bold text-on-surface mb-unit-sm text-center">Inscreva-se no Evento</h2>
              <p className="text-body-md text-secondary text-center mb-unit-lg">Vagas limitadas. Garanta a sua agora!</p>

              <form className="flex flex-col gap-unit-md">
                <div className="grid grid-cols-2 gap-unit-md">
                  <div className="flex flex-col gap-unit-xs">
                    <label className="text-label-md uppercase tracking-wider text-on-surface">Nome</label>
                    <input placeholder="Seu nome" className="border border-outline-variant rounded-lg px-unit-md py-unit-md text-body-md focus:outline-none focus:border-primary bg-surface-container-lowest" />
                  </div>
                  <div className="flex flex-col gap-unit-xs">
                    <label className="text-label-md uppercase tracking-wider text-on-surface">WhatsApp</label>
                    <input placeholder="+55 (85) 9..." className="border border-outline-variant rounded-lg px-unit-md py-unit-md text-body-md focus:outline-none focus:border-primary bg-surface-container-lowest" />
                  </div>
                </div>
                <div className="flex flex-col gap-unit-xs">
                  <label className="text-label-md uppercase tracking-wider text-on-surface">E-mail</label>
                  <input type="email" placeholder="seu@email.com" className="border border-outline-variant rounded-lg px-unit-md py-unit-md text-body-md focus:outline-none focus:border-primary bg-surface-container-lowest" />
                </div>
                <div className="flex flex-col gap-unit-xs">
                  <label className="text-label-md uppercase tracking-wider text-on-surface">Modalidade</label>
                  <select className="border border-outline-variant rounded-lg px-unit-md py-unit-md text-body-md focus:outline-none focus:border-primary bg-surface-container-lowest">
                    <option>Kitesurf</option>
                    <option>Wingfoil</option>
                    <option>Kitefoil</option>
                    <option>Kitewave</option>
                    <option>Visitante / Espectador</option>
                  </select>
                </div>
                <Button type="submit" size="lg" className="w-full">
                  <Icon name="how_to_reg" size={20} />
                  Garantir minha vaga
                </Button>
              </form>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
