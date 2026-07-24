import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ReviewsForm } from '@/components/dashboard/ReviewsForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reseñas - Meniva',
}

export default async function ReviewsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('google_review_url')
    .eq('user_id', user.id)
    .single()

  if (!restaurant) {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Reseñas de Google</h1>
        <p className="text-zinc-500">Configura la redirección inteligente para las opiniones de tus clientes.</p>
      </div>

      <ReviewsForm
        initialData={{
          google_review_url: restaurant.google_review_url,
        }}
      />
    </div>
  )
}
