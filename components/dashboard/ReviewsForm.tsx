'use client'

import { useState } from 'react'
import { saveGoogleReviewSettings } from '@/app/actions/restaurant'
import { SubmitButton } from '@/components/ui/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Star } from 'lucide-react'

interface ReviewsFormProps {
  initialData: {
    google_review_url: string | null
  }
}

export function ReviewsForm({ initialData }: ReviewsFormProps) {
  const [googleReviewUrl, setGoogleReviewUrl] = useState(initialData.google_review_url || '')
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setStatus(null)
    try {
      const result = await saveGoogleReviewSettings(formData)
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
          <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center">
            <Star size={20} className="fill-amber-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Filtro Inteligente de Reseñas</h2>
            <p className="text-sm text-zinc-500">Redirige a clientes contentos a Google y atiende quejas en WhatsApp.</p>
          </div>
        </div>
      </div>

      <form action={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="google_review_url">Enlace de Reseñas de Google</Label>
          <Input
            id="google_review_url"
            name="google_review_url"
            type="url"
            value={googleReviewUrl}
            onChange={(e) => setGoogleReviewUrl(e.target.value)}
            placeholder="Pega aquí el enlace directo a tus reseñas de Google"
          />
          <p className="text-[10px] text-zinc-400">
            Ingresa la URL de tu negocio en Google Maps donde los clientes pueden dejar opiniones directamente.
          </p>
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
