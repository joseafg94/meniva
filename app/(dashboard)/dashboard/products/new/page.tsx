import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProductForm } from '@/components/dashboard/products/ProductForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nuevo producto - Meniva',
}

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id')
    .eq('user_id', user.id)
    .single()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .eq('restaurant_id', restaurant?.id)
    .order('name')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Nuevo producto</h1>
        <p className="text-sm text-zinc-500">Agrega un plato o bebida a tu menú</p>
      </div>
      <ProductForm categories={categories || []} />
    </div>
  )
}
