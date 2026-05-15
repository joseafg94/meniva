'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type BrandingState = {
  error?: string | null
  success?: boolean
}

const PRIMARY_COLORS: Record<string, string> = {
  cyan: '#06b6d4',
  lime: '#65a30d',
  fuchsia: '#c026d3',
  yellow: '#eab308',
  sky: '#0ea5e9',
  slate: '#475569',
  brown: '#92400e',
  mint: '#10b981',
  magenta: '#d946ef',
  navy: '#1e3a8a',
  gold: '#ca8a04',
  coral: '#f97316',
  charcoal: '#1f2937',
  turquoise: '#14b8a6',
  crimson: '#be123c',
}

const SECONDARY_COLORS: Record<string, string> = {
  white: '#ffffff',
  'zinc-50': '#fafafa',
  'slate-50': '#f8fafc',
  'stone-50': '#fafaf9',
  'neutral-50': '#fafafa',
}

async function uploadImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
  folder: string
): Promise<string> {
  const ext = file.name.split('.').pop()
  const filename = `${folder}/${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from('product-images')
    .upload(filename, file, { upsert: true, contentType: file.type })

  if (error) throw new Error('No se pudo subir la imagen. Intenta de nuevo.')

  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(filename)

  return urlData.publicUrl
}

export async function saveBranding(
  prevState: BrandingState,
  formData: FormData
): Promise<BrandingState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: restaurant, error: fetchError } = await supabase
    .from('restaurants')
    .select('id, logo_url, cover_url')
    .eq('user_id', user.id)
    .single()

  if (fetchError || !restaurant) {
    return { error: 'No se encontró tu restaurante.' }
  }

  const primaryKey = formData.get('primary_color') as string
  const secondaryKey = formData.get('secondary_color') as string
  const menuFont = formData.get('menu_font') as string
  const description = formData.get('description') as string
  const logoFile = formData.get('logo') as File | null
  const coverFile = formData.get('cover') as File | null

  const updates: Record<string, string> = {}

  if (primaryKey && PRIMARY_COLORS[primaryKey]) {
    updates.primary_color = PRIMARY_COLORS[primaryKey]
  }
  if (secondaryKey && SECONDARY_COLORS[secondaryKey]) {
    updates.secondary_color = SECONDARY_COLORS[secondaryKey]
  }
  if (menuFont) {
    updates.menu_font = menuFont
  }
  if (typeof description === 'string') {
    updates.description = description.slice(0, 120)
  }

  try {
    if (logoFile && logoFile.size > 0) {
      updates.logo_url = await uploadImage(supabase, logoFile, `logos/${restaurant.id}`)
    }
    if (coverFile && coverFile.size > 0) {
      updates.cover_url = await uploadImage(supabase, coverFile, `covers/${restaurant.id}`)
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al subir imagen.' }
  }

  if (Object.keys(updates).length === 0) {
    return { error: 'No hay cambios para guardar.' }
  }

  const { error: updateError } = await supabase
    .from('restaurants')
    .update(updates)
    .eq('id', restaurant.id)

  if (updateError) {
    return { error: 'No se pudo guardar el branding. Intenta de nuevo.' }
  }

  revalidatePath('/dashboard/branding')
  revalidatePath(`/menu`, 'layout')

  return { success: true }
}
