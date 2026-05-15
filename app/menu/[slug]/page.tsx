import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { CategoryNav } from '@/components/menu/CategoryNav'
import { MenuProductCard } from '@/components/menu/MenuProductCard'
import { PromoBanner } from '@/components/menu/PromoBanner'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('name, description')
    .eq('slug', slug)
    .single()

  if (!restaurant) {
    return { title: 'Menú no encontrado - Meniva' }
  }

  return {
    title: `${restaurant.name} — Menú Digital`,
    description: restaurant.description ?? `Explora el menú de ${restaurant.name}`,
  }
}

export default async function MenuPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch restaurant
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id, name, description, logo_url, cover_url, banner_active, banner_text, banner_color, banner_emoji, banner_expires_at, primary_color, secondary_color, menu_font')
    .eq('slug', slug)
    .single()

  if (!restaurant) {
    notFound()
  }

  // Fetch categories with their available products
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, position')
    .eq('restaurant_id', restaurant.id)
    .order('position')

  // Fetch all available products
  const { data: products } = await supabase
    .from('products')
    .select('id, name, description, price, image_url, category_id, is_available, is_featured, badge_type')
    .eq('restaurant_id', restaurant.id)
    .order('position')

  // Group products by category
  const productsByCategory = (categories ?? []).map((cat) => ({
    ...cat,
    products: (products ?? []).filter((p) => p.category_id === cat.id),
  })).filter((cat) => cat.products.length > 0)

  // Products without category
  const uncategorized = (products ?? []).filter((p) => !p.category_id)

  // Check if banner should be visible
  const isBannerVisible = restaurant.banner_active && 
    (!restaurant.banner_expires_at || new Date(restaurant.banner_expires_at) >= new Date(new Date().setHours(0,0,0,0)))

  const primaryColor = restaurant.primary_color ?? '#059669'
  const secondaryColor = restaurant.secondary_color ?? '#fafafa'

  const fontMap: Record<string, string> = {
    inter: 'Inter',
    playfair: 'Playfair Display',
    poppins: 'Poppins',
    lato: 'Lato',
    merriweather: 'Merriweather',
  }
  const fontFamily = fontMap[restaurant.menu_font ?? 'inter']

  return (
    <div 
      className="min-h-screen"
      style={{ fontFamily, backgroundColor: secondaryColor }}
    >
      <link
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@400;500;600;700&display=swap`}
      />
      {/* Promo Banner */}
      {isBannerVisible && (
        <PromoBanner 
          banner_text={restaurant.banner_text}
          banner_color={restaurant.banner_color}
          banner_emoji={restaurant.banner_emoji}
        />
      )}

      {/* Hero header */}
      <div className="bg-white border-b border-zinc-100">
        {restaurant.cover_url && (
          <div
            className="h-36 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${restaurant.cover_url})` }}
          />
        )}
        <div className="px-4 py-6 flex items-center gap-4">
          {restaurant.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={restaurant.logo_url}
              alt={restaurant.name}
              className="w-16 h-16 rounded-2xl object-cover border border-zinc-100 shrink-0 shadow-sm"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{restaurant.name}</h1>
            {restaurant.description && (
              <p className="text-sm text-zinc-400 mt-0.5 leading-relaxed">
                {restaurant.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Category nav */}
      {(categories?.length ?? 0) > 0 && (
        <CategoryNav categories={categories ?? []} primaryColor={primaryColor} />
      )}

      {/* Menu sections */}
      <div className="px-4 py-6 space-y-10 max-w-2xl mx-auto">
        {productsByCategory.map((cat) => (
          <section key={cat.id} id={cat.id}>
            <h2 className="text-base font-semibold text-zinc-900 mb-4 pb-2 border-b border-zinc-100">
              {cat.name}
            </h2>
            <div className="space-y-3">
              {cat.products.map((product) => (
                <MenuProductCard key={product.id} product={product} primaryColor={primaryColor} />
              ))}
            </div>
          </section>
        ))}

        {/* Uncategorized products */}
        {uncategorized.length > 0 && (
          <section id="sin-categoria">
            <h2 className="text-base font-semibold text-zinc-900 mb-4 pb-2 border-b border-zinc-100">
              Otros
            </h2>
            <div className="space-y-3">
              {uncategorized.map((product) => (
                <MenuProductCard key={product.id} product={product} primaryColor={primaryColor} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {productsByCategory.length === 0 && uncategorized.length === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-400 text-sm">El menú aún no tiene productos disponibles.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-6 pb-safe">
        <p className="text-[10px] text-zinc-300">
          Menú digital creado con <span className="text-emerald-500 font-medium">Meniva</span>
        </p>
      </div>
    </div>
  )
}
