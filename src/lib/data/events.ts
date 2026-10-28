import 'server-only';
import { getSupabase } from '@/lib/supabase/server';
import type { EventRow } from '@/types/database';

export type CafeEvent = Omit<EventRow, 'created_at' | 'status'>;

const EVENT_COLUMNS =
  'id, slug, title, summary, description, starts_at, ends_at, location_label, image_path, image_alt, price_cents, capacity, is_sold_out, booking_url, updated_at';

/**
 * Eventos publicados a partir de hoje (RLS já filtra status = 'publicado').
 *
 * O filtro usa granularidade de DIA de propósito: a URL da query faz parte da
 * chave do Data Cache, e um timestamp ao segundo invalidaria o cache a cada render.
 * O corte fino (eventos que já terminaram hoje) é feito em memória.
 */
export async function getUpcomingEvents(limit?: number): Promise<CafeEvent[]> {
  const supabase = getSupabase('events');
  if (!supabase) return [];

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('events')
    .select(EVENT_COLUMNS)
    .gte('starts_at', yesterday)
    .order('starts_at');

  if (error) {
    console.error('[data/events]', error.message);
    return [];
  }

  const now = Date.now();
  const upcoming = (data ?? []).filter(
    (event) => new Date(event.ends_at ?? event.starts_at).getTime() >= now,
  );
  return limit ? upcoming.slice(0, limit) : upcoming;
}
