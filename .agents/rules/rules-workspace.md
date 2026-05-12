---
trigger: always_on
---

Siempre usa TypeScript estricto. Sin any implícitos.
Componentes del servidor por defecto en Next.js App Router. Solo usar "use client" cuando sea necesario (interactividad, hooks de estado).
No inventar features. Si algo no está en el MVP, no lo construyas aunque parezca útil.
RLS siempre activo. Nunca desactivar Row Level Security en Supabase.
Variables de entorno para todas las keys de Supabase. Nunca hardcodear.
Nombres descriptivos en inglés para código, español para UI.
Mobile-first en estilos. Empezar con clases base de Tailwind, luego md: y lg:.
Imágenes con next/image siempre, nunca <img> nativo.
Loading states en todas las operaciones asíncronas.
Errores manejados con mensajes claros en español para el usuario final.

Antes de generar cualquier código, lee completo:

- /docs/PROJECT_CONTEXT.md
- /docs/ARCHITECTURE_RULES.md
- /docs/UI_GUIDELINES.md

Estos documentos son la fuente de verdad del proyecto Meniva.
Nunca ignores sus reglas ni inventes features que no estén definidas ahí.
