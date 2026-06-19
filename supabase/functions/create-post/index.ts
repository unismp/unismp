import { createClient } from 'jsr:@supabase/supabase-js@2';
import { z } from 'npm:zod@3';

const ALLOWED_ORIGINS = ['https://unismp.web.app', 'http://localhost:5173'];

function corsHeaders(origin: string | null): Record<string, string> {
  const allowOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
}

const payloadSchema = z.object({
  title: z.string().trim().min(1).max(120),
  body: z.string().trim().max(1000).optional().default(''),
  imageUrl: z.string().url().nullish(),
  imagePublicId: z.string().nullish(),
});

Deno.serve(async (req) => {
  const cors = corsHeaders(req.headers.get('Origin'));

  function json(payload: unknown, status: number): Response {
    return new Response(JSON.stringify(payload), {
      status,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return json({ error: 'Cuerpo JSON invalido' }, 400);
  }

  const parsed = payloadSchema.safeParse(rawBody);
  if (!parsed.success) {
    return json({ error: 'Validacion fallida', details: parsed.error.flatten() }, 422);
  }

  // service_role solo vive aqui (runtime del servidor), nunca en el frontend.
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      title: parsed.data.title,
      body: parsed.data.body || null,
      image_url: parsed.data.imageUrl ?? null,
      image_public_id: parsed.data.imagePublicId ?? null,
    })
    .select()
    .single();

  if (error) return json({ error: error.message }, 500);
  return json({ post: data }, 201);
});
