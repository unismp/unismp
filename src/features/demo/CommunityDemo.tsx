import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { buildImageUrl } from '@/lib/cloudinary';
import { createPost, listPosts, newPostSchema } from './posts';

export function CommunityDemo() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const postsQuery = useQuery({ queryKey: ['community_posts'], queryFn: listPosts });

  const mutation = useMutation({
    mutationFn: (vars: { title: string; body: string; file: File | null }) =>
      createPost({ title: vars.title, body: vars.body }, vars.file),
    onSuccess: () => {
      setTitle('');
      setBody('');
      setFile(null);
      setFormError(null);
      queryClient.invalidateQueries({ queryKey: ['community_posts'] });
    },
    onError: (err: Error) => setFormError(err.message),
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed = newPostSchema.safeParse({ title, body });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Datos invalidos');
      return;
    }
    mutation.mutate({ title: parsed.data.title, body: parsed.data.body, file });
  }

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <header>
        <h2 className="text-2xl font-bold">Demo: circuito completo</h2>
        <p className="text-sm opacity-70">
          Sube una imagen (a Cloudinary) y guarda el post (en Supabase). Valida Frontend → Supabase →
          Cloudinary de extremo a extremo.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border p-4">
        <input
          type="text"
          placeholder="Titulo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded border px-3 py-2"
        />
        <textarea
          placeholder="Nota (opcional)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          className="rounded border px-3 py-2"
        />
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm"
        />
        {formError && <p className="text-sm text-red-500">{formError}</p>}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded bg-green-700 px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {mutation.isPending ? 'Guardando…' : 'Publicar'}
        </button>
      </form>

      <div className="flex flex-col gap-4">
        {postsQuery.isLoading && <p className="opacity-70">Cargando…</p>}
        {postsQuery.isError && (
          <p className="text-sm text-red-500">
            Error al leer: {(postsQuery.error as Error).message}. ¿Ya ejecutaste el SQL de la tabla?
          </p>
        )}
        {postsQuery.data?.map((post) => (
          <article key={post.id} className="flex gap-4 rounded-lg border p-4">
            {post.image_public_id && (
              <img
                src={buildImageUrl(post.image_public_id, { width: 120, height: 120, crop: 'fill' })}
                alt={post.title}
                width={120}
                height={120}
                loading="lazy"
                className="h-[7.5rem] w-[7.5rem] rounded object-cover"
              />
            )}
            <div>
              <h3 className="font-semibold">{post.title}</h3>
              {post.body && <p className="text-sm opacity-80">{post.body}</p>}
              <time className="text-xs opacity-50">
                {new Date(post.created_at).toLocaleString()}
              </time>
            </div>
          </article>
        ))}
        {postsQuery.data?.length === 0 && <p className="opacity-70">Aún no hay posts.</p>}
      </div>
    </section>
  );
}
