import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function MenuNotFound({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('restaurants').select('id').eq('slug', slug).single()
  if (!data) notFound()
  return null
}
