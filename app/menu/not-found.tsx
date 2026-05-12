import Link from 'next/link'

export default function MenuNotFoundPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-6 text-3xl">
        🍽️
      </div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-2">Menú no encontrado</h1>
      <p className="text-sm text-zinc-500 mb-8 max-w-xs">
        El restaurante que buscas no existe o el enlace está desactualizado.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
      >
        Ir al inicio
      </Link>
    </div>
  )
}
