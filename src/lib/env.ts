import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_CLOUDINARY_CLOUD_NAME: z.string().min(1),
  VITE_CLOUDINARY_UPLOAD_PRESET: z.string().min(1),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error('Variables de entorno invalidas:', parsed.error.flatten().fieldErrors);
  throw new Error(
    'Configuracion de entorno invalida. Copia .env.example a .env y completa los valores.',
  );
}

export const env = parsed.data;
