import 'server-only';
import { getSupabase } from '@/lib/supabase/server';
import { siteConfig } from '@/lib/site-config';
import type { OpeningHoursRow, SpecialHoursRow } from '@/types/database';

export { WEEKDAY_LABELS, formatTime, groupHoursForDisplay } from '@/lib/hours-format';

export type OpeningHours = Pick<
  OpeningHoursRow,
  'weekday' | 'opens_at' | 'closes_at' | 'valid_from' | 'valid_until'
>;
export type SpecialHours = Pick<
  SpecialHoursRow,
  'date' | 'is_closed' | 'opens_at' | 'closes_at' | 'note'
>;

export interface BusinessHours {
  regular: OpeningHours[];
  /** Exceções dos próximos 14 dias — serializadas para o OpenStatus (client). */
  special: SpecialHours[];
}

const FALLBACK: BusinessHours = { regular: [...siteConfig.defaultHours], special: [] };

/** Horário de temporada: mantém só as linhas válidas na data de referência. */
function isActiveOn(row: OpeningHours, isoDate: string): boolean {
  return (!row.valid_from || row.valid_from <= isoDate) && (!row.valid_until || row.valid_until >= isoDate);
}

/**
 * Horários do Supabase; sem backend configurado (ou tabela vazia),
 * usa siteConfig.defaultHours para o site e o JSON-LD nunca ficarem sem horário.
 */
export async function getBusinessHours(): Promise<BusinessHours> {
  const supabase = getSupabase('hours');
  if (!supabase) return FALLBACK;

  const today = new Date().toISOString().slice(0, 10);
  const in14Days = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [regular, special] = await Promise.all([
    supabase
      .from('opening_hours')
      .select('weekday, opens_at, closes_at, valid_from, valid_until')
      .order('weekday')
      .order('opens_at'),
    supabase
      .from('special_hours')
      .select('date, is_closed, opens_at, closes_at, note')
      .gte('date', today)
      .lte('date', in14Days)
      .order('date'),
  ]);

  if (regular.error || special.error) {
    console.error('[data/hours]', regular.error?.message ?? special.error?.message);
    return FALLBACK;
  }

  const active = (regular.data ?? []).filter((row) => isActiveOn(row, today));
  return {
    regular: active.length > 0 ? active : FALLBACK.regular,
    special: special.data ?? [],
  };
}
