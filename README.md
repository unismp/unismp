# UNISMP

Aplicación web de la comunidad del servidor **SMP de Minecraft (UniversoCraft)**.

Stack 100% en capa gratuita, priorizando **seguridad**, **velocidad de carga** y
**mantenibilidad a largo plazo**.

---

## Stack

| Capa                | Tecnología                                  | Rol                                                        |
| ------------------- | ------------------------------------------- | ---------------------------------------------------------- |
| Hosting frontend    | **Firebase Hosting** (Spark / gratis, CDN)  | Sirve el bundle estático (`unismp.web.app`)                |
| Datos / Auth        | **Supabase** (gratis)                       | Postgres + RLS, autenticación, realtime, Edge Functions    |
| Imágenes            | **Cloudinary** (gratis)                     | Subida/optimización; en Supabase solo se guarda la URL/ID  |
| Framework           | **React 19 + Vite 6**                       | SPA estática                                               |
| Lenguaje            | **TypeScript**                              | Tipado estricto                                            |
| Estilos             | **Tailwind CSS v4** (`@tailwindcss/vite`)   | Sin `postcss.config` ni `tailwind.config`                  |
| Datos / caché       | **TanStack Query**                          | Cachea y revalida llamadas a Supabase                      |
| Validación          | **Zod**                                     | Mismo schema en cliente y Edge Functions                   |
| Routing             | **React Router v7**                         | Navegación del lado del cliente                            |
| Calidad             | **ESLint v9 (flat) + Prettier**             | Estilo y errores                                           |

---

## Requisitos

- Node.js >= 20 (probado con Node 24)
- npm >= 10

## Puesta en marcha

```bash
npm install
cp .env.example .env   # luego edita .env con tus claves PÚBLICAS
npm run dev            # http://localhost:5173
```

> Las claves van en `.env` (ignorado por git). Solo se exponen variables con
> prefijo `VITE_`, y únicamente claves **públicas**.

## Scripts

| Comando                | Descripción                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Servidor de desarrollo (Vite)            |
| `npm run build`        | Type-check + build de producción a `dist/` |
| `npm run preview`      | Previsualiza el build                    |
| `npm run lint`         | ESLint                                   |
| `npm run lint:fix`     | ESLint con autofix                       |
| `npm run format`       | Prettier (escribe)                       |
| `npm run typecheck`    | Solo verificación de tipos               |

---

## Estructura del proyecto

```
unismp/
├── public/                  # Assets estáticos servidos tal cual (favicon, etc.)
├── src/
│   ├── assets/              # Imágenes/íconos importados por el bundle
│   ├── components/          # Componentes de UI reutilizables
│   ├── features/            # Módulos por dominio (se llenarán en la fase de funciones)
│   ├── hooks/               # Custom hooks de React
│   ├── lib/                 # Clientes e infraestructura
│   │   ├── env.ts           #   Validación (Zod) de variables de entorno
│   │   ├── queryClient.ts   #   Config de TanStack Query
│   │   ├── supabase.ts      #   Cliente Supabase
│   │   └── cloudinary.ts    #   Subida + validación (tipo/5MB) + URLs optimizadas
│   ├── pages/               # Vistas enrutadas
│   ├── routes/              # Definición del router
│   ├── styles/              # CSS global (entrada de Tailwind)
│   ├── types/               # Tipos compartidos / generados de Supabase
│   ├── main.tsx             # Punto de entrada de React
│   └── vite-env.d.ts        # Tipos de import.meta.env
├── supabase/
│   ├── migrations/          # Migraciones SQL (tablas + políticas RLS)
│   └── functions/           # Edge Functions (lógica segura del servidor)
├── .env.example             # Plantilla de variables de entorno
├── eslint.config.js         # ESLint flat config
├── firebase.json            # (Paso 3) Config de Firebase Hosting
├── vite.config.ts
└── tsconfig*.json
```

---

## Seguridad (resumen)

- Solo claves **públicas** en el frontend (Supabase anon key, Cloudinary unsigned preset).
- **RLS activado en todas las tablas** de Supabase; sin políticas → sin acceso.
- Lógica inviolable en **Edge Functions**, nunca en el cliente.
- `.env` fuera del repositorio (ver `.gitignore`).

La checklist completa de seguridad y sostenibilidad (keep-alive + backups) se documenta
en el Paso 8.

---

## Estado de la infraestructura

- [x] Paso 1 — Decisiones de arquitectura
- [x] Paso 2 — Estructura del proyecto y configuración base
- [x] Paso 3 — Inicialización de servicios (Firebase / Supabase / Cloudinary)
- [x] Paso 4 — Clientes conectados (Supabase + Cloudinary)
- [ ] Paso 5 — Tabla de ejemplo + RLS + demo end-to-end
- [ ] Paso 6 — Edge Function de ejemplo
- [ ] Paso 7 — Despliegue a Firebase Hosting
- [ ] Paso 8 — Keep-alive, backups y checklist de seguridad
