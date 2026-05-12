import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ProductForm } from '@/components/dashboard/products/ProductForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Editar producto - Meniva',
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id')
    .eq('user_id', user.id)
    .single()

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, description, price, category_id, is_available, image_url')
      .eq('id', id)
      .eq('restaurant_id', restaurant?.id)
      .single(),
    supabase
      .from('categories')
      .select('id, name')
      .eq('restaurant_id', restaurant?.id)
      .order('name'),
  ])

  if (!product) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Editar producto</h1>
        <p className="text-sm text-zinc-500">{product.name}</p>
      </div>
      <ProductForm categories={categories || []} initialData={product} />
    </div>
  )
}
