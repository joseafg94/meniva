'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { deleteProduct, toggleProductAvailability } from '@/app/actions/products'
import { Pencil, Trash2, Loader2, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_available: boolean
  category_id: string | null
  categories: Category | null
}

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-emerald-600' : 'bg-zinc-200'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg transition-transform',
          checked ? 'translate-x-4' : 'translate-x-0'
        )}
      />
    </button>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleToggle(val: boolean) {
    setError(null)
    startTransition(async () => {
      const result = await toggleProductAvailability(product.id, val)
      if (result?.error) setError(result.error)
    })
  }

  function handleDelete() {
    if (!confirm('¿Eliminar este producto?')) return
    setError(null)
    startTransition(async () => {
      const result = await deleteProduct(product.id)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className={cn(
      'group bg-white border border-zinc-200 rounded-xl overflow-hidden transition-all hover:border-zinc-300 hover:shadow-sm',
      !product.is_available && 'opacity-70'
    )}>
      <div className="relative h-36 bg-zinc-100">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-300">
            <Package size={40} />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={cn(
            'text-[10px] font-semibold px-2 py-0.5 rounded-full',
            product.is_available
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-zinc-100 text-zinc-500'
          )}>
            {product.is_available ? 'Disponible' : 'Agotado'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2">
          {product.categories && (
            <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">
              {product.categories.name}
            </span>
          )}
          <h3 className="font-semibold text-zinc-900 leading-tight">{product.name}</h3>
          {product.description && (
            <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2">{product.description}</p>
          )}
        </div>

        <p className="text-base font-bold text-emerald-600 mb-3">
          ${Number(product.price).toFixed(2)}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPending
              ? <Loader2 size={16} className="animate-spin text-zinc-400" />
              : <Toggle checked={product.is_available} onChange={handleToggle} />
            }
            <span className="text-xs text-zinc-500">
              {product.is_available ? 'Disponible' : 'Agotado'}
            </span>
          </div>

          <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <Link href={`/dashboard/products/${product.id}/edit`}>
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-900 size-8">
                <Pencil size={15} />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isPending}
              className="text-zinc-400 hover:text-red-600 size-8"
            >
              {isPending ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            </Button>
          </div>
        </div>

        {error && <p className="text-[10px] text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  )
}

export function ProductsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4">
        <Package className="text-zinc-400" size={24} />
      </div>
      <h3 className="text-sm font-semibold text-zinc-900 mb-1">No tienes productos aún</h3>
      <p className="text-xs text-zinc-500 mb-6">Agrega tu primer producto al menú</p>
      <Link href="/dashboard/products/new">
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
          + Agregar producto
        </Button>
      </Link>
    </div>
  )
}
