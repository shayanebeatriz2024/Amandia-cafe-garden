/** Datas do painel no fuso do café (a propriedade GA4 usa o mesmo fuso). */

const TIME_ZONE = 'America/Sao_Paulo';
const DAY_MS = 86_400_000;

/** YYYY-MM-DD no fuso de São Paulo, deslocado em `offsetDays`. */
export function isoDate(offsetDays = 0): string {
  const date = new Date(Date.now() + offsetDays * DAY_MS);
  return new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(date);
}

/** `days` datas consecutivas (YYYY-MM-DD) a partir de `startDate`. */
export function dateSeries(startDate: string, days: number): string[] {
  const start = new Date(`${startDate}T12:00:00Z`);
  return Array.from({ length: days }, (_, i) =>
    new Date(start.getTime() + i * DAY_MS).toISOString().slice(0, 10),
  );
}
