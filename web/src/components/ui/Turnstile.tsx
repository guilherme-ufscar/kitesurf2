'use client'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement | string, options: Record<string, unknown>) => string
      reset: (id?: string) => void
      remove: (id?: string) => void
    }
  }
}

interface TurnstileProps {
  siteKey: string
  onVerify: (token: string) => void
  onError?: () => void
}

export function Turnstile({ siteKey, onVerify, onError }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | undefined>()

  // Mantém os callbacks atuais em refs para o efeito não depender da
  // identidade deles (evita re-render/remoção do widget em loop).
  const onVerifyRef = useRef(onVerify)
  const onErrorRef = useRef(onError)
  onVerifyRef.current = onVerify
  onErrorRef.current = onError

  useEffect(() => {
    let cancelled = false

    const script = document.getElementById('cf-turnstile-script')
    if (!script) {
      const s = document.createElement('script')
      s.id = 'cf-turnstile-script'
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      s.async = true
      document.head.appendChild(s)
    }

    const render = () => {
      if (cancelled || !containerRef.current || !window.turnstile || widgetId.current) return
      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => onVerifyRef.current(token),
        'error-callback': () => onErrorRef.current?.(),
        'expired-callback': () => onErrorRef.current?.(),
      })
    }

    let interval: ReturnType<typeof setInterval> | undefined
    if (window.turnstile) {
      render()
    } else {
      interval = setInterval(() => {
        if (window.turnstile) {
          if (interval) clearInterval(interval)
          render()
        }
      }, 100)
    }

    return () => {
      cancelled = true
      if (interval) clearInterval(interval)
      if (window.turnstile && widgetId.current) {
        window.turnstile.remove(widgetId.current)
        widgetId.current = undefined
      }
    }
    // Só recria o widget se a sitekey mudar — não depende dos callbacks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey])

  return <div ref={containerRef} className="flex justify-center" />
}
