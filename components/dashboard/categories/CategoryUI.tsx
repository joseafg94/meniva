'use client'

import { useState, useTransition } from 'react'
import { createCategory, updateCategory, deleteCategory } from '@/app/actions/categories'
import { Plus, Pencil, Trash2, Check, X, Loader2, FolderTree } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function CreateCategoryForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await createCategory(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        const form = document.getElementById('create-category-form') as HTMLFormElement
        form?.reset()
      }
    })
  }

  return (
    <form id="create-category-form" action={handleSubmit} className="mb-8">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input 
            name="name" 
            placeholder="Nueva categoría (ej: Entradas)" 
            disabled={isPending}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={isPending} className="bg-emerald-600 hover:bg-emerald-700">
            {isPending ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            <span className="hidden sm:inline ml-2">Agregar</span>
          </Button>
        </div>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    </form>
  )
}

interface Category {
  id: string
  name: string
}

export function CategoryItem({ category }: { category: Category }) {
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState(category.name)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleUpdate() {
    if (!newName || newName === category.name) {
      setIsEditing(false)
      return
    }
    
    setError(null)
    startTransition(async () => {
      const result = await updateCategory(category.id, newName)
      if (result?.error) {
        setError(result.error)
      } else {
        setIsEditing(false)
      }
    })
  }

  async function handleDelete() {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) return

    setError(null)
    startTransition(async () => {
      const result = await deleteCategory(category.id)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="group bg-white border border-zinc-200 rounded-xl p-4 transition-all hover:border-zinc-300">
      <div className="flex items-center justify-between gap-4">
        {isEditing ? (
          <div className="flex-1 flex gap-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={isPending}
              autoFocus
              className="h-9"
            />
            <Button 
              size="icon" 
              onClick={handleUpdate} 
              disabled={isPending}
              className="bg-emerald-600 hover:bg-emerald-700 size-9"
            >
              {isPending ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => { setIsEditing(false); setNewName(category.name); }} 
              disabled={isPending}
              className="size-9"
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-50 rounded-lg flex items-center justify-center text-zinc-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                <FolderTree size={16} />
              </div>
              <span className="font-medium text-zinc-900">{category.name}</span>
            </div>
            <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsEditing(true)}
                className="text-zinc-400 hover:text-zinc-900 size-8"
              >
                <Pencil size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleDelete}
                disabled={isPending}
                className="text-zinc-400 hover:text-red-600 size-8"
              >
                {isPending ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
              </Button>
            </div>
          </>
        )}
      </div>
      {error && <p className="text-[10px] text-red-500 mt-2 font-medium">{error}</p>}
    </div>
  )
}

export function CategoryList({ categories }: { categories: Category[] }) {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4">
          <FolderTree className="text-zinc-400" size={24} />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 mb-1">
          No tienes categorías aún
        </h3>
        <p className="text-xs text-zinc-500 mb-6">
          Crea tu primera categoría para empezar a organizar tu menú
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  )
}
