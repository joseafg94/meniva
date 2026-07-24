import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { WhatsAppForm } from '@/components/dashboard/WhatsAppForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Botón de WhatsApp - Meniva',
}

export default async function WhatsAppPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('whatsapp_number, whatsapp_button_type, whatsapp_message')
    .eq('user_id', user.id)
    .single()

  if (!restaurant) {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Botón de WhatsApp</h1>
        <p className="text-zinc-500">Configura un botón flotante para que tus clientes te contacten directamente.</p>
      </div>

      <WhatsAppForm
        initialData={{
          whatsapp_number: restaurant.whatsapp_number,
          whatsapp_button_type: restaurant.whatsapp_button_type as 'Hacer Pedido' | 'Reservar Mesa' | 'Consultar' | null,
          whatsapp_message: restaurant.whatsapp_message,
        }}
      />
    </div>
  )
}
