import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Productos - Meniva',
}

export default function ProductsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Productos</h1>
      <p className="text-sm text-zinc-500">Próximamente: Gestión de productos.</p>
    </div>
  )
}
