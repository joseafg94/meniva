# PROJECT_CONTEXT.md

# MenuQR SaaS — Contexto completo del proyecto

> Este documento es el briefing maestro del proyecto. Léelo completo antes de generar cualquier código, estructura o decisión técnica. Todo lo que construyas debe ser consistente con este contexto.

---

## 1. ¿Qué es este producto?

Una plataforma SaaS multi-tenant que permite a restaurantes y cafeterías en Panamá tener un **menú digital QR moderno, editable y elegante**, sin necesidad de conocimientos técnicos.

El cliente escanea un QR → se abre el menú en el navegador → ve un catálogo visual premium → explora y decide.

El dueño del restaurante entra al panel → edita productos, precios, fotos y categorías → los cambios se reflejan en tiempo real.

---

## 2. El problema que resuelve

Muchos negocios en Panamá (especialmente en Chiriquí, David y Boquete) todavía usan:

- Menús físicos difíciles de actualizar
- PDFs mal diseñados compartidos por WhatsApp
- Imágenes de mala calidad enviadas por redes sociales

Cuando sube un precio, se acaba un producto o quieren verse más modernos, todo se vuelve un problema operativo y de imagen.

---

## 3. La solución

Cada negocio tiene:

- Un panel de administración simple, usable desde el celular
- Un menú público con URL única y QR descargable
- Actualizaciones en tiempo real sin conocimientos técnicos

---

## 4. Usuarios del sistema

### Usuario A: Cliente final (quien escanea el QR)

- No tiene cuenta, no hace login
- Escanea el QR → ve el menú en el navegador
- Navega categorías, ve productos con imagen, precio y descripción
- Experiencia 100% pública, sin fricción

### Usuario B: Dueño del restaurante (admin)

- Tiene cuenta propia en la plataforma
- Solo ve y edita sus propios datos (aislamiento multi-tenant estricto)
- Acciones disponibles:
  - Login / logout
  - CRUD de categorías
  - CRUD de productos (nombre, descripción, precio, imagen, activo/inactivo)
  - Subir imágenes de productos
  - Activar o desactivar productos (ej: producto agotado)
  - Ver y descargar su QR único
  - Ver la URL pública de su menú

---

## 5. Lo que el MVP NO incluye (no construir esto)

- ❌ Pedidos o carrito de compras
- ❌ Pagos automáticos o pasarelas de pago
- ❌ Delivery o integración con apps de delivery
- ❌ Analytics o reportes
- ❌ Inventario o control de stock
- ❌ Roles de usuario múltiples (no hay meseros, cajeros, etc.)
- ❌ IA integrada en el producto
- ❌ POS (punto de venta)
- ❌ Multi-idioma
- ❌ Notificaciones push

**Filosofía:** Si una función no está en esta lista de MVP, no se construye. El objetivo es validar si los restaurantes usan y pagan el producto, nada más.

---

## 6. Stack tecnológico

| Capa             | Tecnología                                 |
| ---------------- | ------------------------------------------ |
| Frontend         | Next.js 15 (App Router) + TypeScript       |
| Estilos          | Tailwind CSS                               |
| Backend / DB     | Supabase (PostgreSQL + Auth + Storage)     |
| Hosting          | Vercel                                     |
| Generación de QR | qrcode.react o similar                     |
| IDE / Agente IA  | Google Antigravity (Gemini 3 Pro + Claude) |

**Reglas del stack:**

- Usar App Router de Next.js, no Pages Router
- Server Components por defecto, Client Components solo cuando sea necesario
- Variables de entorno en `.env.local`, nunca hardcodear keys
- Supabase SDK del lado del servidor cuando sea posible (no exponer anon key innecesariamente)

---

## 7. Arquitectura multi-tenant

Modelo: **tenant_id por fila** (row-level multi-tenancy).

- Cada restaurante es un tenant con su propio `id`
- Todas las tablas de datos tienen columna `restaurant_id` (FK a `restaurants`)
- Row Level Security (RLS) activado en Supabase para aislar datos por tenant
- Un restaurante nunca puede ver ni modificar datos de otro

---

## 8. Schema de base de datos

```sql
-- Restaurantes (tenants)
create table restaurants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  slug text unique not null, -- usado en la URL pública: /menu/[slug]
  description text,
  logo_url text,
  cover_url text,
  phone text,
  address text,
  created_at timestamptz default now()
);

-- Categorías
create table categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  name text not null,
  position integer default 0, -- para ordenar categorías
  created_at timestamptz default now()
);

-- Productos
create table products (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  category_id uuid references categories(id) on delete set null,
  name text not null,
  description text,
  price decimal(10,2) not null,
  image_url text,
  is_available boolean default true,
  position integer default 0, -- para ordenar productos dentro de categoría
  created_at timestamptz default now()
);
```

**RLS policies a aplicar:**

- `restaurants`: el usuario autenticado solo puede ver/editar su propio restaurante
- `categories` y `products`: solo accesibles si `restaurant_id` pertenece al usuario autenticado
- Las rutas públicas del menú (`/menu/[slug]`) acceden con `anon` key — solo lectura, sin RLS bloqueante

---

## 9. Estructura de carpetas esperada

```
/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx            -- layout del panel admin
│   │   ├── dashboard/page.tsx    -- inicio del panel
│   │   ├── products/page.tsx     -- lista de productos
│   │   ├── products/new/page.tsx
│   │   ├── products/[id]/page.tsx
│   │   ├── categories/page.tsx
│   │   └── qr/page.tsx           -- ver y descargar QR
│   ├── menu/
│   │   └── [slug]/page.tsx       -- menú público del restaurante
│   ├── layout.tsx
│   └── page.tsx                  -- landing o redirect
├── components/
│   ├── ui/                       -- componentes reutilizables (Button, Input, Card, etc.)
│   ├── dashboard/                -- componentes del panel admin
│   └── menu/                     -- componentes del menú público
├── lib/
│   ├── supabase/
│   │   ├── client.ts             -- cliente browser
│   │   └── server.ts             -- cliente server (SSR)
│   └── utils.ts
├── types/
│   └── database.ts               -- tipos generados de Supabase
└── public/
```

---

## 10. Rutas del sistema

| Ruta                    | Descripción                     | Acceso      |
| ----------------------- | ------------------------------- | ----------- |
| `/`                     | Landing o redirect al dashboard | Público     |
| `/login`                | Login del restaurante           | Público     |
| `/register`             | Registro del restaurante        | Público     |
| `/dashboard`            | Panel principal                 | Autenticado |
| `/dashboard/products`   | Gestión de productos            | Autenticado |
| `/dashboard/categories` | Gestión de categorías           | Autenticado |
| `/dashboard/qr`         | Ver y descargar QR              | Autenticado |
| `/menu/[slug]`          | Menú público del restaurante    | Público     |

---

## 11. Filosofía de diseño visual

**Concepto:** Premium, limpio, mobile-first. El menú del cliente debe sentirse como una app moderna de catálogo, no como un PDF ni un POS.

**Principios:**

- Mobile-first en todo. El 90% de los clientes verá el menú desde el celular
- Tipografía clara y legible. Jerarquía visual bien definida
- Imágenes grandes y atractivas para los productos
- Espaciado generoso, nada apretado
- Colores neutros con un acento de color por restaurante (a futuro)
- Carga rápida: imágenes optimizadas con Next.js Image
- Skeleton loaders durante carga, nunca pantallas en blanco

**El panel admin también debe ser limpio y simple.** Los dueños de restaurante son personas no técnicas. Cada acción debe ser obvia sin instrucciones.

**Referencia de estilo:**

- Más parecido a: Linear, Stripe dashboard, apps de catálogo premium
- Menos parecido a: Excel, paneles de WordPress, apps de POS antiguas

---

## 12. PWA (Progressive Web App)

El menú público (`/menu/[slug]`) debe funcionar como PWA:

- Manifest con nombre, icono y color del restaurante (genérico al inicio)
- Service worker para cache básico
- Instalable desde el navegador móvil
- Funciona offline con el último menú cacheado

El panel admin no necesita ser PWA en el MVP.

---

## 13. Modelo de negocio (contexto para el agente)

- **Setup fee:** cobro único por configuración inicial (el fundador lo hace en persona)
- **Mensualidad:** cobro recurrente por uso de la plataforma
- El sistema no maneja pagos todavía. La facturación es manual en esta fase.
- Mercado objetivo inicial: cafeterías y restaurantes en David, Boquete y Chiriquí, Panamá

---

## 14. Reglas para el agente

1. **Siempre usa TypeScript estricto.** Sin `any` implícitos.
2. **Componentes del servidor por defecto** en Next.js App Router. Solo usar `"use client"` cuando sea necesario (interactividad, hooks de estado).
3. **No inventar features.** Si algo no está en el MVP, no lo construyas aunque parezca útil.
4. **RLS siempre activo.** Nunca desactivar Row Level Security en Supabase.
5. **Variables de entorno** para todas las keys de Supabase. Nunca hardcodear.
6. **Nombres descriptivos** en inglés para código, español para UI.
7. **Mobile-first en estilos.** Empezar con clases base de Tailwind, luego `md:` y `lg:`.
8. **Imágenes con next/image** siempre, nunca `<img>` nativo.
9. **Loading states** en todas las operaciones asíncronas.
10. **Errores manejados** con mensajes claros en español para el usuario final.

---

## 15. Definición de "listo" para el MVP

El MVP está listo cuando un dueño de restaurante puede:

- [ ] Registrarse y hacer login
- [ ] Crear categorías para su menú
- [ ] Agregar productos con nombre, precio, descripción e imagen
- [ ] Activar y desactivar productos
- [ ] Ver y descargar su QR único
- [ ] Compartir la URL de su menú

Y un cliente puede:

- [ ] Escanear el QR y ver el menú sin hacer login
- [ ] Navegar por categorías
- [ ] Ver imagen, nombre, precio y descripción de cada producto
- [ ] Instalar el menú como PWA desde el celular

---

_Fin del PROJECT_CONTEXT.md — Este documento es la fuente de verdad del proyecto. Ante cualquier duda, vuelve aquí._
