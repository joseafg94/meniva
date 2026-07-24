'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { QRCodeSVG } from 'qrcode.react'
import { Download, Copy, Check, Loader2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function QRPage() {
  const [slug, setSlug] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const qrWrapperRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    async function getRestaurant() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('restaurants')
          .select('slug, logo_url')
          .eq('user_id', user.id)
          .single()
        
        if (data) {
          setSlug(data.slug)
          setLogoUrl(data.logo_url ?? null)
        }
      }
      setLoading(false)
    }
    getRestaurant()
  }, [])

  const menuUrl = slug ? `https://getmeniva.vercel.app/menu/${slug}` : ''

  const downloadQR = useCallback(() => {
    const svg = qrWrapperRef.current?.querySelector('svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const size = 400
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    const img = new window.Image()
    img.onload = () => {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, size, size)
      ctx.drawImage(img, 0, 0, size, size)
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
      const downloadLink = document.createElement('a')
      downloadLink.href = pngUrl
      downloadLink.download = `qr-meniva-${slug}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`
  }, [slug])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(menuUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
      </div>
    )
  }

  if (!slug) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500">No se encontró información del restaurante.</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-8 w-full px-1">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Mi QR</h1>
        <p className="text-sm text-zinc-500">
          Escanea este código para ver tu menú digital.
        </p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 flex flex-col items-center space-y-6 shadow-sm overflow-hidden">
        <div ref={qrWrapperRef} className="p-3 sm:p-4 bg-white rounded-xl border border-zinc-100 shadow-inner">
          <QRCodeSVG
            value={menuUrl}
            size={220}
            level="H"
            imageSettings={logoUrl ? {
              src: logoUrl,
              height: 48,
              width: 48,
              excavate: true,
            } : undefined}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>

        {logoUrl && (
          <div className="flex items-start gap-2 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 w-full">
            <Info size={14} className="text-zinc-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              El logo aparece en el centro del QR para identificar tu restaurante.
            </p>
          </div>
        )}

        <div className="w-full space-y-4">
          <div className="flex items-center gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-lg overflow-hidden">
            <span className="flex-1 text-[10px] sm:text-xs text-zinc-600 truncate font-mono">
              {menuUrl}
            </span>
            <button 
              onClick={copyToClipboard}
              className="text-zinc-400 hover:text-emerald-600 transition-colors p-1"
            >
              {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
            </button>
          </div>

          <Button 
            onClick={downloadQR}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 text-sm"
          >
            <Download size={18} />
            Descargar QR
          </Button>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3">
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
          <Check size={16} className="text-emerald-600" />
        </div>
        <p className="text-[11px] text-emerald-800 leading-relaxed">
          <strong>Tip:</strong> Imprime este código QR y colócalo en las mesas de tu restaurante para que tus clientes puedan acceder al menú al instante.
        </p>
      </div>
    </div>
  )
}
