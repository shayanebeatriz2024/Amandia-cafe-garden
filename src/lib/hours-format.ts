/**
 * Formatação de horários — funções puras (sem server-only), usáveis em
 * Server e Client Components.
 */

export type HoursRow = {
  /** ISO-8601: 1 = segunda … 7 = domingo */
  weekday: number;
  /** HH:MM:SS */
  opens_at: string;
  closes_at: string;
};

export const WEEKDAY_LABELS: Record<number, string> = {
  1: 'Segunda',
  2: 'Terça',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sábado',
  7: 'Domingo',
};

/** "08:30:00" → "8h30" · "19:00:00" → "19h" */
export function formatTime(time: string): string {
  const [h = '0', m = '00'] = time.split(':');
  return m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}`;
}

export interface HoursDisplayGroup {
  /** "Segunda a Domingo", "Sábado e Domingo", "Terça" */
  days: string;
  /** ["8h30 – 12h", "14h30 – 19h30"]; vazio = fechado */
  shifts: string[];
}

function labelForRun(first: number, last: number): string {
  const a = WEEKDAY_LABELS[first] ?? '';
  const b = WEEKDAY_LABELS[last] ?? '';
  if (first === last) return a;
  if (last === first + 1) return `${a} e ${b}`;
  return `${a} a ${b}`;
}

/**
 * Agrupa dias consecutivos com os mesmos turnos:
 * 14 linhas (seg–dom × 2 turnos) → [{ days: 'Segunda a Domingo', shifts: [...] }].
 */
export function groupHoursForDisplay(rows: readonly HoursRow[]): HoursDisplayGroup[] {
  const shiftsByDay = new Map<number, string[]>();
  for (let day = 1; day <= 7; day++) shiftsByDay.set(day, []);
  for (const row of [...rows].sort((a, b) => a.opens_at.localeCompare(b.opens_at))) {
    shiftsByDay.get(row.weekday)?.push(`${formatTime(row.opens_at)} – ${formatTime(row.closes_at)}`);
  }

  const groups: Array<HoursDisplayGroup & { first: number; last: number }> = [];
  for (let day = 1; day <= 7; day++) {
    const shifts = shiftsByDay.get(day) ?? [];
    const prev = groups.at(-1);
    if (prev && prev.last === day - 1 && prev.shifts.join('|') === shifts.join('|')) {
      prev.last = day;
    } else {
      groups.push({ first: day, last: day, days: '', shifts });
    }
  }

  return groups.map(({ first, last, shifts }) => ({ days: labelForRun(first, last), shifts }));
}
