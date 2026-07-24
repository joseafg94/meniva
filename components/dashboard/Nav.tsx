'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, Eye, Star, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavProps {
  slug: string
  restaurantName?: string
}

interface BottomNavProps {
  slug: string
}

function getNavItems(slug: string) {
  return [
    { name: 'Inicio', href: '/dashboard', icon: Home, exact: true },
    { name: 'Vista previa', href: `/menu/${slug}`, icon: Eye, external: true },
    { name: 'Reseñas', href: '/dashboard/reviews', icon: Star },
    { name: 'Cuenta', href: '/dashboard/account', icon: User },
  ]
}

export function Sidebar({ slug, restaurantName }: NavProps) {
  const pathname = usePathname()
  const navItems = getNavItems(slug)

  return (
    <aside className="hidden md:flex flex-col w-60 bg-white border-r border-zinc-200 h-screen sticky top-0">
      <div className="p-5 border-b border-zinc-100">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="Meniva" width={32} height={32} />
          <span className="text-base font-bold text-zinc-900 tracking-tight">Meniva</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)

          if (item.external) {
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              >
                <item.icon size={18} aria-hidden="true" />
                {item.name}
              </a>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              )}
            >
              <item.icon size={18} aria-hidden="true" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      {restaurantName && (
        <div className="p-4 border-t border-zinc-100">
          <p className="text-xs text-zinc-400 truncate">{restaurantName}</p>
        </div>
      )}
    </aside>
  )
}

export function BottomNav({ slug }: BottomNavProps) {
  const pathname = usePathname()
  const navItems = getNavItems(slug)

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 px-2 py-2 flex justify-around items-center z-50">
      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href)

        if (item.external) {
          return (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors text-zinc-400 px-3"
            >
              <item.icon size={20} aria-hidden="true" />
              {item.name}
            </a>
          )
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors px-3',
              isActive ? 'text-emerald-600' : 'text-zinc-400'
            )}
          >
            <item.icon size={20} aria-hidden="true" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
