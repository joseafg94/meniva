import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, FolderTree, QrCode } from 'lucide-react'
import { Metadata } from 'next'
import { BannerSettings } from '@/components/dashboard/BannerSettings'

export const metadata: Metadata = {
  title: 'Dashboard - Meniva',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('name, banner_active, banner_text, banner_color, banner_emoji, banner_expires_at')
    .eq('user_id', user.id)
    .single()

  const navCards = [
    {
      title: 'Productos',
      description: 'Gestiona los platos y bebidas de tu menú.',
      href: '/dashboard/products',
      icon: Package,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      title: 'Categorías',
      description: 'Organiza tu menú por secciones (Entradas, Platos Fuertes, etc.)',
      href: '/dashboard/categories',
      icon: FolderTree,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Mi QR',
      description: 'Ver y descargar el código QR de tu restaurante.',
      href: '/dashboard/qr',
      icon: QrCode,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Bienvenido a Meniva</h1>
        <p className="text-zinc-500">
          Panel de administración de <span className="font-semibold text-emerald-600">{restaurant?.name || 'tu restaurante'}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {navCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group bg-white border border-zinc-200 rounded-xl p-6 hover:border-emerald-500/50 hover:shadow-sm transition-all"
          >
            <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <card.icon size={24} />
            </div>
            <h3 className="font-semibold text-zinc-900 mb-1">{card.title}</h3>
            <p className="text-sm text-zinc-500">{card.description}</p>
          </Link>
        ))}
      </div>

      <BannerSettings 
        initialData={{
          banner_active: restaurant?.banner_active ?? false,
          banner_text: restaurant?.banner_text ?? '',
          banner_color: restaurant?.banner_color ?? '#059669',
          banner_emoji: restaurant?.banner_emoji ?? '',
          banner_expires_at: restaurant?.banner_expires_at ?? null,
        }} 
      />
    </div>
  )
}
