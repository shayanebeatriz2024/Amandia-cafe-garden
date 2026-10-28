import { OUTBOUND_EVENT_NAMES, type OutboundEventName } from '@/lib/analytics';
import { dateSeries, isoDate } from './dates';
import { ACTION_LABELS, type AdminMetrics, type MetricRange } from './metrics-types';

/**
 * Modo demonstração: dados simulados enquanto as chaves do GA4 não são configuradas.
 * Determinístico (derivado das datas), então os números não "pulam" a cada recarregamento.
 * Valores de referência para 30 dias; períodos menores são proporcionais.
 */

const MONTH = {
  visitors: 342,
  pageViews: 1_010,
  sessions: 415,
  actions: {
    click_whatsapp: 48,
    click_booking: 14,
    click_route: 37,
    click_instagram: 22,
    click_phone: 6,
  } satisfies Record<OutboundEventName, number>,
};

const SOURCE_SHARES = [
  { label: 'Google Maps / Perfil da Empresa', share: 0.62 },
  { label: 'Instagram / Link da Bio', share: 0.24 },
  { label: 'Acesso Direto / Busca Orgânica', share: 0.14 },
];

/** Mais conversas no fim de semana, à tarde (mesmo formato do cálculo real). */
const PEAK = { days: 'Sexta a domingo', hours: '14h às 18h' };

/** Movimento típico de café: fim de semana cheio, início da semana calmo (dom → sáb). */
const WEEKDAY_WEIGHT = [1.7, 0.6, 0.8, 0.85, 0.95, 1.25, 1.8];

/** Ruído estável em [-1, 1] derivado da data. */
function jitter(date: string): number {
  let hash = 0;
  for (const char of date) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return Math.sin(hash);
}

/** Reparte `total` em inteiros proporcionais aos pesos (maiores restos), somando exatamente `total`. */
function distribute(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (total * w) / sum);
  const result = raw.map(Math.floor);
  let remaining = total - result.reduce((a, b) => a + b, 0);
  const byRemainder = raw
    .map((value, i) => ({ i, rest: value - Math.floor(value) }))
    .sort((a, b) => b.rest - a.rest);
  for (const { i } of byRemainder) {
    if (remaining-- <= 0) break;
    result[i] = (result[i] ?? 0) + 1;
  }
  return result;
}

export function buildDemoMetrics(days: MetricRange): AdminMetrics {
  const endDate = isoDate(0);
  const startDate = isoDate(-(days - 1));
  const dates = dateSeries(startDate, days);
  const ratio = days / 30;
  const scale = (value: number) => Math.round(value * ratio);

  // Visitantes únicos não somam linearmente: quem volta em outro dia conta uma vez só no período.
  const visitors = Math.round(MONTH.visitors * ratio ** 0.85);
  const pageViews = scale(MONTH.pageViews);
  const sessions = scale(MONTH.sessions);

  const weights = dates.map(
    (date) => (WEEKDAY_WEIGHT[new Date(`${date}T12:00:00Z`).getUTCDay()] ?? 1) * (1 + 0.2 * jitter(date)),
  );
  const dailyVisitors = distribute(Math.round(visitors * 1.12), weights);
  const dailyPageViews = distribute(pageViews, weights);
  const dailyWhatsapp = distribute(scale(MONTH.actions.click_whatsapp), weights);

  return {
    demo: true,
    range: { days, startDate, endDate },
    totals: {
      visitors,
      pageViews,
      sessions,
      whatsappClicks: scale(MONTH.actions.click_whatsapp),
    },
    actions: OUTBOUND_EVENT_NAMES.map((event) => ({
      event,
      label: ACTION_LABELS[event],
      count: scale(MONTH.actions[event]),
    })),
    peak: PEAK,
    sources: SOURCE_SHARES.map(({ label, share }) => ({
      label,
      share,
      sessions: Math.round(sessions * share),
    })),
    daily: dates.map((date, i) => ({
      date,
      visitors: dailyVisitors[i] ?? 0,
      pageViews: dailyPageViews[i] ?? 0,
      whatsappClicks: dailyWhatsapp[i] ?? 0,
    })),
    generatedAt: new Date().toISOString(),
  };
}
