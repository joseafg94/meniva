'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateBannerSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No autorizado')
  }

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id, slug')
    .eq('user_id', user.id)
    .single()

  if (!restaurant) {
    throw new Error('Restaurante no encontrado')
  }

  const banner_active = formData.get('banner_active') === 'on'
  const banner_text = formData.get('banner_text') as string
  const banner_color = formData.get('banner_color') as string
  const banner_emoji = formData.get('banner_emoji') as string
  const banner_expires_at = (formData.get('banner_expires_at') as string) || null

  const { error } = await supabase
    .from('restaurants')
    .update({
      banner_active: Boolean(banner_active),
      banner_text,
      banner_color,
      banner_emoji,
      banner_expires_at: banner_expires_at,
    })
    .eq('id', restaurant.id)

  if (error) {
    console.error('Error updating banner:', error)
    return { success: false, message: 'Error al guardar los cambios' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/banner')
  revalidatePath(`/menu/${restaurant.slug}`)

  return { success: true, message: 'Banner actualizado correctamente' }
}

export async function updateWhatsAppSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No autorizado')
  }

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id, slug')
    .eq('user_id', user.id)
    .single()

  if (!restaurant) {
    throw new Error('Restaurante no encontrado')
  }

  const whatsapp_number = formData.get('whatsapp_number') as string
  const whatsapp_button_type = formData.get('whatsapp_button_type') as 'Hacer Pedido' | 'Reservar Mesa' | 'Consultar'
  const whatsapp_message = formData.get('whatsapp_message') as string

  const sanitizedNumber = whatsapp_number ? whatsapp_number.replace(/\D/g, '') : ''

  if (whatsapp_number && !/^\d+$/.test(whatsapp_number)) {
    return { success: false, message: 'El número de WhatsApp debe contener solo dígitos.' }
  }

  if (sanitizedNumber && !whatsapp_message) {
    return { success: false, message: 'El mensaje precargado es obligatorio.' }
  }

  const { error } = await supabase
    .from('restaurants')
    .update({
      whatsapp_number: sanitizedNumber || null,
      whatsapp_button_type: sanitizedNumber ? whatsapp_button_type : null,
      whatsapp_message: sanitizedNumber ? whatsapp_message : null,
    })
    .eq('id', restaurant.id)

  if (error) {
    console.error('Error updating whatsapp settings:', error)
    return { success: false, message: 'Error al guardar los cambios' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/whatsapp')
  revalidatePath(`/menu/${restaurant.slug}`)

  return { success: true, message: 'Configuración de WhatsApp guardada correctamente' }
}
