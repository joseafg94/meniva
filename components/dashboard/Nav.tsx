'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Package, FolderTree, QrCode, Megaphone, Palette, MessageCircle, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Productos', href: '/dashboard/products', icon: Package },
  { name: 'Categorías', href: '/dashboard/categories', icon: FolderTree },
  { name: 'Branding', href: '/dashboard/branding', icon: Palette },
  { name: 'Banner', href: '/dashboard/banner', icon: Megaphone },
  { name: 'WhatsApp', href: '/dashboard/whatsapp', icon: MessageCircle },
  { name: 'Yappy', href: '/dashboard/yappy', icon: Wallet },
  { name: 'Mi QR', href: '/dashboard/qr', icon: QrCode },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-zinc-200 h-screen sticky top-0">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Meniva" width={75} height={75} />
          <span className="text-xl font-bold text-zinc-900 tracking-tight">Meniva</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-emerald-50 text-emerald-700" 
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 px-6 py-3 flex justify-around items-center z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 text-[10px] font-medium transition-colors",
              isActive ? "text-emerald-600" : "text-zinc-400"
            )}
          >
            <item.icon size={20} />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
