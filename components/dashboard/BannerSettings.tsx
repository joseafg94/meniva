'use client'

import { useState } from 'react'
import { updateBannerSettings } from '@/app/actions/restaurant'
import { SubmitButton } from '@/components/ui/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Megaphone, Check } from 'lucide-react'

const PRESET_COLORS = [
  { name: 'Emerald', value: '#059669', bg: 'bg-emerald-600' },
  { name: 'Rose', value: '#e11d48', bg: 'bg-rose-600' },
  { name: 'Blue', value: '#2563eb', bg: 'bg-blue-600' },
  { name: 'Amber', value: '#d97706', bg: 'bg-amber-600' },
  { name: 'Zinc', value: '#52525b', bg: 'bg-zinc-600' },
]

interface BannerSettingsProps {
  initialData: {
    banner_active: boolean
    banner_text: string | null
    banner_color: string | null
    banner_emoji: string | null
    banner_expires_at: string | null
  }
}

export function BannerSettings({ initialData }: BannerSettingsProps) {
  const [selectedColor, setSelectedColor] = useState(initialData.banner_color || '#059669')
  const [active, setActive] = useState(initialData.banner_active)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setStatus(null)
    try {
      const result = await updateBannerSettings(formData)
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
            <Megaphone size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Banner promocional</h2>
            <p className="text-sm text-zinc-500">Muestra avisos o promociones arriba de tu menú.</p>
          </div>
        </div>
      </div>

      <form action={handleSubmit} className="p-6 space-y-6">
        <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg border border-zinc-100">
          <div>
            <Label htmlFor="banner_active" className="text-base font-medium text-zinc-900">Activar banner</Label>
            <p className="text-xs text-zinc-500">Si está apagado, no se mostrará nada en el menú.</p>
          </div>
          <input
            type="checkbox"
            id="banner_active"
            name="banner_active"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-10 h-5 bg-zinc-200 rounded-full appearance-none cursor-pointer checked:bg-emerald-500 transition-colors relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all checked:after:translate-x-5"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="banner_text">Mensaje promocional</Label>
            <Input
              id="banner_text"
              name="banner_text"
              defaultValue={initialData.banner_text || ''}
              placeholder="Ej: ¡2x1 en Margaritas todos los jueves!"
              required={active}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner_emoji">Emoji (opcional)</Label>
            <Input
              id="banner_emoji"
              name="banner_emoji"
              defaultValue={initialData.banner_emoji || ''}
              placeholder="🔥, 🎁, ⭐..."
              maxLength={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Color de fondo</Label>
            <div className="flex gap-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-8 h-8 rounded-full ${color.bg} flex items-center justify-center text-white transition-transform hover:scale-110`}
                >
                  {selectedColor === color.value && <Check size={16} />}
                </button>
              ))}
            </div>
            <input type="hidden" name="banner_color" value={selectedColor} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner_expires_at">Fecha de vigencia (opcional)</Label>
            <Input
              id="banner_expires_at"
              name="banner_expires_at"
              type="date"
              defaultValue={initialData.banner_expires_at || ''}
            />
            <p className="text-[10px] text-zinc-400">El banner se ocultará automáticamente después de esta fecha.</p>
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
