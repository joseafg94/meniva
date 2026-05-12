import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center p-4 text-center">
      <h1 className="text-3xl font-bold mb-2">Bienvenido a Meniva</h1>
      <p className="text-zinc-500 mb-6 max-w-md text-sm">
        Plataforma SaaS de menús digitales QR para restaurantes en Panamá.
      </p>
      <div className="flex gap-4">
        <Link href="/login" className={buttonVariants({ variant: "default", className: "bg-emerald-600 hover:bg-emerald-700 text-white" })}>
          Iniciar sesión
        </Link>
        <Link href="/register" className={buttonVariants({ variant: "outline" })}>
          Registrarse
        </Link>
      </div>
    </div>
  );
}
