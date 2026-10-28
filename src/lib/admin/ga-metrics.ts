import 'server-only';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { OUTBOUND_EVENT_NAMES, type OutboundEventName } from '@/lib/analytics';
import { dateSeries, isoDate } from './dates';
import { buildDemoMetrics } from './demo-metrics';
import {
  ACTION_LABELS,
  type AdminMetrics,
  type DailyPoint,
  type MetricRange,
  type MetricsErrorCode,
  type PeakWindow,
  type SiteAction,
  type TrafficSource,
} from './metrics-types';

/**
 * Leitura das métricas do GA4 via Google Analytics Data API (Service Account).
 * Credenciais só no servidor: GA_PROPERTY_ID, GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY.
 */

const CACHE_TTL_MS = 5 * 60 * 1000; // poupa a cota da API em recarregamentos seguidos

export class MetricsError extends Error {
  constructor(
    public readonly code: MetricsErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'MetricsError';
  }
}

let client: BetaAnalyticsDataClient | undefined;
const cache = new Map<MetricRange, { expiresAt: number; data: AdminMetrics }>();

function getConfig() {
  const propertyId = process.env.GA_PROPERTY_ID?.trim();
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.trim();
  // A Vercel/.env guardam a chave com "\n" literais; aspas extras também são toleradas.
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/^"|"$/g, '').replace(/\\n/g, '\n');

  if (!propertyId || !clientEmail || !privateKey) {
    throw new MetricsError(
      'not_configured',
      'As credenciais do Google Analytics não estão configuradas no servidor.',
    );
  }
  return { propertyId, clientEmail, privateKey };
}

function getClient(clientEmail: string, privateKey: string): BetaAnalyticsDataClient {
  client ??= new BetaAnalyticsDataClient({
    credentials: { client_email: clientEmail, private_key: privateKey },
  });
  return client;
}

/** GA devolve datas como YYYYMMDD. */
function gaDateToIso(value: string): string {
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

type Row = {
  dimensionValues?: { value?: string | null }[] | null;
  metricValues?: { value?: string | null }[] | null;
};

const dim = (row: Row, i: number) => row.dimensionValues?.[i]?.value ?? '';
const num = (row: Row, i: number) => Number(row.metricValues?.[i]?.value ?? 0) || 0;

/** Agrupa origem/mídia do GA em rótulos que a equipe reconhece. */
function classifySource(source: string, medium: string): string {
  const s = source.toLowerCase();
  const m = medium.toLowerCase();

  if (s.includes('maps') || s.includes('gbp') || s.includes('business.google')) {
    return 'Google Maps / Perfil da Empresa';
  }
  if (s === '(direct)') return 'Acesso direto';
  if (['cpc', 'ppc', 'paid', 'paidsocial'].includes(m)) return 'Anúncios';
  if (s.includes('google') && m === 'organic') return 'Google Busca';
  if (s.includes('instagram') || s === 'ig') return 'Instagram';
  if (s.includes('facebook') || s === 'fb') return 'Facebook';
  if (s.includes('whatsapp') || s === 'wa.me') return 'WhatsApp';
  if (m === 'organic') return 'Outros buscadores';
  if (m === 'referral') return 'Outros sites';
  return 'Outras origens';
}

const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const PEAK_MIN_CLICKS = 5; // abaixo disso o "pico" seria ruído
const PEAK_DAYS = 3;
const PEAK_HOURS = 4;

/** Início da janela de `size` posições com maior soma (`circular` = a semana dá a volta). */
function bestWindow(counts: number[], size: number, circular: boolean): number {
  const last = circular ? counts.length - 1 : counts.length - size;
  let best = 0;
  let bestSum = -1;
  for (let start = 0; start <= last; start++) {
    let sum = 0;
    for (let k = 0; k < size; k++) sum += counts[(start + k) % counts.length] ?? 0;
    if (sum > bestSum) [best, bestSum] = [start, sum];
  }
  return best;
}

/** Dias (3 seguidos) e horas (4 seguidas) com mais cliques no WhatsApp. */
function computePeak(rows: Row[]): PeakWindow | null {
  const byDay = Array<number>(7).fill(0);
  const byHour = Array<number>(24).fill(0);
  let total = 0;
  for (const row of rows) {
    const day = Number(dim(row, 0));
    const hour = Number(dim(row, 1));
    const count = num(row, 0);
    if (!Number.isInteger(day) || !Number.isInteger(hour) || day > 6 || hour > 23) continue;
    byDay[day] = (byDay[day] ?? 0) + count;
    byHour[hour] = (byHour[hour] ?? 0) + count;
    total += count;
  }
  if (total < PEAK_MIN_CLICKS) return null;

  const firstDay = bestWindow(byDay, PEAK_DAYS, true);
  const lastDay = (firstDay + PEAK_DAYS - 1) % 7;
  const firstHour = bestWindow(byHour, PEAK_HOURS, false);
  return {
    days: `${WEEKDAYS[firstDay]} a ${WEEKDAYS[lastDay]?.toLowerCase()}`,
    hours: `${firstHour}h às ${firstHour + PEAK_HOURS}h`,
  };
}

async function fetchFromGa(days: MetricRange): Promise<AdminMetrics> {
  const { propertyId, clientEmail, privateKey } = getConfig();
  const endDate = isoDate(0);
  const startDate = isoDate(-(days - 1));
  const dateRanges = [{ startDate, endDate }];
  const onlyTrackedEvents = {
    filter: {
      fieldName: 'eventName',
      inListFilter: { values: [...OUTBOUND_EVENT_NAMES] },
    },
  };

  const [response] = await getClient(clientEmail, privateKey).batchRunReports({
    property: `properties/${propertyId}`,
    requests: [
      // 0 — totais do período (activeUsers deduplicado no período inteiro)
      {
        dateRanges,
        metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }, { name: 'sessions' }],
      },
      // 1 — série diária de acessos
      {
        dateRanges,
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
        limit: 100,
      },
      // 2 — cliques nos botões rastreados, por dia
      {
        dateRanges,
        dimensions: [{ name: 'date' }, { name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: onlyTrackedEvents,
        limit: 1000,
      },
      // 3 — origens do tráfego
      {
        dateRanges,
        dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 50,
      },
      // 4 — cliques no WhatsApp por dia da semana e hora (horário de pico)
      {
        dateRanges,
        dimensions: [{ name: 'dayOfWeek' }, { name: 'hour' }],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: {
          filter: { fieldName: 'eventName', stringFilter: { value: 'click_whatsapp' } },
        },
        limit: 200,
      },
    ],
  });

  const [totalsReport, dailyReport, eventsReport, sourcesReport, peakReport] =
    response.reports ?? [];

  const totalsRow = totalsReport?.rows?.[0];
  const totals = {
    visitors: totalsRow ? num(totalsRow, 0) : 0,
    pageViews: totalsRow ? num(totalsRow, 1) : 0,
    sessions: totalsRow ? num(totalsRow, 2) : 0,
    whatsappClicks: 0,
  };

  // Série diária com zeros nos dias sem dados (o GA omite essas linhas).
  const daily = new Map<string, DailyPoint>(
    dateSeries(startDate, days).map((date) => [
      date,
      { date, visitors: 0, pageViews: 0, whatsappClicks: 0 },
    ]),
  );
  for (const row of dailyReport?.rows ?? []) {
    const point = daily.get(gaDateToIso(dim(row, 0)));
    if (!point) continue;
    point.visitors = num(row, 0);
    point.pageViews = num(row, 1);
  }

  const actionCounts = new Map<OutboundEventName, number>(OUTBOUND_EVENT_NAMES.map((e) => [e, 0]));
  for (const row of eventsReport?.rows ?? []) {
    const event = dim(row, 1) as OutboundEventName;
    const count = num(row, 0);
    if (!actionCounts.has(event)) continue;
    actionCounts.set(event, (actionCounts.get(event) ?? 0) + count);
    if (event === 'click_whatsapp') {
      const point = daily.get(gaDateToIso(dim(row, 0)));
      if (point) point.whatsappClicks += count;
    }
  }
  totals.whatsappClicks = actionCounts.get('click_whatsapp') ?? 0;

  const actions: SiteAction[] = OUTBOUND_EVENT_NAMES.map((event) => ({
    event,
    label: ACTION_LABELS[event],
    count: actionCounts.get(event) ?? 0,
  }));

  const grouped = new Map<string, number>();
  let sourceSessions = 0;
  for (const row of sourcesReport?.rows ?? []) {
    const label = classifySource(dim(row, 0), dim(row, 1));
    const sessions = num(row, 0);
    grouped.set(label, (grouped.get(label) ?? 0) + sessions);
    sourceSessions += sessions;
  }
  const sources: TrafficSource[] = [...grouped.entries()]
    .map(([label, sessions]) => ({
      label,
      sessions,
      share: sourceSessions > 0 ? sessions / sourceSessions : 0,
    }))
    .sort((a, b) => b.sessions - a.sessions);

  return {
    demo: false,
    range: { days, startDate, endDate },
    totals,
    actions,
    peak: computePeak(peakReport?.rows ?? []),
    sources,
    daily: [...daily.values()],
    generatedAt: new Date().toISOString(),
  };
}

/** Traduz falhas do gRPC do Google em mensagens acionáveis. */
function toMetricsError(error: unknown): MetricsError {
  if (error instanceof MetricsError) return error;
  const code = (error as { code?: number }).code;
  if (code === 7 || code === 16) {
    return new MetricsError(
      'permission_denied',
      'A conta de serviço não tem acesso a esta propriedade do GA4. Adicione o e-mail dela como Leitor na propriedade.',
    );
  }
  if (code === 3 || code === 5) {
    return new MetricsError('invalid_property', 'O GA_PROPERTY_ID informado não foi encontrado ou é inválido.');
  }
  return new MetricsError('ga_error', 'O Google Analytics não respondeu agora. Tente novamente em instantes.');
}

/** Credenciais ainda não cadastradas → painel em modo demonstração. */
export function isDemoMode(): boolean {
  return !(
    process.env.GA_PROPERTY_ID?.trim() &&
    process.env.GOOGLE_CLIENT_EMAIL?.trim() &&
    process.env.GOOGLE_PRIVATE_KEY?.trim()
  );
}

export async function getAdminMetrics(days: MetricRange): Promise<AdminMetrics> {
  if (isDemoMode()) return buildDemoMetrics(days);

  const cached = cache.get(days);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  try {
    const data = await fetchFromGa(days);
    cache.set(days, { expiresAt: Date.now() + CACHE_TTL_MS, data });
    return data;
  } catch (error) {
    console.error('[admin/metrics] falha ao consultar o GA4:', error);
    throw toMetricsError(error);
  }
}
