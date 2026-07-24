'use client'

import { useState } from 'react'
import { updateWhatsAppSettings } from '@/app/actions/restaurant'
import { SubmitButton } from '@/components/ui/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MessageCircle } from 'lucide-react'

interface WhatsAppFormProps {
  initialData: {
    whatsapp_number: string | null
    whatsapp_button_type: 'Hacer Pedido' | 'Reservar Mesa' | 'Consultar' | null
    whatsapp_message: string | null
  }
}

export function WhatsAppForm({ initialData }: WhatsAppFormProps) {
  const [whatsappNumber, setWhatsappNumber] = useState(initialData.whatsapp_number || '')
  const [whatsappButtonType, setWhatsappButtonType] = useState(initialData.whatsapp_button_type || 'Consultar')
  const [whatsappMessage, setWhatsappMessage] = useState(
    initialData.whatsapp_message || 'Hola, estoy revisando el menú y me gustaría hacer una consulta / pedido.'
  )
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setStatus(null)
    try {
      const result = await updateWhatsAppSettings(formData)
      if (result.success) {
        setStatus({ type: 'success', message: result.message })
      } else {
        setStatus({ type: 'error', message: result.message })
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Ocurrió un error inesperado' })
    }
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
            <MessageCircle size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Botón de WhatsApp</h2>
            <p className="text-sm text-zinc-500">Configura la forma en que los clientes se comunicarán contigo.</p>
          </div>
        </div>
      </div>

      <form action={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="whatsapp_number">Número de WhatsApp</Label>
            <Input
              id="whatsapp_number"
              name="whatsapp_number"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="Ej: 50766778899"
            />
            <p className="text-[10px] text-zinc-400">Ingresa solo dígitos, incluyendo el código de país. Déjalo en blanco para ocultar el botón.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp_button_type">Tipo de Botón</Label>
            <select
              id="whatsapp_button_type"
              name="whatsapp_button_type"
              className="flex h-8 w-full items-center rounded-lg border border-input bg-background px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              value={whatsappButtonType}
              onChange={(e) => setWhatsappButtonType(e.target.value as 'Hacer Pedido' | 'Reservar Mesa' | 'Consultar')}
            >
              <option value="Hacer Pedido">Hacer Pedido</option>
              <option value="Reservar Mesa">Reservar Mesa</option>
              <option value="Consultar">Consultar</option>
            </select>
            <p className="text-[10px] text-zinc-400">Selecciona el texto que se mostrará en el botón flotante.</p>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-2">
            <Label htmlFor="whatsapp_message">Mensaje Precargado</Label>
            <textarea
              id="whatsapp_message"
              name="whatsapp_message"
              rows={3}
              className="flex w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30"
              value={whatsappMessage}
              onChange={(e) => setWhatsappMessage(e.target.value)}
              placeholder="Mensaje que se enviará automáticamente..."
            />
            <p className="text-[10px] text-zinc-400">Este mensaje aparecerá en el chat del cliente cuando haga click en el botón.</p>
          </div>
        </div>

        {status && (
          <div className={`p-3 rounded-lg text-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
            {status.message}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <SubmitButton className="w-full md:w-auto bg-zinc-900 hover:bg-zinc-800 text-white px-8">
            Guardar cambios
          </SubmitButton>
        </div>
      </form>
    </div>
  )
}
