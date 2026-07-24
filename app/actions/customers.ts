'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function joinVipClub(formData: FormData) {
  const restaurant_id = formData.get('restaurant_id') as string
  const name = (formData.get('name') as string)?.trim() || null
  const country_code = (formData.get('country_code') as string)?.trim() || '+507'
  const rawPhone = (formData.get('phone') as string)?.trim() || ''

  if (!restaurant_id) {
    return { success: false, message: 'ID de restaurante no proporcionado.' }
  }

  const phone = rawPhone.replace(/\D/g, '')

  if (!phone || phone.length < 7 || phone.length > 15) {
    return { success: false, message: 'El número de teléfono debe tener entre 7 y 15 dígitos.' }
  }

  const supabase = await createClient()

  const { data: existing, error: selectError } = await supabase
    .from('customers')
    .select('id')
    .eq('restaurant_id', restaurant_id)
    .eq('country_code', country_code)
    .eq('phone', phone)
    .maybeSingle()

  if (selectError) {
    console.error('Error checking existing customer:', selectError)
    return { success: false, message: `Error DB: ${selectError.message}` }
  }

  if (existing) {
    return { success: false, message: 'Este número ya forma parte del Club VIP.' }
  }

  const { error: insertError } = await supabase.from('customers').insert({
    restaurant_id,
    name,
    country_code,
    phone,
    source: 'menu_public',
    consent_given: true,
    consent_timestamp: new Date().toISOString(),
  })

  if (insertError) {
    console.error('Error joining VIP club:', insertError)
    return { success: false, message: `Error DB: ${insertError.message}` }
  }

  revalidatePath('/dashboard/customers')

  return { success: true, message: '¡Bienvenido al Club VIP! 🎉' }
}
