import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Los tipos generados de la BD se anaden en el Paso 5:
//   npx supabase gen types typescript --project-id ontjhzsvaqbwruyqbuhu > src/types/database.ts
// y luego: createClient<Database>(...)
export const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
