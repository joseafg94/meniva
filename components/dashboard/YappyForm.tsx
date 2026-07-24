'use client'

import { useState, useRef, useTransition } from 'react'
import imageCompression from 'browser-image-compression'
import Image from 'next/image'
import { saveYappySettings } from '@/app/actions/yappy'
import { SubmitButton } from '@/components/ui/submit-button'
import { Label } from '@/components/ui/label'
import { QrCode, Upload } from 'lucide-react'

interface YappyFormProps {
  initialData: {
    yappy_qr_url: string | null
    yappy_active: boolean
  }
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']

export function YappyForm({ initialData }: YappyFormProps) {
  const [active, setActive] = useState(initialData.yappy_active)
  const [qrPreview, setQrPreview] = useState<string | null>(initialData.yappy_qr_url)
  const [qrFile, setQrFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null)
    const file = e.target.files?.[0]
    if (!file) return
    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError('Solo se permiten imágenes JPG, PNG o WebP')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError('La imagen no puede superar 5 MB')
      return
    }
    setQrFile(file)
    setQrPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus(null)
    const formData = new FormData()
    formData.set('yappy_active', String(active))

    if (qrFile && qrFile.size > 0) {
      const compressed = await imageCompression(qrFile, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: 'image/webp',
      })
      formData.set('yappy_qr', compressed, compressed.name)
    }

    startTransition(async () => {
      const result = await saveYappySettings(formData)
      if (result.success) {
        setStatus({ type: 'success', message: result.message })
        setQrFile(null)
      } else {
        setStatus({ type: 'error', message: result.message })
      }
    })
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-zinc-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-lg flex items-center justify-center">
          <QrCode size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Botón de Yappy</h2>
          <p className="text-sm text-zinc-500">Permite que tus clientes te paguen con Yappy escaneando tu QR.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Toggle */}
        <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg border border-zinc-100">
          <div>
            <Label className="text-base font-medium text-zinc-900">Activar botón de Yappy</Label>
            <p className="text-xs text-zinc-500 mt-0.5">Si está apagado, el botón no aparecerá en tu menú.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={active}
            onClick={() => setActive(!active)}
            className={`relative w-10 h-5 rounded-full transition-colors ${active ? 'bg-violet-600' : 'bg-zinc-200'}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
        </div>

        {/* QR Upload */}
        <div className="space-y-3">
          <Label>QR de Yappy</Label>
          <div className="flex items-start gap-4">
            <div
              className="w-36 h-36 rounded-xl border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden bg-zinc-50 flex-shrink-0 cursor-pointer hover:border-zinc-300 transition-colors"
              onClick={() => inputRef.current?.click()}
            >
              {qrPreview ? (
                <Image
                  src={qrPreview}
                  alt="QR de Yappy"
                  width={144}
                  height={144}
                  className="object-contain w-full h-full p-1"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-300">
                  <Upload size={24} />
                  <span className="text-xs font-medium">Subir QR</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-sm font-medium text-zinc-700 hover:text-zinc-900 border border-zinc-200 px-3 py-2 rounded-lg hover:bg-zinc-50 transition-colors"
              >
                {qrPreview ? 'Cambiar QR' : 'Subir QR de Yappy'}
              </button>
              {qrFile && <p className="text-xs text-zinc-400">{qrFile.name}</p>}
              <p className="text-xs text-zinc-400">PNG, JPG — máx. 5 MB</p>
              {fileError && <p className="text-sm text-red-500">{fileError}</p>}
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {status && (
          <div className={`p-3 rounded-lg text-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
            {status.message}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <SubmitButton
            disabled={isPending}
            className="w-full md:w-auto bg-zinc-900 hover:bg-zinc-800 text-white px-8"
          >
            {isPending ? 'Guardando...' : 'Guardar cambios'}
          </SubmitButton>
        </div>
      </form>
    </div>
  )
}
