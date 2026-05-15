import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <nav className="border-b border-zinc-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Meniva Logo" width={85} height={85} />
          <span className="text-xl font-bold text-zinc-900 tracking-tight">Meniva</span>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          La revolución del menú digital en Panamá
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-zinc-900 tracking-tight mb-6 leading-tight">
          Tu menú digital,<br />
          <span className="text-emerald-600">siempre actualizado.</span>
        </h1>
        
        <p className="text-xl text-zinc-500 mb-10 max-w-2xl leading-relaxed">
          Crea un menú QR moderno en minutos. Cambia precios, platos y disponibilidad desde tu celular, sin imprimir nada.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/register" className={buttonVariants({ variant: "default", className: "bg-emerald-600 hover:bg-emerald-700 text-white h-14 px-10 text-lg font-bold rounded-2xl shadow-xl shadow-emerald-600/20" })}>
            Registrar mi restaurante
          </Link>
          <Link href="/login" className={buttonVariants({ variant: "outline", className: "h-14 px-10 text-lg font-semibold rounded-2xl border-zinc-200" })}>
            Entrar al Panel
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-zinc-100 pt-12 w-full">
          <div>
            <p className="font-bold text-zinc-900 mb-1">Cero impresión</p>
            <p className="text-sm text-zinc-500">Ahorra costos y ayuda al planeta con un menú 100% digital.</p>
          </div>
          <div>
            <p className="font-bold text-zinc-900 mb-1">Control total</p>
            <p className="text-sm text-zinc-500">Actualiza tu menú al instante desde cualquier lugar.</p>
          </div>
          <div>
            <p className="font-bold text-zinc-900 mb-1">Experiencia premium</p>
            <p className="text-sm text-zinc-500">Tus clientes amarán la interfaz rápida y moderna.</p>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-zinc-50 text-center">
        <p className="text-zinc-400 text-xs">© {new Date().getFullYear()} Meniva. Hecho con ❤️ en Panamá.</p>
      </footer>
    </div>
  );
}
