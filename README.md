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

## Despliegue (Firebase Hosting)

**Manual** (desde tu máquina):

```bash
npm run build
firebase deploy --only hosting   # publica en https://unismp.web.app
```

**Automático** (GitHub Actions): cada push a `main` ejecuta
[.github/workflows/firebase-hosting.yml](.github/workflows/firebase-hosting.yml), que compila y
despliega al canal `live`. Requiere configurar en el repo de GitHub:

- **Secret** `FIREBASE_SERVICE_ACCOUNT_UNISMP` → JSON de una cuenta de servicio de Firebase.
- **Variables** (públicas): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
  `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`.

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
│   └── functions/
│       └── create-post/     # Edge Function: valida (Zod) e inserta con service_role
├── .env.example             # Plantilla de variables de entorno
├── eslint.config.js         # ESLint flat config
├── firebase.json            # (Paso 3) Config de Firebase Hosting
├── vite.config.ts
└── tsconfig*.json
```

---

## Sostenibilidad

**Keep-alive** ([.github/workflows/keep-alive.yml](.github/workflows/keep-alive.yml)): el plan gratis
de Supabase pausa el proyecto tras 7 días de inactividad. Un cron cada 3 días hace una consulta
mínima para mantenerlo activo. Usa las Variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.

**Backups** ([.github/workflows/backup.yml](.github/workflows/backup.yml)): el plan gratis no incluye
backups automáticos. Un cron semanal exporta esquema + datos y los sube como *artifact* descargable
(retención 30 días). Requiere el **Secret** `SUPABASE_DB_URL` (cadena de conexión con contraseña).

> Obtener `SUPABASE_DB_URL`: Supabase → Project Settings → Database → Connection string → URI.
> Backup manual puntual: `supabase db dump --db-url "<URI>" -f backup.sql`.

> ⚠️ Los workflows con `schedule` se desactivan si el repo queda 60 días sin actividad (aviso de
> GitHub). Basta con re-activarlos desde la pestaña Actions.

## Checklist de seguridad (antes de producción)

- [x] Solo claves **públicas** en el frontend (anon key, unsigned preset).
- [x] **RLS activado** en todas las tablas; sin políticas → sin acceso.
- [x] Lógica inviolable en **Edge Functions** (`create-post` valida con `service_role`).
- [x] `.env` y `.mcp.json` fuera del repositorio (`.gitignore`).
- [x] Cloudinary: preset unsigned restringido (formato, dimensiones, carpeta) + validación 5 MB en cliente.
- [x] CORS con allowlist en la Edge Function.
- [x] Supabase Auth → Site URL y Redirect URLs configurados para el dominio de producción.
- [ ] **Pendiente (al definir roles):** cerrar la política `community_posts_insert_demo`
      (`WITH CHECK (true)`) y enrutar escrituras por la Edge Function.
- [ ] **Pendiente:** rotar el Personal Access Token de Supabase si el chat de configuración se compartió.

---

## Estado de la infraestructura

- [x] Paso 1 — Decisiones de arquitectura
- [x] Paso 2 — Estructura del proyecto y configuración base
- [x] Paso 3 — Inicialización de servicios (Firebase / Supabase / Cloudinary)
- [x] Paso 4 — Clientes conectados (Supabase + Cloudinary)
- [x] Paso 5 — Tabla de ejemplo + RLS + demo end-to-end
- [x] Paso 6 — Edge Function de ejemplo (`create-post`)
- [x] Paso 7 — Despliegue a Firebase Hosting
- [x] Paso 8 — Keep-alive, backups y checklist de seguridad
