import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Package, FolderTree, Palette, Megaphone,
  Wallet, MessageCircle, QrCode, Star, Users, ChevronRight
} from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - Meniva',
}

const groups = [
  {
    label: 'Gestión del Menú',
    items: [
      { title: 'Productos', description: 'Gestiona platos y bebidas', href: '/dashboard/products', icon: Package, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
      { title: 'Categorías', description: 'Organiza tu menú por secciones', href: '/dashboard/categories', icon: FolderTree, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    ],
  },
  {
    label: 'Personalización',
    items: [
      { title: 'Branding', description: 'Colores, fuentes y logo', href: '/dashboard/branding', icon: Palette, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
      { title: 'Banner', description: 'Promociones y avisos', href: '/dashboard/banner', icon: Megaphone, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
    ],
  },
  {
    label: 'Cobro y Promoción',
    items: [
      { title: 'Yappy', description: 'Recibe pagos con tu QR', href: '/dashboard/yappy', icon: Wallet, iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
      { title: 'WhatsApp', description: 'Botón de contacto directo', href: '/dashboard/whatsapp', icon: MessageCircle, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
      { title: 'Mi QR', description: 'Descarga y comparte tu código QR', href: '/dashboard/qr', icon: QrCode, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
    ],
  },
  {
    label: 'Clientes',
    items: [
      { title: 'Club VIP', description: 'Captura y lista de clientes', href: '/dashboard/customers', icon: Users, iconBg: 'bg-rose-50', iconColor: 'text-rose-600' },
      { title: 'Reseñas', description: 'Filtro inteligente de opiniones', href: '/dashboard/reviews', icon: Star, iconBg: 'bg-yellow-50', iconColor: 'text-yellow-600' },
    ],
  },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('name')
    .eq('user_id', user.id)
    .single()

  const name = restaurant?.name || 'tu restaurante'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">{name}</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Panel de Administración</p>
      </div>

      <div className="space-y-5">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold px-1 mb-1.5">
              {group.label}
            </p>
            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
              {group.items.map((item, idx) => {
                const isDisabled = item.href === '#'
                return isDisabled ? (
                  <div
                    key={item.href + idx}
                    className="flex items-center gap-4 px-4 py-4 border-b border-zinc-100 last:border-b-0 opacity-50 cursor-not-allowed"
                  >
                    <div className={`w-9 h-9 rounded-lg ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <item.icon size={18} className={item.iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900">{item.title}</p>
                      <p className="text-xs text-zinc-400 truncate">{item.description}</p>
                    </div>
                    <ChevronRight size={16} className="text-zinc-300 flex-shrink-0" />
                  </div>
                ) : (
                  <Link
                    key={item.href + idx}
                    href={item.href}
                    className="flex items-center gap-4 px-4 py-4 border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50 transition-colors group"
                  >
                    <div className={`w-9 h-9 rounded-lg ${item.iconBg} flex items-center justify-center flex-shrink-0 transition-colors`}>
                      <item.icon size={18} className={item.iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900">{item.title}</p>
                      <p className="text-xs text-zinc-400 truncate">{item.description}</p>
                    </div>
                    <ChevronRight size={16} className="text-zinc-300 flex-shrink-0 group-hover:text-zinc-500 transition-colors" />
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
