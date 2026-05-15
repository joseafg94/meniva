import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ProductCard, ProductsEmptyState } from '@/components/dashboard/products/ProductCard'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Productos - Meniva',
}

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id')
    .eq('user_id', user.id)
    .single()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, description, price, image_url, is_available, category_id, is_featured, badge_type, categories(id, name)')
    .eq('restaurant_id', restaurant?.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Productos</h1>
          <p className="text-sm text-zinc-500">
            {products?.length ?? 0} producto{(products?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus size={16} className="mr-1" />
            Nuevo
          </Button>
        </Link>
      </div>

      {!products || products.length === 0 ? (
        <ProductsEmptyState />
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => {
            const p = {
              ...product,
              categories: Array.isArray(product.categories)
                ? (product.categories[0] ?? null)
                : product.categories,
            }
            return <ProductCard key={product.id} product={p} />
          })}
        </div>
      )}
    </div>
  )
}
