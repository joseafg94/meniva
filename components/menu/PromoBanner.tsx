'use client'

import { useMemo } from 'react'

interface PromoBannerProps {
  banner_text: string | null
  banner_color: string | null
  banner_emoji: string | null
}

export function PromoBanner({ banner_text, banner_color, banner_emoji }: PromoBannerProps) {
  if (!banner_text) return null

  return (
    <div 
      className="w-full py-2.5 px-4 flex items-center justify-center gap-2 text-white font-medium text-sm animate-in fade-in slide-in-from-top duration-500"
      style={{ backgroundColor: banner_color || '#059669' }}
    >
      {banner_emoji && <span className="text-base">{banner_emoji}</span>}
      <p className="text-center">{banner_text}</p>
    </div>
  )
}
