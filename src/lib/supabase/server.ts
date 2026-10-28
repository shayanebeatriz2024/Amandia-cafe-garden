import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/** Tags do Data Cache da Vercel — ver docs/02-trd.md §3.2 */
export type CacheTag = 'menu' | 'events' | 'hours';

/** TTL de segurança caso um webhook de revalidação falhe. */
export const REVALIDATE_SECONDS: Record<CacheTag, number> = {
  menu: 3600,
  events: 900,
  hours: 3600,
};

export const TABLE_TO_TAG: Record<string, CacheTag> = {
  menu_categories: 'menu',
  menu_items: 'menu',
  events: 'events',
  opening_hours: 'hours',
  special_hours: 'hours',
};

/**
 * Cliente Supabase para Server Components.
 * Injeta `next: { revalidate, tags }` em cada fetch para que as respostas
 * entrem no Data Cache e possam ser invalidadas com revalidateTag(tag).
 *
 * Retorna null quando as variáveis não existem — a camada de dados
 * devolve listas vazias e o build nunca quebra por falta de backend.
 */
export function getSupabase(tag: CacheTag) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          cache: 'force-cache',
          next: { revalidate: REVALIDATE_SECONDS[tag], tags: [tag] },
        }),
    },
  });
}

/** URL pública de um arquivo no bucket `media`. */
export function getMediaUrl(path: string | null): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!path || !base) return null;
  return `${base}/storage/v1/object/public/media/${path.replace(/^\//, '')}`;
}
