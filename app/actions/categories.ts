'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function getRestaurantId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('No autenticado')

  const { data: restaurant, error } = await supabase
    .from('restaurants')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (error || !restaurant) throw new Error('Restaurante no encontrado')
  
  return restaurant.id
}

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string
  if (!name) return { error: 'El nombre es requerido' }

  try {
    const restaurantId = await getRestaurantId()
    const supabase = await createClient()

    const { error } = await supabase
      .from('categories')
      .insert({
        name,
        restaurant_id: restaurantId
      })

    if (error) throw error

    revalidatePath('/dashboard/categories')
    return { success: true }
  } catch (err) {
    console.error(err)
    return { error: 'Error al crear la categoría' }
  }
}

export async function updateCategory(id: string, name: string) {
  if (!name) return { error: 'El nombre es requerido' }

  try {
    const restaurantId = await getRestaurantId()
    const supabase = await createClient()

    const { error } = await supabase
      .from('categories')
      .update({ name })
      .eq('id', id)
      .eq('restaurant_id', restaurantId)

    if (error) throw error

    revalidatePath('/dashboard/categories')
    return { success: true }
  } catch (err) {
    console.error(err)
    return { error: 'Error al actualizar la categoría' }
  }
}

export async function deleteCategory(id: string) {
  try {
    const restaurantId = await getRestaurantId()
    const supabase = await createClient()

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('restaurant_id', restaurantId)

    if (error) throw error

    revalidatePath('/dashboard/categories')
    return { success: true }
  } catch (err) {
    console.error(err)
    return { error: 'Error al eliminar la categoría' }
  }
}
