'use client'

import { useState, useEffect } from 'react'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { Icon } from '@/components/ui/Icon'
import { adminApi } from '@/lib/api'
import toast from 'react-hot-toast'

interface AdminUser {
  id: string; name: string; email: string
  isVerified: boolean; isBanned: boolean; isAdmin: boolean; createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = { page }
      if (search) params.search = search
      const res = await adminApi.users(params)
      setUsers(res.data.data)
      setTotal(res.data.total)
    } catch { toast.error('Erro ao carregar usuários.') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [page, search])

  const handleBan = async (id: string, banned: boolean) => {
    try {
      await adminApi.banUser(id)
      toast.success(banned ? 'Ação realizada.' : 'Usuário banido.')
      fetchUsers()
    } catch { toast.error('Erro.') }
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-surface-subtle)]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Usuários</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">{total} cadastrados</p>
          </div>
          <div className="relative w-72">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" size={20} />
            <input
              type="text" placeholder="Buscar por nome ou e-mail..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-9 pr-4 text-sm focus:border-[var(--color-primary)] focus:outline-none"
            />
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
                <th className="p-4 text-left text-xs font-semibold uppercase text-[var(--color-text-secondary)]">Usuário</th>
                <th className="p-4 text-left text-xs font-semibold uppercase text-[var(--color-text-secondary)]">Status</th>
                <th className="p-4 text-left text-xs font-semibold uppercase text-[var(--color-text-secondary)]">Cadastro</th>
                <th className="p-4 text-right text-xs font-semibold uppercase text-[var(--color-text-secondary)]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-[var(--color-text-secondary)]">Carregando...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-[var(--color-text-secondary)]">Nenhum usuário encontrado.</td></tr>
              ) : users.map(user => (
                <tr key={user.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-subtle)] transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-[var(--color-text-primary)]">{user.name}</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">{user.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {user.isBanned && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Banido</span>}
                      {user.isVerified && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">Verificado</span>}
                      {user.isAdmin && <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">Admin</span>}
                      {!user.isBanned && !user.isVerified && !user.isAdmin && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">Normal</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[var(--color-text-secondary)]">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleBan(user.id, user.isBanned)} disabled={user.isAdmin}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 ${
                        user.isBanned ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}>
                      {user.isBanned ? 'Desbanir' : 'Banir'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {total > 20 && (
          <div className="mt-4 flex justify-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm disabled:opacity-50 hover:bg-[var(--color-surface-subtle)]">Anterior</button>
            <span className="px-4 py-2 text-sm text-[var(--color-text-secondary)]">Página {page} de {Math.ceil(total / 20)}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 20)}
              className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm disabled:opacity-50 hover:bg-[var(--color-surface-subtle)]">Próxima</button>
          </div>
        )}
      </main>
    </div>
  )
}
