'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { adminApi } from '@/lib/api'
import toast from 'react-hot-toast'

const STATUS_TABS = ['all', 'active', 'paused', 'moderation', 'expired']
const STATUS_LABELS: Record<string, string> = { all: 'Todos', active: 'Ativos', paused: 'Pausados', moderation: 'Em análise', expired: 'Expirados' }

export default function AdminListingsPage() {
  const [listings, setListings] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchListings = async () => {
    setLoading(true)
    try {
      const res = await adminApi.listings({ page, status })
      setListings(res.data.data)
      setTotal(res.data.total)
    } catch { toast.error('Erro ao carregar anúncios.') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchListings() }, [page, status])

  const handleModerate = async (id: string, newStatus: string) => {
    try {
      await adminApi.moderateReport(id, newStatus)
      toast.success('Status atualizado.')
      fetchListings()
    } catch { toast.error('Erro.') }
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-surface-subtle)]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Anúncios</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{total} anúncios</p>
        </div>

        <div className="mb-4 flex gap-2">
          {STATUS_TABS.map(s => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1) }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                status === s ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]'
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
                <th className="p-4 text-left text-xs font-semibold uppercase text-[var(--color-text-secondary)]">Anúncio</th>
                <th className="p-4 text-left text-xs font-semibold uppercase text-[var(--color-text-secondary)]">Vendedor</th>
                <th className="p-4 text-left text-xs font-semibold uppercase text-[var(--color-text-secondary)]">Preço</th>
                <th className="p-4 text-left text-xs font-semibold uppercase text-[var(--color-text-secondary)]">Status</th>
                <th className="p-4 text-right text-xs font-semibold uppercase text-[var(--color-text-secondary)]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-[var(--color-text-secondary)]">Carregando...</td></tr>
              ) : listings.map((listing: any) => (
                <tr key={listing.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-subtle)] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {listing.images?.[0] && (
                        <Image src={listing.images[0].thumb} alt={listing.title} width={48} height={48} className="rounded-lg object-cover" />
                      )}
                      <span className="font-medium text-[var(--color-text-primary)] line-clamp-1">{listing.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[var(--color-text-secondary)]">{listing.seller?.name}</td>
                  <td className="p-4 text-sm font-medium text-[var(--color-text-primary)]">
                    {listing.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="p-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      listing.status === 'active' ? 'bg-green-100 text-green-700'
                      : listing.status === 'moderation' ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-600'
                    }`}>{listing.status}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {listing.status !== 'active' && (
                        <button onClick={() => handleModerate(listing.id, 'active')}
                          className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors">
                          Aprovar
                        </button>
                      )}
                      {listing.status !== 'paused' && (
                        <button onClick={() => handleModerate(listing.id, 'paused')}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors">
                          Remover
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
