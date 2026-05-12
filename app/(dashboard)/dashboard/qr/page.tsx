'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Copy, Check, ExternalLink, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function QRPage() {
  const [slug, setSlug] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    async function getRestaurant() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('restaurants')
          .select('slug')
          .eq('user_id', user.id)
          .single()
        
        if (data) setSlug(data.slug)
      }
      setLoading(false)
    }
    getRestaurant()
  }, [])

  const menuUrl = slug ? `https://getmeniva.vercel.app/menu/${slug}` : ''

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas')
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream')
      const downloadLink = document.createElement('a')
      downloadLink.href = pngUrl
      downloadLink.download = `qr-meniva-${slug}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }

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
    <div className="max-w-md mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Mi QR</h1>
        <p className="text-sm text-zinc-500">
          Escanea este código para ver tu menú digital.
        </p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-8 flex flex-col items-center space-y-6 shadow-sm">
        <div ref={qrRef} className="p-4 bg-white rounded-xl border border-zinc-100 shadow-inner">
          <QRCodeCanvas
            value={menuUrl}
            size={240}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: "/favicon.ico",
              x: undefined,
              y: undefined,
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>

        <div className="w-full space-y-4">
          <div className="flex items-center gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-lg overflow-hidden">
            <span className="flex-1 text-xs text-zinc-600 truncate font-mono">
              {menuUrl}
            </span>
            <button 
              onClick={copyToClipboard}
              className="text-zinc-400 hover:text-emerald-600 transition-colors p-1"
            >
              {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={downloadQR}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Descargar
            </Button>
            <Button 
              variant="outline"
              asChild
              className="flex items-center justify-center gap-2"
            >
              <a href={menuUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={18} />
                Ver menú
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3">
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
          <Check size={16} className="text-emerald-600" />
        </div>
        <p className="text-xs text-emerald-800 leading-relaxed">
          <strong>Tip:</strong> Imprime este código QR y colócalo en las mesas de tu restaurante para que tus clientes puedan acceder al menú al instante.
        </p>
      </div>
    </div>
  )
}
