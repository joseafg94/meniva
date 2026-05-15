import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BannerSettings } from '@/components/dashboard/BannerSettings'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Banner Promocional - Meniva',
}

export default async function BannerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('banner_active, banner_text, banner_color, banner_emoji, banner_expires_at')
    .eq('user_id', user.id)
    .single()

  if (!restaurant) {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Configuración del Banner</h1>
        <p className="text-zinc-500">Administra el mensaje promocional que aparece en tu menú público.</p>
      </div>

      <BannerSettings 
        initialData={{
          banner_active: restaurant.banner_active ?? false,
          banner_text: restaurant.banner_text,
          banner_color: restaurant.banner_color,
          banner_emoji: restaurant.banner_emoji,
          banner_expires_at: restaurant.banner_expires_at,
        }} 
      />
    </div>
  )
}
