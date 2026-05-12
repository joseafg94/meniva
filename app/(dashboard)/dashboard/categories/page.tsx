import { createClient } from '@/lib/supabase/server'
import { CreateCategoryForm, CategoryList } from '@/components/dashboard/categories/CategoryUI'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Categorías - Meniva',
}

export default async function CategoriesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get restaurant_id
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id')
    .eq('user_id', user?.id)
    .single()

  // Get categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .eq('restaurant_id', restaurant?.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Categorías</h1>
        <p className="text-sm text-zinc-500">
          Organiza los productos de tu menú por secciones.
        </p>
      </div>

      <CreateCategoryForm />
      
      <CategoryList categories={categories || []} />
    </div>
  )
}
