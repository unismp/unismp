import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/cloudinary';
import type { Database } from '@/types/database';

export type CommunityPost = Database['public']['Tables']['community_posts']['Row'];

export const newPostSchema = z.object({
  title: z.string().trim().min(1, 'El titulo es obligatorio').max(120, 'Maximo 120 caracteres'),
  body: z.string().trim().max(1000, 'Maximo 1000 caracteres'),
});

export type NewPostInput = z.infer<typeof newPostSchema>;

export async function listPosts(): Promise<CommunityPost[]> {
  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw new Error(error.message);
  return data;
}

export async function createPost(input: NewPostInput, file: File | null): Promise<void> {
  let imageUrl: string | null = null;
  let imagePublicId: string | null = null;

  if (file) {
    const uploaded = await uploadImage(file);
    imageUrl = uploaded.secureUrl;
    imagePublicId = uploaded.publicId;
  }

  const { error } = await supabase.from('community_posts').insert({
    title: input.title,
    body: input.body || null,
    image_url: imageUrl,
    image_public_id: imagePublicId,
  });

  if (error) throw new Error(error.message);
}
