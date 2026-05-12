# ARCHITECTURE_RULES.md

# Meniva — Reglas de Arquitectura

> Este documento define las reglas técnicas que gobiernan todo el código de Meniva.
> El agente debe leerlo completo antes de generar cualquier archivo.
> Ante cualquier duda técnica, este documento es la fuente de verdad.

---

## 1. Next.js App Router — Reglas de componentes

### Server Components (por defecto)

Usa Server Components para todo lo que:

- Lea datos de Supabase
- No tenga interactividad del usuario
- No use hooks de React (useState, useEffect, etc.)
- No use eventos del navegador (onClick, onChange, etc.)

```tsx
// ✅ Correcto — Server Component
// app/(dashboard)/products/page.tsx
import { createServerClient } from "@/lib/supabase/server";

export default async function ProductsPage() {
  const supabase = createServerClient();
  const { data: products } = await supabase.from("products").select("*");
  return <ProductList products={products} />;
}
```

### Client Components — solo cuando es necesario

Agrega `"use client"` únicamente cuando el componente:

- Usa useState o useEffect
- Maneja eventos del usuario (onClick, onChange, onSubmit)
- Usa hooks de terceros
- Accede a APIs del navegador (localStorage, window, etc.)

```tsx
// ✅ Correcto — Client Component justificado
"use client";
import { useState } from "react";

export function ToggleAvailable({ productId, initialState }: Props) {
  const [available, setAvailable] = useState(initialState);
  // ...
}
```

### Regla del árbol de componentes

- El Server Component padre pasa datos al Client Component hijo
- Nunca al revés
- Minimiza la frontera client/server

---

## 2. Estructura de carpetas — Naming conventions

```
app/
  (auth)/           -- grupo de rutas, no aparece en URL
  (dashboard)/      -- grupo de rutas del panel admin
  menu/             -- menú público

components/
  ui/               -- componentes genéricos reutilizables (Button, Input, Card)
  dashboard/        -- componentes específicos del panel admin
  menu/             -- componentes específicos del menú público

lib/
  supabase/
    client.ts       -- Supabase browser client
    server.ts       -- Supabase server client (SSR)
  utils.ts          -- funciones utilitarias generales

types/
  database.ts       -- tipos generados o manuales de Supabase
  index.ts          -- re-exports de tipos

docs/               -- documentación del proyecto (este archivo vive aquí)
```

### Naming de archivos

- Páginas: `page.tsx` (obligatorio Next.js)
- Layouts: `layout.tsx`
- Componentes: `PascalCase.tsx` — ej: `ProductCard.tsx`
- Hooks: `camelCase.ts` con prefijo `use` — ej: `useProducts.ts`
- Utilidades: `camelCase.ts` — ej: `formatPrice.ts`
- Tipos: `camelCase.ts` — ej: `database.ts`

### Naming de variables y funciones

- Variables y funciones: `camelCase`
- Componentes React: `PascalCase`
- Constantes globales: `UPPER_SNAKE_CASE`
- Tipos e interfaces: `PascalCase` con prefijo descriptivo

```ts
// ✅ Correcto
const productName = "Café Americano";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
type ProductRow = { id: string; name: string; price: number };
interface ProductCardProps {
  product: ProductRow;
}
```

---

## 3. Supabase — Reglas de uso

### Cliente correcto según contexto

```ts
// Server Components, Server Actions, Route Handlers
import { createServerClient } from "@/lib/supabase/server";
const supabase = createServerClient();

// Client Components (solo cuando no hay alternativa)
import { createBrowserClient } from "@/lib/supabase/client";
const supabase = createBrowserClient();
```

### Nunca hardcodear keys

```ts
// ❌ Nunca
const supabase = createClient("https://xyz.supabase.co", "eyJ...");

// ✅ Siempre desde variables de entorno
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
```

### Siempre filtrar por restaurant_id

```ts
// ❌ Peligroso — trae datos de todos los tenants
const { data } = await supabase.from("products").select("*");

// ✅ Correcto — RLS + filtro explícito
const { data } = await supabase
  .from("products")
  .select("*")
  .eq("restaurant_id", restaurantId)
  .order("position");
```

### Manejo de errores en queries

```ts
// ✅ Siempre desestructurar error
const { data, error } = await supabase.from("products").select("*");
if (error) {
  console.error("Error fetching products:", error);
  // manejar apropiadamente
}
```

---

## 4. Formularios y Server Actions

### Usar Server Actions para mutaciones

```tsx
// ✅ Server Action en archivo separado o inline
async function createProduct(formData: FormData) {
  "use server";
  const supabase = createServerClient();
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);

  const { error } = await supabase
    .from("products")
    .insert({ name, price, restaurant_id: restaurantId });

  if (error) throw new Error("Error al crear producto");
  revalidatePath("/dashboard/products");
}
```

### Validación de datos

- Validar en el Server Action, nunca confiar solo en el frontend
- Usar tipos de TypeScript para asegurar estructura
- Sanitizar inputs antes de insertar en DB

---

## 5. TypeScript — Reglas estrictas

```ts
// ❌ Nunca usar any
const data: any = await fetchProducts();

// ✅ Tipado explícito siempre
type Product = {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  position: number;
  created_at: string;
};

const data: Product[] = await fetchProducts();
```

### Interfaces vs Types

- `type` para shapes de datos y unions
- `interface` para props de componentes React

```ts
type ProductRow = { id: string; name: string };
type Status = "active" | "inactive";

interface ProductCardProps {
  product: ProductRow;
  onToggle: (id: string) => void;
}
```

---

## 6. Imágenes

```tsx
// ❌ Nunca img nativo
<img src={product.image_url} alt={product.name} />;

// ✅ Siempre next/image
import Image from "next/image";
<Image
  src={product.image_url}
  alt={product.name}
  width={400}
  height={300}
  className="object-cover rounded-lg"
/>;
```

---

## 7. Loading states — obligatorios

Toda operación asíncrona debe tener feedback visual:

```tsx
// ✅ En Server Components — usar Suspense
import { Suspense } from 'react'
<Suspense fallback={<ProductListSkeleton />}>
  <ProductList />
</Suspense>

// ✅ En Client Components — useState
const [loading, setLoading] = useState(false)
<button disabled={loading}>
  {loading ? 'Guardando...' : 'Guardar'}
</button>
```

---

## 8. Mensajes de error y éxito

- Siempre en **español**
- Específicos, no genéricos
- Mostrar en la UI, no solo en consola

```ts
// ❌ Genérico e inútil
throw new Error("Error");

// ✅ Específico y útil
throw new Error(
  "No se pudo guardar el producto. Verifica que todos los campos estén completos.",
);
```

---

## 9. Estilos con Tailwind

- **Mobile-first siempre**: clase base = móvil, luego `md:` y `lg:`
- No usar estilos inline (`style={{}}`) salvo casos excepcionales
- No mezclar CSS modules con Tailwind
- Clases ordenadas: layout → spacing → sizing → colors → typography → effects

```tsx
// ✅ Mobile-first correcto
<div className="flex flex-col gap-4 p-4 md:flex-row md:gap-6 md:p-6">
```

---

## 10. Lo que el agente NUNCA debe hacer

- ❌ Desactivar RLS en Supabase
- ❌ Usar `any` en TypeScript
- ❌ Hardcodear keys o secrets
- ❌ Usar `<img>` nativo en lugar de `next/image`
- ❌ Construir features que no están en PROJECT_CONTEXT.md
- ❌ Mezclar lógica de negocio en componentes de UI
- ❌ Hacer queries sin filtrar por `restaurant_id`
- ❌ Ignorar manejo de errores
- ❌ Omitir loading states
- ❌ Escribir mensajes de error en inglés para el usuario final

---

_Fin de ARCHITECTURE_RULES.md_
