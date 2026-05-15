'use client'

import { useState } from 'react'
import { updateBannerSettings } from '@/app/actions/restaurant'
import { SubmitButton } from '@/components/ui/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Megaphone, Check } from 'lucide-react'

const PRESET_COLORS = [
  { name: 'Emerald', value: '#059669' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Amber', value: '#d97706' },
  { name: 'Violet', value: '#7c3aed' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Pink', value: '#db2777' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Cian', value: '#06b6d4' },
  { name: 'Lima', value: '#65a30d' },
  { name: 'Fucsia', value: '#c026d3' },
  { name: 'Amarillo', value: '#eab308' },
  { name: 'Celeste', value: '#0ea5e9' },
  { name: 'Slate', value: '#475569' },
  { name: 'Marrón', value: '#92400e' },
  { name: 'Menta', value: '#10b981' },
  { name: 'Magenta', value: '#d946ef' },
  { name: 'Azul Marino', value: '#1e3a8a' },
  { name: 'Oro', value: '#ca8a04' },
  { name: 'Coral', value: '#f97316' },
  { name: 'Carbón', value: '#1f2937' },
  { name: 'Turquesa', value: '#14b8a6' },
  { name: 'Carmesí', value: '#be123c' },
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
            <div className="flex gap-3 overflow-x-auto pb-2 scroll-smooth" style={{ maxWidth: '220px' }}>
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white transition-transform hover:scale-110 ${selectedColor === color.value ? 'ring-2 ring-offset-2 ring-zinc-400' : ''}`}
                  style={{ backgroundColor: color.value }}
                >
                  {selectedColor === color.value && <Check size={14} />}
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
