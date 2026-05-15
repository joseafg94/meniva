import Image from 'next/image'
import { Package } from 'lucide-react'

interface MenuProduct {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_available: boolean
  is_featured: boolean
  badge_type: string | null
}

export function MenuProductCard({ product }: { product: MenuProduct }) {
  const badgeStyles = {
    'Popular': 'bg-amber-100 text-amber-700 border-amber-200',
    'Nuevo': 'bg-blue-100 text-blue-700 border-blue-200',
    'Recomendado': 'bg-emerald-100 text-emerald-700 border-emerald-200'
  }[product.badge_type || 'Popular']

  const highlightStyles = product.is_featured ? {
    'Popular': 'border-amber-200 bg-amber-50/30',
    'Nuevo': 'border-blue-200 bg-blue-50/30',
    'Recomendado': 'border-emerald-200 bg-emerald-50/30'
  }[product.badge_type || 'Popular'] : 'border-zinc-100'

  return (
    <div className={`flex gap-3 bg-white rounded-xl border overflow-hidden transition-all ${highlightStyles} ${!product.is_available ? 'opacity-60' : ''}`}>
      {/* Image */}
      <div className="relative w-24 h-24 shrink-0 bg-zinc-50">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-200">
            <Package size={28} />
          </div>
        )}
        
        {!product.is_available ? (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <span className="bg-white/90 text-zinc-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
              Agotado
            </span>
          </div>
        ) : product.is_featured && (
          <div className="absolute top-1 left-1">
            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-tight shadow-sm ${badgeStyles}`}>
              {product.badge_type}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 py-3 pr-3 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-semibold text-zinc-900 text-sm leading-tight">{product.name}</h3>
          {product.description && (
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
        <p className="text-sm font-bold text-emerald-600 mt-2">
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
    </div>
  )
}
