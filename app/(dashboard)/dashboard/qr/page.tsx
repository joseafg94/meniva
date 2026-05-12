import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mi QR - Meniva',
}

export default function QRPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Mi QR</h1>
      <p className="text-sm text-zinc-500">Próximamente: Gestión de tu código QR.</p>
    </div>
  )
}
