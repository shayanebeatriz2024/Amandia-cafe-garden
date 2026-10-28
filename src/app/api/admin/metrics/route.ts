import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/admin/session';
import { getAdminMetrics, MetricsError } from '@/lib/admin/ga-metrics';
import { METRIC_RANGES, type MetricRange, type MetricsResponse } from '@/lib/admin/metrics-types';

export const runtime = 'nodejs'; // o client do GA usa gRPC (não roda no Edge)
export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'private, no-store' };

/** GET /api/admin/metrics?days=7|14|30 — métricas consolidadas do GA4 para o painel. */
export async function GET(request: NextRequest) {
  // O middleware já barra quem não tem sessão; a conferência aqui é defesa em profundidade.
  if (!(await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json<MetricsResponse>(
      { ok: false, error: 'unauthorized', message: 'Sessão expirada. Entre novamente.' },
      { status: 401, headers: NO_STORE },
    );
  }

  const requested = Number(request.nextUrl.searchParams.get('days') ?? 30);
  const days: MetricRange = METRIC_RANGES.includes(requested as MetricRange)
    ? (requested as MetricRange)
    : 30;

  try {
    const data = await getAdminMetrics(days);
    return NextResponse.json<MetricsResponse>({ ok: true, data }, { headers: NO_STORE });
  } catch (error) {
    const { code, message } =
      error instanceof MetricsError
        ? error
        : new MetricsError('ga_error', 'Erro inesperado ao carregar as métricas.');
    const status = code === 'not_configured' ? 503 : 502;
    return NextResponse.json<MetricsResponse>(
      { ok: false, error: code, message },
      { status, headers: NO_STORE },
    );
  }
}
