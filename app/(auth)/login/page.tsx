'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import { SubmitButton } from '@/components/ui/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

const initialState = { error: null }

export default function LoginPage() {
  const [state, formAction] = useActionState(login, initialState)

  return (
    <div className="flex min-h-screen flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 bg-zinc-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900">
          Iniciar sesión
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-600">
          O{' '}
          <Link href="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
            registra tu restaurante
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow-sm border border-zinc-200 sm:rounded-xl sm:px-10">
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
                {state.error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-zinc-700">
                Correo electrónico
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="tu@correo.com"
                className="w-full border-zinc-200 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-zinc-700">
                Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full border-zinc-200 focus:ring-emerald-500"
              />
            </div>

            <SubmitButton className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg">
              Entrar al panel
            </SubmitButton>
          </form>
        </div>
      </div>
    </div>
  )
}
