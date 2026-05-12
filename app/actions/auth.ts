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

  // 1. Generate a unique slug before signup to avoid orphan users
  let slug = slugify(name)
  const { data: existingSlug } = await supabase
    .from('restaurants')
    .select('slug')
    .eq('slug', slug)
    .single()

  if (existingSlug) {
    const randomSuffix = Math.random().toString(36).substring(2, 6)
    slug = `${slug}-${randomSuffix}`
  }

  // 2. Register user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError || !authData.user) {
    console.error('Error in Supabase Auth Signup:', authError)
    return { error: 'No se pudo crear la cuenta. Intenta de nuevo.' }
  }

  // 3. Create restaurant record
  // We use the access_token from the signup response to ensure RLS 'restaurants_insert_own' 
  // is satisfied immediately, as cookies might not be readable in the current request.
  let dbSupabase = supabase
  if (authData.session) {
    // If we have a session, we can create a client with the specific token
    // Alternatively, just perform the insert. Supabase-js often handles this if the session is set.
    // But to be 100% sure in a Server Action context:
    const { error: sessionError } = await supabase.auth.setSession(authData.session)
    if (sessionError) console.error('Error setting session for insert:', sessionError)
  }

  const { error: dbError } = await supabase
    .from('restaurants')
    .insert({
      user_id: authData.user.id,
      name,
      slug,
    })

  if (dbError) {
    console.error('Error inserting restaurant record:', dbError)
    // NOTE: If RLS fails here, check if email confirmation is enabled in Supabase dashboard.
    // If confirmation is required, the user won't have a session and the insert will fail RLS.
    return { error: 'Error al registrar el restaurante. Por favor, intenta de nuevo.' }
  }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
