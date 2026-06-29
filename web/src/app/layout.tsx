import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'KITE360º — Marketplace de Esportes Aquáticos', template: '%s | KITE360º' },
  description: 'Compre e venda kites, pranchas, wings e acessórios náuticos com segurança. O maior marketplace de kitesurf, wingfoil e kitefoil do Brasil.',
  keywords: ['kitesurf', 'wingfoil', 'kitefoil', 'kitewave', 'marketplace', 'compra', 'venda', 'equipamentos'],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'KITE360º',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="kite360-theme">
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: 'Hanken Grotesk, sans-serif',
                fontSize: '14px',
                borderRadius: '8px',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
