'use client'

import { useState, useTransition } from 'react'
import imageCompression from 'browser-image-compression'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createProduct, updateProduct } from '@/app/actions/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
}

interface ProductFormProps {
  categories: Category[]
  initialData?: {
    id: string
    name: string
    description: string | null
    price: number
    category_id: string | null
    is_available: boolean
    image_url: string | null
  }
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter()
  const isEditing = !!initialData
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image_url ?? null)
  const [isAvailable, setIsAvailable] = useState(initialData?.is_available ?? true)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget

    startTransition(async () => {
      const formData = new FormData(form)
      formData.set('is_available', String(isAvailable))

      const rawFile = formData.get('image') as File | null
      if (rawFile && rawFile.size > 0) {
        const compressed = await imageCompression(rawFile, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 800,
          useWebWorker: true,
          fileType: 'image/webp',
        })
        formData.set('image', compressed, compressed.name)
      }

      let result
      if (isEditing) {
        formData.set('existing_image_url', initialData.image_url ?? '')
        result = await updateProduct(initialData.id, formData)
      } else {
        result = await createProduct(formData)
      }
      if (result?.error) setError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Image upload */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">Imagen del producto</label>
        <div className="relative">
          {previewUrl ? (
            <div className="relative w-full h-48 rounded-xl overflow-hidden bg-zinc-100 group">
              <Image src={previewUrl} alt="Preview" fill className="object-cover" sizes="672px" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label htmlFor="image-upload" className="cursor-pointer text-white flex flex-col items-center gap-1">
                  <Upload size={20} />
                  <span className="text-xs">Cambiar imagen</span>
                </label>
              </div>
            </div>
          ) : (
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-zinc-200 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors"
            >
              <Upload size={24} className="text-zinc-400 mb-2" />
              <span className="text-sm text-zinc-500">Subir imagen</span>
              <span className="text-xs text-zinc-400 mt-1">PNG, JPG hasta 5MB</span>
            </label>
          )}
          <input
            id="image-upload"
            name="image"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleImageChange}
          />
        </div>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">
          Nombre <span className="text-red-500">*</span>
        </label>
        <Input
          id="name"
          name="name"
          defaultValue={initialData?.name}
          placeholder="Ej: Pollo a la plancha"
          required
          disabled={isPending}
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-700 mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={initialData?.description ?? ''}
          placeholder="Descripción breve del plato..."
          disabled={isPending}
          rows={3}
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 resize-none"
        />
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-zinc-700 mb-1">
          Precio <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={initialData?.price}
            placeholder="0.00"
            required
            disabled={isPending}
            className="pl-7"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category_id" className="block text-sm font-medium text-zinc-700 mb-1">
          Categoría
        </label>
        <select
          id="category_id"
          name="category_id"
          defaultValue={initialData?.category_id ?? ''}
          disabled={isPending}
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50"
        >
          <option value="">Sin categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Availability toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={isAvailable}
          onClick={() => setIsAvailable(!isAvailable)}
          className={cn(
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
            isAvailable ? 'bg-emerald-600' : 'bg-zinc-200'
          )}
        >
          <span className={cn(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform',
            isAvailable ? 'translate-x-5' : 'translate-x-0'
          )} />
        </button>
        <div>
          <p className="text-sm font-medium text-zinc-900">
            {isAvailable ? 'Disponible' : 'No disponible'}
          </p>
          <p className="text-xs text-zinc-400">El producto aparecerá en el menú público</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
          <X size={16} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isPending ? (
            <><Loader2 size={16} className="animate-spin mr-2" /> Guardando...</>
          ) : (
            isEditing ? 'Guardar cambios' : 'Crear producto'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
