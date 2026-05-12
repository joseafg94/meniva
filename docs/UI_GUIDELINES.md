# UI_GUIDELINES.md

# Meniva — Guía de Diseño Visual

> Este documento define la identidad visual y los estándares de UI de Meniva.
> Todo componente, pantalla y decisión de diseño debe ser consistente con estas reglas.
> El agente debe leerlo antes de generar cualquier componente visual.

---

## 1. Filosofía visual

**Concepto:** Premium, limpio, moderno y accesible.

Meniva debe sentirse como una app de categoría mundial, no como un sistema genérico.
El dueño del restaurante debe sentirse orgulloso de mostrarla a sus clientes.
El cliente final debe querer quedarse explorando el menú.

**Tres palabras que definen Meniva:**

- **Limpio** — nada que sobre, nada que distraiga
- **Rápido** — carga instantánea, sin esperas
- **Premium** — percepción de calidad desde el primer scroll

---

## 2. Paleta de colores

### Colores base (Tailwind)

```
Fondo principal:      white (bg-white) / zinc-50 (bg-zinc-50)
Fondo secundario:     zinc-100 (bg-zinc-100)
Texto principal:      zinc-900 (text-zinc-900)
Texto secundario:     zinc-500 (text-zinc-500)
Texto deshabilitado:  zinc-300 (text-zinc-300)
Bordes:               zinc-200 (border-zinc-200)
```

### Color de acento (brand)

```
Primario:   emerald-600  (#059669)
Hover:      emerald-700  (#047857)
Suave:      emerald-50   (#ecfdf5)
```

### Colores semánticos

```
Éxito:      emerald-600
Error:      red-500
Advertencia: amber-500
Info:       blue-500
```

### Uso del color

- El emerald es el color de acción: botones primarios, toggles activos, links, badges
- No usar más de 2 colores de acento por pantalla
- Fondos siempre neutros (white o zinc-50), nunca de color
- Texto siempre zinc, nunca negro puro (#000)

---

## 3. Tipografía

### Fuente

```
Font family: Inter (Google Fonts)
Fallback: system-ui, sans-serif
```

Agregar en `app/layout.tsx`:

```tsx
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
```

### Escala tipográfica

```
Display:    text-3xl font-bold    (títulos de página principales)
Heading:    text-xl font-semibold (títulos de sección)
Subheading: text-base font-medium (subtítulos, labels importantes)
Body:       text-sm font-normal   (texto general)
Caption:    text-xs font-normal   (metadata, fechas, hints)
```

### Reglas de tipografía

- Máximo 2 pesos de fuente por pantalla (normal + semibold o bold)
- Line height generoso: `leading-relaxed` para párrafos
- Tracking normal salvo en labels uppercase: `tracking-wide`
- No usar texto menor a `text-xs` (11px)

---

## 4. Espaciado

### Sistema base (múltiplos de 4px)

```
Nano:   4px   (gap-1, p-1)   -- separación mínima entre elementos relacionados
Micro:  8px   (gap-2, p-2)   -- padding interno de badges, chips
Small:  12px  (gap-3, p-3)   -- padding interno de inputs
Base:   16px  (gap-4, p-4)   -- padding estándar de cards y secciones
Medium: 24px  (gap-6, p-6)   -- separación entre secciones
Large:  32px  (gap-8, p-8)   -- padding de páginas en desktop
XL:     48px  (gap-12, p-12) -- separación entre bloques grandes
```

### Reglas de espaciado

- Padding de página móvil: `px-4 py-6`
- Padding de página desktop: `px-6 py-8` o `px-8`
- Gap entre cards en grid: `gap-4` móvil, `gap-6` desktop
- Espaciado interno de cards: `p-4` móvil, `p-6` desktop

---

## 5. Componentes base

### Button

```tsx
// Primario
<button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
  Guardar producto
</button>

// Secundario
<button className="border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
  Cancelar
</button>

// Destructivo
<button className="text-red-600 hover:bg-red-50 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
  Eliminar
</button>

// Icon button
<button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-500 hover:text-zinc-900">
  <Icon size={18} />
</button>
```

### Input

```tsx
<div className="flex flex-col gap-1.5">
  <label className="text-sm font-medium text-zinc-700">
    Nombre del producto
  </label>
  <input
    className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
    placeholder="Ej: Café Americano"
  />
  <span className="text-xs text-zinc-400">
    Este nombre aparecerá en el menú
  </span>
</div>
```

### Card

```tsx
// Card estándar
<div className="bg-white border border-zinc-200 rounded-xl p-4 md:p-6">
  {/* contenido */}
</div>

// Card interactiva (hover)
<div className="bg-white border border-zinc-200 rounded-xl p-4 hover:border-zinc-300 hover:shadow-sm transition-all cursor-pointer">
  {/* contenido */}
</div>
```

### Badge / Chip

```tsx
// Disponible
<span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full">
  Disponible
</span>

// Agotado
<span className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-500 text-xs font-medium px-2 py-1 rounded-full">
  Agotado
</span>
```

### Toggle

```tsx
// Usar el toggle de shadcn/ui o implementar con Tailwind
// Estado activo: bg-emerald-600
// Estado inactivo: bg-zinc-200
```

### Skeleton loader

```tsx
// Usar para loading states
<div className="animate-pulse">
  <div className="h-4 bg-zinc-200 rounded w-3/4 mb-2" />
  <div className="h-4 bg-zinc-200 rounded w-1/2" />
</div>
```

---

## 6. Layout del dashboard (panel admin)

### Estructura

- **Mobile:** navegación en la parte inferior (bottom nav), contenido ocupa toda la pantalla
- **Desktop:** sidebar fijo a la izquierda (~240px), contenido a la derecha

### Bottom navigation (móvil)

```tsx
// 3 o 4 items máximo
// Íconos + label corto
// Item activo: color emerald
// Items inactivos: zinc-400
```

### Sidebar (desktop)

```tsx
// Fondo: white con borde derecho zinc-200
// Logo/nombre de la app arriba
// Links de navegación en el medio
// Info del usuario abajo
// Width: 240px fijo
```

### Área de contenido

```tsx
// Padding: px-4 py-6 (móvil) / px-8 py-8 (desktop)
// Max-width del contenido: max-w-4xl mx-auto
// Header de página: título + acción primaria (botón)
```

---

## 7. Menú público (vista del cliente)

### Principios

- El menú público es el producto. Debe ser impecable.
- Mobile-first absoluto — el 95% del tráfico es móvil
- Carga rápida es más importante que animaciones
- El cliente no hace login, no tiene fricción

### Estructura del menú

```
Header del restaurante
  └── Logo / nombre / descripción breve

Navegación de categorías
  └── Pills/tabs horizontales con scroll (sticky)

Lista de productos por categoría
  └── ProductCard con imagen, nombre, precio, descripción
```

### ProductCard (menú público)

```tsx
// Opción A: imagen a la derecha, texto a la izquierda
<div className="flex gap-4 py-4 border-b border-zinc-100">
  <div className="flex-1">
    <h3 className="text-sm font-semibold text-zinc-900">{name}</h3>
    <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{description}</p>
    <span className="text-sm font-semibold text-emerald-600 mt-2 block">
      ${price.toFixed(2)}
    </span>
  </div>
  {image_url && (
    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
      <Image
        src={image_url}
        alt={name}
        width={80}
        height={80}
        className="object-cover w-full h-full"
      />
    </div>
  )}
</div>
```

### Categorías (tabs)

```tsx
// Scroll horizontal, sin scroll de página al cambiar categoría
// Tab activo: texto emerald-600, underline emerald
// Tab inactivo: texto zinc-500
<div className="flex gap-6 overflow-x-auto pb-2 sticky top-0 bg-white border-b border-zinc-100 px-4 pt-2">
  {categories.map((cat) => (
    <button
      key={cat.id}
      className="text-sm font-medium whitespace-nowrap pb-2 border-b-2 border-emerald-600 text-emerald-600"
    >
      {cat.name}
    </button>
  ))}
</div>
```

---

## 8. Íconos

- Usar **Lucide React** exclusivamente (`lucide-react`)
- Tamaño estándar: `size={18}` para UI general, `size={16}` para inline
- No mezclar librerías de íconos
- Íconos siempre con `aria-hidden="true"` si son decorativos

```tsx
import { Plus, Trash2, Edit2, Eye, EyeOff, QrCode } from "lucide-react";
```

---

## 9. Bordes y sombras

```
Bordes:     border border-zinc-200  (estándar)
            border border-zinc-300  (hover o énfasis)
Border radius:
  Inputs:   rounded-lg  (8px)
  Cards:    rounded-xl  (12px)
  Buttons:  rounded-lg  (8px)
  Badges:   rounded-full
  Imágenes: rounded-lg o rounded-xl

Sombras:
  Cards hover:   shadow-sm
  Modales:       shadow-xl
  Dropdowns:     shadow-lg
  No usar:       shadow-2xl (demasiado heavy)
```

---

## 10. Estados vacíos (empty states)

Cuando no hay datos, mostrar siempre un empty state útil:

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4">
    <Package className="text-zinc-400" size={24} />
  </div>
  <h3 className="text-sm font-semibold text-zinc-900 mb-1">
    No tienes productos aún
  </h3>
  <p className="text-xs text-zinc-500 mb-4">
    Agrega tu primer producto para que aparezca en el menú
  </p>
  <button className="bg-emerald-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg">
    Agregar producto
  </button>
</div>
```

---

## 11. Lo que el agente NUNCA debe hacer en UI

- ❌ Usar colores que no están en esta guía
- ❌ Mezclar estilos inline con Tailwind
- ❌ Usar sombras grandes (shadow-2xl) en cards normales
- ❌ Texto negro puro (#000) — usar zinc-900
- ❌ Botones sin estado hover y disabled
- ❌ Formularios sin labels visibles
- ❌ Pantallas sin loading state o empty state
- ❌ Imágenes sin alt text
- ❌ Layouts que no funcionen en móvil primero
- ❌ Más de una acción primaria (botón emerald) por pantalla

---

_Fin de UI_GUIDELINES.md_
