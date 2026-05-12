'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { slugify } from '@/lib/utils'

export type AuthState = {
  error?: string | null
  success?: boolean
}

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'El email y la contraseña son requeridos' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Credenciales inválidas. Por favor, intenta de nuevo.' }
  }

  redirect('/dashboard')
}

export async function register(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!name || !email || !password) {
    return { error: 'Todos los campos son requeridos' }
  }

  const supabase = await createClient()

  // Register user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError || !authData.user) {
    return { error: 'No se pudo crear la cuenta. Intenta de nuevo.' }
  }

  // Create restaurant record
  const slug = slugify(name)
  
  // We handle slug collisions by simply appending random chars in a real app, 
  // but for the MVP, let's keep it simple. If it fails due to unique constraint, we return an error.
  const { error: dbError } = await supabase
    .from('restaurants')
    .insert({
      user_id: authData.user.id,
      name,
      slug,
    })

  if (dbError) {
    // Attempt rollback/cleanup would go here in production
    return { error: 'Error al registrar el restaurante. Es posible que el nombre ya esté en uso.' }
  }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
