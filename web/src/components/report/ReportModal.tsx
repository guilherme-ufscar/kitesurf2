'use client'
import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { listingsApi, usersApi } from '@/lib/api'
import toast from 'react-hot-toast'

const LISTING_REASONS = [
  'Produto não existe / Anúncio falso',
  'Preço abusivo / Golpe',
  'Produto proibido ou ilegal',
  'Informações enganosas',
  'Contato externo no anúncio',
  'Duplicata / Spam',
  'Outro',
]

const USER_REASONS = [
  'Tentativa de golpe',
  'Assédio ou abuso',
  'Compartilhou contato externo no chat',
  'Conta falsa',
  'Conteúdo impróprio',
  'Outro',
]

interface ReportModalProps {
  open: boolean
  onClose: () => void
  targetType: 'listing' | 'user'
  targetId: string
  targetName?: string
}

export function ReportModal({ open, onClose, targetType, targetId, targetName }: ReportModalProps) {
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const reasons = targetType === 'listing' ? LISTING_REASONS : USER_REASONS

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!reason) return
    setLoading(true)
    try {
      if (targetType === 'listing') {
        await listingsApi.report(targetId, { reason, details })
      } else {
        await usersApi.report(targetId, { reason, details })
      }
      setDone(true)
    } catch {
      toast.error('Erro ao enviar denúncia. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setReason(''); setDetails(''); setDone(false)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={`Denunciar ${targetType === 'listing' ? 'anúncio' : 'usuário'}`}
      size="md"
    >
      {done ? (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <span className="material-symbols-outlined text-5xl text-green-600">check_circle</span>
          <h3 className="text-title-lg font-bold text-on-surface">Denúncia enviada</h3>
          <p className="text-body-md text-secondary">
            Nossa equipe de moderação irá analisar sua denúncia em breve.
            Obrigado por ajudar a manter a plataforma segura!
          </p>
          <Button onClick={handleClose}>Fechar</Button>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-unit-lg">
          {targetName && (
            <div className="p-3 bg-surface-container rounded-lg text-body-md text-on-surface-variant">
              Reportando: <span className="font-bold text-on-surface">{targetName}</span>
            </div>
          )}

          <div className="flex flex-col gap-unit-sm">
            <label className="text-label-md text-on-surface uppercase tracking-wider">
              Motivo da denúncia *
            </label>
            {reasons.map((r) => (
              <label key={r} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="reason"
                  value={r}
                  checked={reason === r}
                  onChange={() => setReason(r)}
                  className="w-4 h-4 text-primary border-outline-variant focus:ring-primary"
                />
                <span className="text-body-md text-on-surface group-hover:text-primary transition-colors">{r}</span>
              </label>
            ))}
          </div>

          <div className="flex flex-col gap-unit-xs">
            <label className="text-label-md text-on-surface uppercase tracking-wider">
              Detalhes adicionais (opcional)
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Descreva o problema com mais detalhes..."
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-unit-md py-unit-md text-body-md focus:outline-none focus:border-primary resize-none"
            />
            <span className="text-label-md text-outline text-right">{details.length}/500</span>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" variant="danger" loading={loading} disabled={!reason} className="flex-1">
              Enviar denúncia
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
