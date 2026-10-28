'use client';

import { useCallback, useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { AlertCircle, Clock, Compass, MessageCircle, RefreshCw, Users } from 'lucide-react';
import { cn } from '@/lib/cn';
import {
  METRIC_RANGES,
  type AdminMetrics,
  type MetricRange,
  type MetricsResponse,
} from '@/lib/admin/metrics-types';
import { VisitsChart, shortDate } from './VisitsChart';

const numberFormat = new Intl.NumberFormat('pt-BR');
const percentFormat = new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 0 });

/** Superfície padrão do painel: cantos discretos, borda fina e sombra leve. */
const SURFACE = 'rounded-lg border border-stone-200/80 bg-white shadow-sm';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: AdminMetrics };

export function Dashboard() {
  const [days, setDays] = useState<MetricRange>(30);
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [reloadKey, setReloadKey] = useState(0);
  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });

    fetch(`/api/admin/metrics?days=${days}`, { signal: controller.signal, cache: 'no-store' })
      .then(async (res) => {
        if (res.status === 401) {
          window.location.assign('/admin/login');
          return;
        }
        const body = (await res.json()) as MetricsResponse;
        setState(body.ok ? { status: 'ready', data: body.data } : { status: 'error', message: body.message });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.error(error);
        setState({ status: 'error', message: 'Não foi possível carregar as métricas. Verifique sua conexão.' });
      });

    return () => controller.abort();
  }, [days, reloadKey]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-stone-500">
          {state.status === 'ready'
            ? `Período de ${shortDate(state.data.range.startDate)} a ${shortDate(state.data.range.endDate)}`
            : 'Dados do Google Analytics'}
        </p>
        <RangePicker value={days} onChange={setDays} />
      </div>

      {state.status === 'loading' && <DashboardSkeleton />}
      {state.status === 'error' && <ErrorPanel message={state.message} onRetry={retry} />}
      {state.status === 'ready' && <DashboardContent data={state.data} />}
    </div>
  );
}

function RangePicker({ value, onChange }: { value: MetricRange; onChange: (v: MetricRange) => void }) {
  return (
    <div role="group" aria-label="Período" className="inline-flex rounded-md border border-stone-200/80 bg-white p-0.5 shadow-sm">
      {METRIC_RANGES.map((range) => (
        <button
          key={range}
          type="button"
          aria-pressed={value === range}
          onClick={() => onChange(range)}
          className={cn(
            'h-8 rounded px-3 text-sm font-medium transition-colors',
            value === range ? 'bg-amandia-green text-white' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
          )}
        >
          {range} dias
        </button>
      ))}
    </div>
  );
}

function DashboardContent({ data }: { data: AdminMetrics }) {
  const { totals, sources, actions, daily, range, peak } = data;
  const topSource = sources[0];
  const contactRate = totals.visitors > 0 ? Math.min(totals.whatsappClicks / totals.visitors, 1) : 0;

  return (
    <>
      {/* Resumo: uma faixa única com divisores de 1px (gap-px sobre fundo de borda) */}
      <div className="grid gap-px overflow-hidden rounded-lg border border-stone-200/80 bg-stone-200/80 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          icon={Users}
          label={`Visitantes · ${range.days} dias`}
          value={numberFormat.format(totals.visitors)}
          detail={`${numberFormat.format(totals.pageViews)} páginas vistas`}
        />
        <Metric
          icon={MessageCircle}
          label="Contatos no WhatsApp"
          value={numberFormat.format(totals.whatsappClicks)}
          detail={
            <>
              <span className="font-semibold text-amandia-green">{percentFormat.format(contactRate)}</span> dos
              visitantes entraram em contato
            </>
          }
        />
        <Metric
          icon={Compass}
          label="Canal principal"
          value={topSource ? percentFormat.format(topSource.share) : '—'}
          detail={topSource?.label ?? 'Nenhuma visita no período'}
        />
        <Metric
          icon={Clock}
          label="Pico de consultas"
          value={peak?.hours ?? '—'}
          detail={peak?.days ?? 'Poucos contatos para estimar ainda'}
        />
      </div>

      <Panel title="Acessos por dia" subtitle="Passe o dedo ou o mouse sobre as barras para ver os detalhes.">
        <VisitsChart data={daily} />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Origem das visitas" subtitle={`${numberFormat.format(totals.sessions)} visitas no período`}>
          {sources.length === 0 ? (
            <EmptyNote>Ainda não há visitas registradas neste período.</EmptyNote>
          ) : (
            <ul className="space-y-5">
              {sources.map((source) => (
                <li key={source.label}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-medium text-stone-800">{source.label}</span>
                    <span className="shrink-0 tabular-nums">
                      <span className="font-semibold text-stone-900">{percentFormat.format(source.share)}</span>
                      <span className="ml-2 text-stone-400">{numberFormat.format(source.sessions)}</span>
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-sm bg-stone-100">
                    <div
                      className="h-full rounded-sm bg-amandia-green"
                      style={{ width: `${Math.max(source.share * 100, 2)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Cliques nos botões do site" subtitle="Ações de contato no celular e no computador.">
          <dl className="divide-y divide-stone-100">
            {actions.map((action) => (
              <div key={action.event} className="flex items-center justify-between gap-3 py-3 text-sm first:pt-0 last:pb-0">
                <dt className="text-stone-600">{action.label}</dt>
                <dd className="font-semibold tabular-nums text-stone-900">{numberFormat.format(action.count)}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>

      <p className="text-xs text-stone-400">
        O Google Analytics pode levar até 48 horas para consolidar os dados mais recentes. Taxa de contato =
        cliques no WhatsApp ÷ visitantes (estimativa).
      </p>
    </>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detail: ReactNode;
}) {
  return (
    <div className="bg-white p-5">
      <div className="flex items-center gap-2 text-stone-500">
        <Icon className="size-4 text-amandia-green" aria-hidden="true" />
        <h2 className="text-xs font-medium uppercase tracking-wider">{label}</h2>
      </div>
      <p className="mt-3 truncate text-3xl font-semibold tracking-tight text-stone-900 tabular-nums">{value}</p>
      <p className="mt-1 text-sm leading-snug text-stone-500">{detail}</p>
    </div>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className={SURFACE}>
      <header className="border-b border-stone-100 px-5 py-4">
        <h2 className="text-base font-semibold text-stone-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-stone-500">{subtitle}</p>}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="rounded-md bg-stone-50 px-4 py-6 text-center text-sm text-stone-500">{children}</p>;
}

function ErrorPanel({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className={cn(SURFACE, 'p-8 text-center')}>
      <AlertCircle className="mx-auto size-6 text-amandia-pink-ink" aria-hidden="true" />
      <h2 className="mt-3 text-base font-semibold text-stone-900">Não deu para carregar os dados</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-stone-600">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex h-9 items-center gap-2 rounded-md bg-amandia-green px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-moss-900"
      >
        <RefreshCw className="size-4" aria-hidden="true" />
        Tentar novamente
      </button>
    </div>
  );
}

function DashboardSkeleton() {
  const bar = 'rounded bg-stone-100 motion-safe:animate-pulse';
  return (
    <div aria-busy="true" aria-label="Carregando métricas" className="space-y-6">
      <div className="grid gap-px overflow-hidden rounded-lg border border-stone-200/80 bg-stone-200/80 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-5">
            <div className={cn(bar, 'h-3 w-28')} />
            <div className={cn(bar, 'mt-4 h-8 w-20')} />
            <div className={cn(bar, 'mt-3 h-3 w-36')} />
          </div>
        ))}
      </div>
      <div className={cn(SURFACE, 'h-96 p-5')}>
        <div className={cn(bar, 'h-4 w-32')} />
        <div className={cn(bar, 'mt-8 h-64')} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className={cn(SURFACE, 'h-72')} />
        <div className={cn(SURFACE, 'h-72')} />
      </div>
    </div>
  );
}
