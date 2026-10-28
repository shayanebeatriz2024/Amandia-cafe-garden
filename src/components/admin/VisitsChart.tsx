'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts';
import type { DailyPoint } from '@/lib/admin/metrics-types';

const numberFormat = new Intl.NumberFormat('pt-BR');

/** "2026-10-07" → "07/10" */
export function shortDate(iso: string): string {
  const [, month, day] = iso.split('-');
  return `${day}/${month}`;
}

function ChartTooltip({ active, payload }: TooltipContentProps) {
  const point = payload?.[0]?.payload as DailyPoint | undefined;
  if (!active || !point) return null;
  return (
    <div className="rounded-md border border-stone-200/80 bg-white px-3 py-2 text-sm shadow-sm">
      <p className="font-semibold text-stone-900">{shortDate(point.date)}</p>
      <p className="mt-1 text-stone-700">{numberFormat.format(point.visitors)} visitantes</p>
      <p className="text-stone-500">{numberFormat.format(point.pageViews)} páginas vistas</p>
      <p className="text-amandia-green">{numberFormat.format(point.whatsappClicks)} cliques no WhatsApp</p>
    </div>
  );
}

/** Visitantes por dia (barras). O tooltip detalha páginas vistas e cliques no WhatsApp. */
export function VisitsChart({ data }: { data: DailyPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -16 }}>
          <CartesianGrid vertical={false} stroke="#F5F5F4" /* stone-100 */ />
          <XAxis
            dataKey="date"
            tickFormatter={shortDate}
            tickLine={false}
            axisLine={{ stroke: '#E7E5E4' }} /* stone-200 */
            tick={{ fill: '#78716C', fontSize: 12 }} /* stone-500 */
            minTickGap={16}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#78716C', fontSize: 12 }}
          />
          <Tooltip content={ChartTooltip} cursor={{ fill: '#F5F5F4' }} />
          {/* Verde floresta oficial (amandia.green) com topo levemente arredondado (≈ rounded-t-sm) */}
          <Bar dataKey="visitors" name="Visitantes" fill="#2F5241" radius={[2, 2, 0, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
