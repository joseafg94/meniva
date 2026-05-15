import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BrandingForm } from '@/components/dashboard/BrandingForm'

export const metadata = {
  title: 'Branding — Meniva',
}

export default async function BrandingPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('name, description, logo_url, cover_url, primary_color, secondary_color, menu_font')
    .eq('user_id', user.id)
    .single()

  if (!restaurant) redirect('/dashboard')

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Branding</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Personaliza el logo, la portada y los colores de tu menú público.
        </p>
      </div>
      <BrandingForm initialData={restaurant} />
    </div>
  )
}
