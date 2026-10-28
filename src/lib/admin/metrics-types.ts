import type { OutboundEventName } from '@/lib/analytics';

/** Contrato JSON de GET /api/admin/metrics (compartilhado entre a rota e o painel). */

export const METRIC_RANGES = [7, 14, 30] as const;
export type MetricRange = (typeof METRIC_RANGES)[number];

export const ACTION_LABELS: Record<OutboundEventName, string> = {
  click_whatsapp: 'Conversas no WhatsApp',
  click_booking: 'Pedidos de reserva',
  click_route: 'Rotas (Como chegar)',
  click_instagram: 'Visitas ao Instagram',
  click_phone: 'Ligações',
};

export interface DailyPoint {
  /** YYYY-MM-DD no fuso de São Paulo. */
  date: string;
  visitors: number;
  pageViews: number;
  whatsappClicks: number;
}

export interface TrafficSource {
  label: string;
  sessions: number;
  /** Fração (0–1) do total de sessões do período. */
  share: number;
}

export interface PeakWindow {
  /** Ex.: "Sexta a domingo". */
  days: string;
  /** Ex.: "14h às 18h". */
  hours: string;
}

export interface SiteAction {
  event: OutboundEventName;
  label: string;
  count: number;
}

export interface AdminMetrics {
  /** true = dados simulados (credenciais do GA4 ainda não configuradas). */
  demo: boolean;
  range: { days: MetricRange; startDate: string; endDate: string };
  totals: {
    visitors: number;
    pageViews: number;
    sessions: number;
    whatsappClicks: number;
  };
  /** Cliques em todos os botões rastreados (WhatsApp, reservas, rota, Instagram, telefone). */
  actions: SiteAction[];
  /** Janela com mais cliques no WhatsApp; null quando ainda há poucos dados. */
  peak: PeakWindow | null;
  sources: TrafficSource[];
  daily: DailyPoint[];
  generatedAt: string;
}

export type MetricsErrorCode = 'not_configured' | 'permission_denied' | 'invalid_property' | 'ga_error';

export type MetricsResponse =
  | { ok: true; data: AdminMetrics }
  | { ok: false; error: MetricsErrorCode | 'unauthorized'; message: string };
