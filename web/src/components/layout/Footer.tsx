import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export function Footer() {
  return (
    <footer className="w-full mt-unit-xl bg-surface-container-low border-t border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-unit-xl max-w-container mx-auto">
        <div className="flex flex-col gap-unit-md">
          <Logo size={44} href={null} />
          <p className="text-body-md text-secondary">A maior plataforma de compra e venda de equipamentos náuticos do Brasil.</p>
        </div>
        <div>
          <h4 className="font-bold text-primary mb-4">Marketplace</h4>
          <ul className="flex flex-col gap-2 text-body-md text-on-secondary-container">
            {['Kitesurf', 'Wingfoil', 'Kitefoil', 'Kitewave', 'Acessórios'].map((c) => (
              <li key={c}><Link href={`/buscar?category=${c.toLowerCase()}`} className="hover:underline">{c}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-primary mb-4">Institucional</h4>
          <ul className="flex flex-col gap-2 text-body-md text-on-secondary-container">
            <li><Link href="/sobre" className="hover:underline">Sobre Nós</Link></li>
            <li><Link href="/termos" className="hover:underline">Termos de Uso</Link></li>
            <li><Link href="/privacidade" className="hover:underline">Privacidade</Link></li>
            <li><Link href="/seguranca" className="hover:underline">Segurança</Link></li>
            <li><Link href="/evento" className="hover:underline">Evento KITE360º</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-primary mb-4">Suporte</h4>
          <ul className="flex flex-col gap-2 text-body-md text-on-secondary-container">
            <li><Link href="/ajuda" className="hover:underline">Ajuda</Link></li>
            <li><Link href="/contato" className="hover:underline">Contato</Link></li>
            <li><Link href="/seguranca" className="hover:underline">Dicas de Segurança</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-outline-variant/30 py-4 px-margin-desktop max-w-container mx-auto">
        <p className="text-center text-body-md text-secondary opacity-60">
          © {new Date().getFullYear()} KITE360º — Marketplace de Esportes Aquáticos. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
