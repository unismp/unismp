// Tipos de la base de datos. Coinciden con la migracion de public.community_posts.
// Cuando tengas la CLI/MCP enlazados, puedes regenerarlos con:
//   npx supabase gen types typescript --project-id ontjhzsvaqbwruyqbuhu > src/types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      community_posts: {
        Row: {
          id: string;
          title: string;
          body: string | null;
          image_url: string | null;
          image_public_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          body?: string | null;
          image_url?: string | null;
          image_public_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          body?: string | null;
          image_url?: string | null;
          image_public_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
