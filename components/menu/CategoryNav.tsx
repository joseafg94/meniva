'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
}

export function CategoryNav({ categories, primaryColor = '#059669' }: { categories: Category[]; primaryColor?: string }) {
  const [active, setActive] = useState<string>(categories[0]?.id ?? '')
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
            // Scroll the nav pill into view
            const btn = navRef.current?.querySelector(`[data-id="${entry.target.id}"]`)
            btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    )

    for (const cat of categories) {
      const el = document.getElementById(cat.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [categories])

  function handleClick(id: string) {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  if (categories.length === 0) return null

  return (
    <div
      ref={navRef}
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-zinc-100 overflow-x-auto no-scrollbar"
    >
      <div className="flex gap-1 px-4 py-2 min-w-max">
        {categories.map((cat) => (
          <button
            key={cat.id}
            data-id={cat.id}
            onClick={() => handleClick(cat.id)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              active === cat.id
                ? 'text-white'
                : 'text-zinc-600 hover:bg-zinc-100'
            )}
            style={active === cat.id ? { backgroundColor: primaryColor } : undefined}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}
