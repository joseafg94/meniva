import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { Metadata } from 'next'
import { LogOut, Store, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cuenta - Meniva',
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('name')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Mi cuenta</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Información de tu cuenta y restaurante.</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-4 px-4 py-4 border-b border-zinc-100">
          <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
            <Store size={18} className="text-zinc-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-400">Restaurante</p>
            <p className="text-sm font-medium text-zinc-900 truncate">{restaurant?.name ?? '—'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 px-4 py-4">
          <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
            <Mail size={18} className="text-zinc-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-400">Email</p>
            <p className="text-sm font-medium text-zinc-900 truncate">{user.email}</p>
          </div>
        </div>
      </div>

      <form action={logout}>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 text-sm font-medium px-4 py-3 rounded-xl transition-colors"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </form>
    </div>
  )
}
