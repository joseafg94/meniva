import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { YappyForm } from '@/components/dashboard/YappyForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yappy - Meniva',
}

export default async function YappyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('yappy_qr_url, yappy_active')
    .eq('user_id', user.id)
    .single()

  if (!restaurant) redirect('/dashboard')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Yappy</h1>
        <p className="text-zinc-500">Muestra un botón para que tus clientes te paguen con Yappy escaneando el QR.</p>
      </div>
      <YappyForm
        initialData={{
          yappy_qr_url: restaurant.yappy_qr_url,
          yappy_active: restaurant.yappy_active ?? false,
        }}
      />
    </div>
  )
}
