import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { MenuClient } from '@/components/menu/MenuClient'
import { Metadata } from 'next'

export const revalidate = 30

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
    .select('id, name, description, logo_url, cover_url, banner_active, banner_text, banner_color, banner_emoji, banner_expires_at, primary_color, secondary_color, menu_font, whatsapp_number, whatsapp_button_type, whatsapp_message, yappy_qr_url, yappy_active, google_review_url, is_open, footer_address, footer_phone')
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

  // Check if banner should be visible
  const isBannerVisible = !!(restaurant.banner_active && 
    (!restaurant.banner_expires_at || new Date(restaurant.banner_expires_at) >= new Date(new Date().setHours(0,0,0,0))))

  return (
    <MenuClient
      restaurant={restaurant}
      categories={categories ?? []}
      products={products ?? []}
      isBannerVisible={isBannerVisible}
    />
  )
}

