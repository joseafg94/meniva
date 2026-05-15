'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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
  return { restaurantId: restaurant.id, supabase }
}

async function uploadImage(supabase: Awaited<ReturnType<typeof createClient>>, file: File, restaurantId: string): Promise<string | null> {
  const ext = file.name.split('.').pop()
  const fileName = `${restaurantId}/${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, { upsert: true })

  if (error) {
    console.error('Error uploading image:', error)
    return null
  }

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName)

  return publicUrl
}

export async function createProduct(formData: FormData) {
  try {
    const { restaurantId, supabase } = await getRestaurantId()

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const categoryId = formData.get('category_id') as string || null
    const isAvailable = formData.get('is_available') === 'true'
    const imageFile = formData.get('image') as File | null

    if (!name || isNaN(price)) {
      return { error: 'El nombre y precio son requeridos' }
    }

    let imageUrl: string | null = null
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(supabase, imageFile, restaurantId)
    }

    const { error } = await supabase
      .from('products')
      .insert({
        restaurant_id: restaurantId,
        name,
        description: description || null,
        price,
        category_id: categoryId || null,
        is_available: isAvailable,
        image_url: imageUrl,
      })

    if (error) {
      console.error('Error creating product:', error)
      return { error: 'Error al crear el producto' }
    }

    revalidatePath('/dashboard/products')
  } catch (err) {
    console.error(err)
    return { error: 'Error inesperado al crear el producto' }
  }

  redirect('/dashboard/products')
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const { restaurantId, supabase } = await getRestaurantId()

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const categoryId = formData.get('category_id') as string || null
    const isAvailable = formData.get('is_available') === 'true'
    const imageFile = formData.get('image') as File | null
    const existingImageUrl = formData.get('existing_image_url') as string | null

    if (!name || isNaN(price)) {
      return { error: 'El nombre y precio son requeridos' }
    }

    let imageUrl: string | null = existingImageUrl
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(supabase, imageFile, restaurantId)
    }

    const { error } = await supabase
      .from('products')
      .update({
        name,
        description: description || null,
        price,
        category_id: categoryId || null,
        is_available: isAvailable,
        image_url: imageUrl,
      })
      .eq('id', id)
      .eq('restaurant_id', restaurantId)

    if (error) {
      console.error('Error updating product:', error)
      return { error: 'Error al actualizar el producto' }
    }

    revalidatePath('/dashboard/products')
  } catch (err) {
    console.error(err)
    return { error: 'Error inesperado al actualizar el producto' }
  }

  redirect('/dashboard/products')
}

export async function deleteProduct(id: string) {
  try {
    const { restaurantId, supabase } = await getRestaurantId()

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('restaurant_id', restaurantId)

    if (error) {
      console.error('Error deleting product:', error)
      return { error: 'Error al eliminar el producto' }
    }

    revalidatePath('/dashboard/products')
    return { success: true }
  } catch (err) {
    console.error(err)
    return { error: 'Error inesperado al eliminar el producto' }
  }
}

export async function toggleProductAvailability(id: string, isAvailable: boolean) {
  try {
    const { restaurantId, supabase } = await getRestaurantId()

    const { error } = await supabase
      .from('products')
      .update({ is_available: isAvailable })
      .eq('id', id)
      .eq('restaurant_id', restaurantId)

    if (error) {
      console.error('Error toggling product:', error)
      return { error: 'Error al actualizar el estado del producto' }
    }

    revalidatePath('/dashboard/products')
    return { success: true }
  } catch (err) {
    console.error(err)
    return { error: 'Error inesperado' }
  }
}
export async function toggleProductFeatured(id: string, isFeatured: boolean, badgeType?: string) {
  try {
    const { restaurantId, supabase } = await getRestaurantId()

    if (isFeatured) {
      const { count, error: countError } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('restaurant_id', restaurantId)
        .eq('is_featured', true)

      if (countError) throw countError
      if (count && count >= 5) {
        return { error: 'Máximo 5 productos destacados permitidos' }
      }
    }

    const { error } = await supabase
      .from('products')
      .update({ 
        is_featured: isFeatured,
        badge_type: isFeatured ? (badgeType || 'Popular') : null
      })
      .eq('id', id)
      .eq('restaurant_id', restaurantId)

    if (error) {
      console.error('Error toggling featured:', error)
      return { error: 'Error al actualizar el producto' }
    }

    revalidatePath('/dashboard/products')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err) {
    console.error(err)
    return { error: 'Error inesperado' }
  }
}
