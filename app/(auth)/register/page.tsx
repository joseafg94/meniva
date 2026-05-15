'use client'

import { useActionState } from 'react'
import { register } from '@/app/actions/auth'
import { SubmitButton } from '@/components/ui/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'
import { QrCode, Smartphone, Zap, CheckCircle2 } from 'lucide-react'

const initialState = { error: null }

export default function RegisterPage() {
  const [state, formAction] = useActionState(register, initialState)

  return (
    <div className="flex min-h-screen bg-white">
      {/* Lado izquierdo - Branding (Solo desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="relative z-10 w-full max-w-md">
          <div className="flex items-center gap-4 mb-8">
            <Image src="/logo.svg" alt="Meniva Logo" width={85} height={65} />
            <h1 className="text-3xl font-bold text-white tracking-tight">Meniva</h1>
          </div>

          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Crea el menú que<br />
            <span className="text-emerald-500 text-3xl">tus clientes amarán.</span>
          </h2>
          
          <div className="mt-12 space-y-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                <QrCode className="text-emerald-500" size={20} />
              </div>
              <div>
                <p className="text-white font-medium">Menú QR moderno</p>
                <p className="text-zinc-400 text-sm">Escaneo instantáneo sin apps externas.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                <Smartphone className="text-emerald-500" size={20} />
              </div>
              <div>
                <p className="text-white font-medium">Editable desde el celular</p>
                <p className="text-zinc-400 text-sm">Cambia precios y stock en tiempo real.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                <Zap className="text-emerald-500" size={20} />
              </div>
              <div>
                <p className="text-white font-medium">Listo en minutos</p>
                <p className="text-zinc-400 text-sm">Carga tus platos y genera tu QR al instante.</p>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5">
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" />
              Únete a la revolución digital
            </p>
          </div>
        </div>
      </div>

      {/* Lado derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 lg:p-16">
        <div className="w-full max-w-sm">
          {/* Logo móvil */}
          <div className="lg:hidden flex flex-col items-center gap-3 mb-8 text-center">
            <Image src="/logo.svg" alt="Meniva" width={64} height={64} />
            <h1 className="text-2xl font-bold text-zinc-900">Meniva</h1>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Crea tu cuenta</h2>
            <p className="text-zinc-500 mt-2">Comienza a digitalizar tu restaurante hoy mismo.</p>
          </div>

          <form action={formAction} className="space-y-5">
            {state?.error && (
              <div className="bg-red-50 text-red-600 text-sm p-3.5 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
                {state.error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-zinc-700 ml-1">
                Nombre del restaurante
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Ej: Café de Especialidad"
                className="w-full h-11 px-4 border-zinc-200 rounded-xl focus:ring-emerald-500 transition-all placeholder:text-zinc-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-zinc-700 ml-1">
                Correo electrónico
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="tu@restaurante.com"
                className="w-full h-11 px-4 border-zinc-200 rounded-xl focus:ring-emerald-500 transition-all placeholder:text-zinc-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-zinc-700 ml-1">
                Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Mínimo 6 caracteres"
                className="w-full h-11 px-4 border-zinc-200 rounded-xl focus:ring-emerald-500 transition-all"
              />
            </div>

            <SubmitButton className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11 text-base font-semibold rounded-xl shadow-lg shadow-emerald-600/10 transition-all hover:shadow-emerald-600/20 active:scale-[0.98]">
              Registrar restaurante
            </SubmitButton>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
