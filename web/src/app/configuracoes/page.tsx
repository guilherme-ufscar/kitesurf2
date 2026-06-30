'use client'
import { useEffect, useState } from 'react'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Icon } from '@/components/ui/Icon'
import { authApi, usersApi } from '@/lib/api'
import type { User } from '@/types'
import toast from 'react-hot-toast'
import { useTheme } from 'next-themes'

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [saving, setSaving] = useState(false)
  const [savingPw, setSavingPw] = useState(false)

  useEffect(() => {
    authApi.me().then((r) => {
      setUser(r.data)
      setName(r.data.name)
      setEmail(r.data.email)
    })
  }, [])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await usersApi.updateProfile({ name })
      toast.success('Perfil atualizado!')
    } catch { toast.error('Erro ao atualizar perfil.') }
    finally { setSaving(false) }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPw !== confirmPw) { toast.error('Senhas não conferem.'); return }
    if (newPw.length < 8) { toast.error('Mínimo 8 caracteres.'); return }
    setSavingPw(true)
    try {
      await usersApi.updateProfile({ currentPassword: currentPw, newPassword: newPw })
      toast.success('Senha alterada com sucesso!')
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    } catch { toast.error('Senha atual incorreta.') }
    finally { setSavingPw(false) }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <DashboardSidebar userName={user?.name} userAvatar={user?.avatar} />

      <main className="flex-1 p-unit-xl overflow-auto">
        <div className="max-w-2xl mx-auto flex flex-col gap-unit-xl">
          <h1 className="text-headline-lg font-bold text-on-surface">Configurações</h1>

          {/* Profile */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-xl">
            <h2 className="text-title-lg font-bold text-on-surface mb-unit-lg flex items-center gap-2">
              <Icon name="person" size={22} className="text-primary" /> Perfil
            </h2>
            <form onSubmit={saveProfile} className="flex flex-col gap-unit-md">
              <div className="flex items-center gap-unit-lg mb-unit-md">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-on-primary text-3xl font-black">
                  {user?.name[0]}
                </div>
                <Button type="button" variant="ghost" size="sm">
                  <Icon name="upload" size={16} /> Trocar foto
                </Button>
              </div>
              <Input label="Nome completo" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="E-mail" type="email" value={email} disabled className="opacity-60 cursor-not-allowed" />
              <Button type="submit" loading={saving}>Salvar perfil</Button>
            </form>
          </div>

          {/* Password */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-xl">
            <h2 className="text-title-lg font-bold text-on-surface mb-unit-lg flex items-center gap-2">
              <Icon name="lock" size={22} className="text-primary" /> Segurança
            </h2>
            <form onSubmit={changePassword} className="flex flex-col gap-unit-md">
              <Input label="Senha atual" type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} required />
              <Input label="Nova senha" type="password" placeholder="Mínimo 8 caracteres" value={newPw} onChange={(e) => setNewPw(e.target.value)} required />
              <Input label="Confirmar nova senha" type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} required />
              <Button type="submit" loading={savingPw} variant="secondary">Alterar senha</Button>
            </form>
          </div>

          {/* Theme */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-xl">
            <h2 className="text-title-lg font-bold text-on-surface mb-unit-lg flex items-center gap-2">
              <Icon name="palette" size={22} className="text-primary" /> Aparência
            </h2>
            <div className="flex gap-unit-md">
              {(['light', 'dark'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`flex-1 flex items-center gap-3 p-unit-md rounded-xl border-2 transition-all ${
                    theme === t ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/50'
                  }`}
                >
                  <Icon name={t === 'light' ? 'light_mode' : 'dark_mode'} size={22} className={theme === t ? 'text-primary' : 'text-secondary'} />
                  <span className={`text-body-md font-semibold ${theme === t ? 'text-primary' : 'text-secondary'}`}>
                    {t === 'light' ? 'Claro' : 'Escuro'}
                  </span>
                  {theme === t && <Icon name="check_circle" filled size={18} className="text-primary ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-error-container/30 border border-error/20 rounded-xl p-unit-xl">
            <h2 className="text-title-lg font-bold text-error mb-unit-sm flex items-center gap-2">
              <Icon name="warning" size={22} /> Zona de perigo
            </h2>
            <p className="text-body-md text-secondary mb-unit-md">
              Excluir sua conta é permanente e irá remover todos os seus dados, anúncios e histórico.
            </p>
            <Button variant="danger" size="sm">Excluir minha conta</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
