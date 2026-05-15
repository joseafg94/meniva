'use client'

import { useActionState, useState, useRef, useEffect } from 'react'
import { saveBranding, BrandingState } from '@/app/actions/branding'
import Image from 'next/image'
import { Upload, Check, Palette, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const PRIMARY_OPTIONS = [
  { key: 'cyan',       label: 'Cian',          hex: '#06b6d4' },
  { key: 'lime',       label: 'Lima',          hex: '#65a30d' },
  { key: 'fuchsia',    label: 'Fucsia',        hex: '#c026d3' },
  { key: 'yellow',     label: 'Amarillo',      hex: '#eab308' },
  { key: 'sky',        label: 'Celeste',       hex: '#0ea5e9' },
  { key: 'slate',      label: 'Slate',         hex: '#475569' },
  { key: 'brown',      label: 'Marrón',        hex: '#92400e' },
  { key: 'mint',       label: 'Menta',         hex: '#10b981' },
  { key: 'magenta',    label: 'Magenta',       hex: '#d946ef' },
  { key: 'navy',       label: 'Azul Marino',   hex: '#1e3a8a' },
  { key: 'gold',       label: 'Oro',           hex: '#ca8a04' },
  { key: 'coral',      label: 'Coral',         hex: '#f97316' },
  { key: 'charcoal',   label: 'Carbón',        hex: '#1f2937' },
  { key: 'turquoise',  label: 'Turquesa',      hex: '#14b8a6' },
  { key: 'crimson',    label: 'Carmesí',       hex: '#be123c' },
]

const SECONDARY_OPTIONS = [
  { key: 'white',       label: 'Blanco',     hex: '#ffffff',  preview: 'bg-white border-zinc-200' },
  { key: 'zinc-50',     label: 'Zinc',       hex: '#fafafa',  preview: 'bg-zinc-50 border-zinc-200' },
  { key: 'slate-50',    label: 'Pizarra',    hex: '#f8fafc',  preview: 'bg-slate-50 border-zinc-200' },
  { key: 'stone-50',    label: 'Piedra',     hex: '#fafaf9',  preview: 'bg-stone-50 border-zinc-200' },
  { key: 'neutral-50',  label: 'Neutral',    hex: '#fafafa',  preview: 'bg-neutral-50 border-zinc-200' },
]

const FONT_OPTIONS = [
  { key: 'inter', label: 'Inter', family: 'Inter', desc: 'Moderna y limpia' },
  { key: 'playfair', label: 'Playfair', family: 'Playfair Display', desc: 'Elegante y serif' },
  { key: 'poppins', label: 'Poppins', family: 'Poppins', desc: 'Amigable y redondeada' },
  { key: 'lato', label: 'Lato', family: 'Lato', desc: 'Clásica y profesional' },
  { key: 'merriweather', label: 'Merriweather', family: 'Merriweather', desc: 'Formal y legible' },
  { key: 'montserrat', label: 'Montserrat', family: 'Montserrat', desc: 'Versátil y moderna' },
  { key: 'raleway', label: 'Raleway', family: 'Raleway', desc: 'Sofisticada y elegante' },
  { key: 'nunito', label: 'Nunito', family: 'Nunito', desc: 'Redondeada y fresca' },
]

interface BrandingFormProps {
  initialData: {
    logo_url: string | null
    cover_url: string | null
    primary_color: string | null
    secondary_color: string | null
    menu_font: string | null
    name: string
    description: string | null
  }
}

function colorKeyFromHex(hex: string | null, options: { key: string; hex: string }[]): string {
  if (!hex) return options[0].key
  return options.find(o => o.hex === hex)?.key ?? options[0].key
}

export function BrandingForm({ initialData }: BrandingFormProps) {
  const [state, formAction, isPending] = useActionState<BrandingState, FormData>(saveBranding, {})

  const [primaryKey, setPrimaryKey] = useState(
    colorKeyFromHex(initialData.primary_color, PRIMARY_OPTIONS)
  )
  const [secondaryKey, setSecondaryKey] = useState(
    colorKeyFromHex(initialData.secondary_color, SECONDARY_OPTIONS)
  )
  const [fontKey, setFontKey] = useState(initialData.menu_font ?? 'inter')
  const [description, setDescription] = useState(initialData.description ?? '')
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData.logo_url)
  const [coverPreview, setCoverPreview] = useState<string | null>(initialData.cover_url)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)

  const logoInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const primaryColor = PRIMARY_OPTIONS.find(o => o.key === primaryKey)!
  const secondaryColor = SECONDARY_OPTIONS.find(o => o.key === secondaryKey)!
  const fontOption = FONT_OPTIONS.find(o => o.key === fontKey) || FONT_OPTIONS[0]

  useEffect(() => {
    if (state.success) {
      setLogoFile(null)
      setCoverFile(null)
    }
  }, [state.success])

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (v: string | null) => void,
    setFile: (v: File | null) => void
  ) {
    const file = e.target.files?.[0]
    if (!file) return
    setFile(file)
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  const googleFontsUrl = `https://fonts.googleapis.com/css2?family=${FONT_OPTIONS.map(f => f.family.replace(' ', '+')).join('&family=')}:wght@400;500;600;700&display=swap`

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <link rel="stylesheet" href={googleFontsUrl} />
      {/* Form column */}
      <form action={formAction} className="space-y-6">
        {/* Hidden color inputs */}
        <input type="hidden" name="primary_color" value={primaryKey} />
        <input type="hidden" name="secondary_color" value={secondaryKey} />
        <input type="hidden" name="menu_font" value={fontKey} />

        {/* Hidden file inputs */}
        <input
          ref={logoInputRef}
          type="file"
          name="logo"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageChange(e, setLogoPreview, setLogoFile)}
        />
        <input
          ref={coverInputRef}
          type="file"
          name="cover"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageChange(e, setCoverPreview, setCoverFile)}
        />

        {/* Logo upload */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 md:p-6">
          <h2 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
            <ImageIcon size={16} aria-hidden="true" />
            Logo del restaurante
          </h2>
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-xl border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden bg-zinc-50 flex-shrink-0 cursor-pointer hover:border-zinc-300 transition-colors"
              onClick={() => logoInputRef.current?.click()}
            >
              {logoPreview ? (
                <Image src={logoPreview} alt="Logo" width={80} height={80} className="object-cover w-full h-full" />
              ) : (
                <Upload size={20} className="text-zinc-300" aria-hidden="true" />
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="text-sm font-medium text-zinc-700 hover:text-zinc-900 border border-zinc-200 px-3 py-2 rounded-lg hover:bg-zinc-50 transition-colors"
              >
                {logoPreview ? 'Cambiar logo' : 'Subir logo'}
              </button>
              {logoFile && (
                <p className="text-xs text-zinc-400 mt-1">{logoFile.name}</p>
              )}
              <p className="text-xs text-zinc-400 mt-1">PNG, JPG — máx. 5 MB</p>
            </div>
          </div>
        </div>

        {/* Restaurant name and description */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 md:p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-zinc-900 mb-2 block">
              Nombre del restaurante
            </label>
            <input
              type="text"
              readOnly
              value={initialData.name}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="description" className="text-sm font-semibold text-zinc-900 mb-2 block">
              Descripción del restaurante
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Cocina artesanal, especialidad en pastas..."
              maxLength={120}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all min-h-[80px] resize-none"
            />
            <div className="flex justify-end mt-1">
              <span className={cn("text-[10px]", description.length >= 110 ? "text-red-500" : "text-zinc-400")}>
                {description.length}/120
              </span>
            </div>
          </div>
        </div>

        {/* Cover upload */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 md:p-6">
          <h2 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
            <ImageIcon size={16} aria-hidden="true" />
            Foto de portada
          </h2>
          <div
            className="relative w-full h-28 rounded-xl border-2 border-dashed border-zinc-200 overflow-hidden bg-zinc-50 cursor-pointer hover:border-zinc-300 transition-colors flex items-center justify-center"
            onClick={() => coverInputRef.current?.click()}
          >
            {coverPreview ? (
              <Image src={coverPreview} alt="Portada" fill className="object-cover" sizes="100%" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-zinc-300">
                <Upload size={24} aria-hidden="true" />
                <span className="text-xs font-medium">Subir foto de portada</span>
              </div>
            )}
            {coverPreview && (
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full">Cambiar</span>
              </div>
            )}
          </div>
          {coverFile && (
            <p className="text-xs text-zinc-400 mt-2">{coverFile.name}</p>
          )}
          <p className="text-xs text-zinc-400 mt-1">PNG, JPG — proporción 1546 x 423 píxeles recomendada</p>
        </div>

        {/* Primary color */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 md:p-6">
          <h2 className="text-sm font-semibold text-zinc-900 mb-1 flex items-center gap-2">
            <Palette size={16} aria-hidden="true" />
            Color principal
          </h2>
          <p className="text-xs text-zinc-400 mb-4">Se aplica a precios, badges y tabs activos</p>
          <div className="flex gap-3 overflow-x-auto pb-4 scroll-smooth scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
            {PRIMARY_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                id={`primary-${opt.key}`}
                onClick={() => setPrimaryKey(opt.key)}
                className="flex flex-col items-center gap-1.5 group flex-shrink-0"
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center ring-2 ring-offset-2 transition-all"
                  style={{ 
                    backgroundColor: opt.hex,
                    boxShadow: primaryKey === opt.key ? `0 0 0 2px white, 0 0 0 4px ${opt.hex}` : 'none'
                  }}
                >
                  {primaryKey === opt.key && <Check size={14} className="text-white" aria-hidden="true" />}
                </div>
                <span className="text-[10px] text-zinc-500">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Font */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 md:p-6">
          <h2 className="text-sm font-semibold text-zinc-900 mb-1 flex items-center gap-2">
            <Palette size={16} aria-hidden="true" />
            Fuente del menú
          </h2>
          <p className="text-xs text-zinc-400 mb-4">Estilo tipográfico de tu menú público</p>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-200">
            {FONT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setFontKey(opt.key)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-all text-left",
                  fontKey === opt.key 
                    ? "border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900" 
                    : "border-zinc-200 hover:border-zinc-300"
                )}
                style={{ fontFamily: opt.family }}
              >
                <div>
                  <p className="text-base font-medium text-zinc-900">{opt.label}</p>
                  <p className="text-[10px] text-zinc-500">{opt.desc}</p>
                </div>
                {fontKey === opt.key && <Check size={16} className="text-zinc-900" />}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {state.error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-lg">{state.error}</p>
        )}
        {state.success && (
          <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-3 rounded-lg flex items-center gap-2">
            <Check size={14} aria-hidden="true" /> Branding guardado exitosamente
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Guardando...' : 'Guardar branding'}
        </button>
      </form>

      {/* Preview column */}
      <div className="lg:sticky lg:top-6 h-fit">
        <div className="bg-white border border-zinc-200 rounded-xl p-4 md:p-6">
          <h2 className="text-sm font-semibold text-zinc-900 mb-4">Vista previa del menú</h2>
          <div className="relative mx-auto w-[280px] h-[560px] bg-zinc-900 rounded-[40px] p-3 shadow-2xl ring-1 ring-zinc-700">
            {/* Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-zinc-900 rounded-full z-10" />
            
            {/* Screen */}
            <div 
              className="w-full h-full rounded-[32px] overflow-hidden text-left transition-all relative bg-white"
              style={{ backgroundColor: secondaryColor.hex, fontFamily: fontOption.family }}
            >
              {/* Cover */}
              {coverPreview && (
                <div className="h-20 w-full overflow-hidden relative">
                  <Image src={coverPreview} alt="Portada" fill className="object-cover" sizes="100%" />
                </div>
              )}
              {/* Header */}
              <div className="bg-white border-b border-zinc-100 px-3 py-3 flex items-center gap-2">
                {logoPreview ? (
                  <Image src={logoPreview} alt="Logo" width={36} height={36} className="w-9 h-9 rounded-lg object-cover border border-zinc-100 shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 shrink-0" />
                )}
                <div>
                  <p className="text-xs font-bold text-zinc-900">{initialData.name}</p>
                  <p className="text-[10px] text-zinc-400 line-clamp-1">{description || 'Descripción del restaurante'}</p>
                </div>
              </div>
              {/* Category tabs */}
              <div className="bg-white border-b border-zinc-100 px-3 py-2 flex gap-1.5 overflow-x-hidden">
                {['Entradas', 'Principales'].map((cat, i) => (
                  <span
                    key={cat}
                    className="px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap"
                    style={i === 0 ? { backgroundColor: primaryColor.hex, color: '#ffffff' } : { color: '#71717a' }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
              {/* Sample products */}
              <div className="p-3 space-y-2">
                {['Pasta Carbonara', 'Ensalada César'].map((name, i) => (
                  <div key={name} className="flex gap-2 bg-white rounded-lg border border-zinc-100 overflow-hidden shadow-sm">
                    <div className="w-14 h-14 bg-zinc-100 shrink-0" />
                    <div className="flex-1 py-2 pr-2 flex flex-col justify-between min-w-0">
                      <p className="text-[11px] font-semibold text-zinc-900 leading-tight">{name}</p>
                      <p className="text-[11px] font-bold" style={{ color: primaryColor.hex }}>
                        ${(8.50 + i * 3.5).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
