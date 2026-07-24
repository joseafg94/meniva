import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CustomersList } from '@/components/dashboard/CustomersList'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Club VIP - Meniva',
}

export default async function CustomersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!restaurant) redirect('/dashboard')

  const { data: customers } = await supabase
    .from('customers')
    .select('id, name, country_code, phone, created_at')
    .eq('restaurant_id', restaurant.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Club VIP</h1>
        <p className="text-zinc-500">Lista de clientes capturados respetando la Ley 81 de Panamá.</p>
      </div>

      <CustomersList customers={customers || []} />
    </div>
  )
}
