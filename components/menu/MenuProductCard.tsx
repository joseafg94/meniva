import Image from 'next/image'
import { Package } from 'lucide-react'

interface MenuProduct {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_available: boolean
}

export function MenuProductCard({ product }: { product: MenuProduct }) {
  return (
    <div className={`flex gap-3 bg-white rounded-xl border border-zinc-100 overflow-hidden transition-opacity ${!product.is_available ? 'opacity-60' : ''}`}>
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
        
        {!product.is_available && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <span className="bg-white/90 text-zinc-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
              Agotado
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
