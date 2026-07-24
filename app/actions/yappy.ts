'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function uploadQr(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
  restaurantId: string
): Promise<string> {
  const filename = `yappy/${restaurantId}/${Date.now()}.webp`

  const { error } = await supabase.storage
    .from('product-images')
    .upload(filename, file, { upsert: true, contentType: file.type })

  if (error) throw new Error('No se pudo subir el QR de Yappy. Intenta de nuevo.')

  const { data } = supabase.storage.from('product-images').getPublicUrl(filename)
  return data.publicUrl
}

export async function saveYappySettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'No autorizado' }
  }

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id, slug')
    .eq('user_id', user.id)
    .single()

  if (!restaurant) {
    return { success: false, message: 'Restaurante no encontrado' }
  }

  const yappy_active = formData.get('yappy_active') === 'true'
  const qrFile = formData.get('yappy_qr') as File | null

  const updates: { yappy_active: boolean; yappy_qr_url?: string } = { yappy_active }

  try {
    if (qrFile && qrFile.size > 0) {
      updates.yappy_qr_url = await uploadQr(supabase, qrFile, restaurant.id)
    }
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : 'Error al subir imagen.' }
  }

  const { error } = await supabase
    .from('restaurants')
    .update(updates)
    .eq('id', restaurant.id)

  if (error) {
    return { success: false, message: 'Error al guardar la configuración de Yappy' }
  }

  revalidatePath('/dashboard/yappy')
  revalidatePath(`/menu/${restaurant.slug}`)

  return { success: true, message: 'Configuración de Yappy guardada correctamente' }
}
