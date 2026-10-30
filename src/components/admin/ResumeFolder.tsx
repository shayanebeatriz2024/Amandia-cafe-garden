'use client';

import { useMemo, useState } from 'react';
import { FileText, FolderOpen, Mail, MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { STRENGTHS, strengthLabel, toWhatsAppDigits } from '@/lib/careers';
import type { ApplicationView } from '@/lib/admin/applications';

const PERIODS = [
  { days: 0, label: 'Todos' },
  { days: 7, label: '7 dias' },
  { days: 30, label: '30 dias' },
  { days: 90, label: '90 dias' },
] as const;

const dateFormat = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

function whatsAppHref(candidate: ApplicationView): string {
  const firstName = candidate.name.replace(/^Exemplo:\s*/, '').split(' ')[0];
  const message = `Olá, ${firstName}! Aqui é do Amandia Café Garden 🌿 Recebemos seu currículo e gostaríamos de conversar.`;
  return `https://wa.me/${toWhatsAppDigits(candidate.phone)}?text=${encodeURIComponent(message)}`;
}

/** Pastinha de currículos do "Faça parte da nossa equipe", com filtros de data e pontos fortes. */
export function ResumeFolder({ items, demo }: { items: ApplicationView[]; demo: boolean }) {
  const [period, setPeriod] = useState<number>(0);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const since = period > 0 ? Date.now() - period * 86_400_000 : 0;
    return items.filter(
      (item) =>
        new Date(item.createdAt).getTime() >= since &&
        (selected.length === 0 || selected.some((key) => item.strengths.includes(key))),
    );
  }, [items, period, selected]);

  const toggle = (key: string) =>
    setSelected((current) => (current.includes(key) ? current.filter((k) => k !== key) : [...current, key]));

  return (
    <section aria-labelledby="pastinha-titulo">
      {/* Aba da pastinha */}
      <div className="inline-flex items-center gap-2 rounded-t-lg border border-b-0 border-clay-300 bg-amandia-butter/70 px-4 py-2">
        <FolderOpen className="size-4 text-amandia-orange-ink" aria-hidden="true" />
        <h2 id="pastinha-titulo" className="text-sm font-semibold text-stone-900">
          Currículos · Faça parte da nossa equipe
        </h2>
        <span className="rounded-full bg-white/80 px-2 text-xs font-semibold tabular-nums text-stone-700">
          {items.length}
        </span>
      </div>

      <div className="rounded-b-lg rounded-tr-lg border border-clay-300 bg-[#FFFBEA] p-5 shadow-sm">
        {demo && (
          <p className="mb-4 rounded-md border border-stone-200 bg-white px-3 py-2 text-xs text-stone-500">
            Exemplos fictícios. Os currículos reais aparecem aqui quando a chave do Supabase
            (SUPABASE_SERVICE_ROLE_KEY) estiver configurada no servidor.
          </p>
        )}

        {/* Filtros */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-28 text-xs font-medium uppercase tracking-wider text-stone-500">Data</span>
            <div role="group" aria-label="Período" className="inline-flex rounded-md border border-stone-200/80 bg-white p-0.5 shadow-sm">
              {PERIODS.map((p) => (
                <button
                  key={p.days}
                  type="button"
                  aria-pressed={period === p.days}
                  onClick={() => setPeriod(p.days)}
                  className={cn(
                    'h-8 rounded px-3 text-sm font-medium transition-colors',
                    period === p.days ? 'bg-amandia-green text-white' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="w-28 text-xs font-medium uppercase tracking-wider text-stone-500">Pontos fortes</span>
            <div role="group" aria-label="Pontos fortes" className="flex flex-wrap gap-1.5">
              {STRENGTHS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  aria-pressed={selected.includes(s.key)}
                  onClick={() => toggle(s.key)}
                  className={cn(
                    'h-8 rounded-full border px-3 text-sm transition-colors',
                    selected.includes(s.key)
                      ? 'border-amandia-green bg-amandia-green text-white'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900',
                  )}
                >
                  {s.label}
                </button>
              ))}
              {selected.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelected([])}
                  className="inline-flex h-8 items-center gap-1 px-2 text-sm text-stone-500 hover:text-stone-900"
                >
                  <X className="size-3.5" aria-hidden="true" /> Limpar
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="mt-5 text-sm text-stone-500" aria-live="polite">
          {filtered.length === 1 ? '1 currículo' : `${filtered.length} currículos`}
          {filtered.length !== items.length && ` de ${items.length}`}
        </p>

        {filtered.length === 0 ? (
          <p className="mt-3 rounded-md bg-white px-4 py-8 text-center text-sm text-stone-500">
            Nenhum currículo com esses filtros.
          </p>
        ) : (
          <ul className="mt-3 grid gap-3 md:grid-cols-2">
            {filtered.map((candidate) => (
              <li key={candidate.id} className="flex flex-col rounded-lg border border-stone-200/80 bg-white p-4 shadow-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold text-stone-900">{candidate.name}</h3>
                  <time dateTime={candidate.createdAt} className="shrink-0 text-xs tabular-nums text-stone-400">
                    {dateFormat.format(new Date(candidate.createdAt))}
                  </time>
                </div>

                {candidate.strengths.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-1">
                    {candidate.strengths.map((key) => (
                      <li key={key} className="rounded-full bg-sage-200 px-2 py-0.5 text-xs font-medium text-amandia-green">
                        {strengthLabel(key)}
                      </li>
                    ))}
                  </ul>
                )}

                <p className="mt-3 line-clamp-4 whitespace-pre-line text-sm leading-relaxed text-stone-600">
                  {candidate.about}
                </p>

                <p className="mt-3 text-sm text-stone-500">
                  {candidate.phone} ·{' '}
                  <a href={`mailto:${candidate.email}`} className="inline-flex items-center gap-1 hover:text-stone-900 hover:underline">
                    <Mail className="size-3.5" aria-hidden="true" />
                    {candidate.email}
                  </a>
                </p>

                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <a
                    href={whatsAppHref(candidate)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center gap-2 rounded-md bg-amandia-green px-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-moss-900"
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Chamar no WhatsApp
                  </a>
                  {candidate.resumeUrl ? (
                    <a
                      href={candidate.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200/80 bg-white px-3 text-sm font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50 hover:text-stone-900"
                    >
                      <FileText className="size-4 text-stone-400" aria-hidden="true" />
                      Ver currículo
                    </a>
                  ) : (
                    <span className="inline-flex h-9 items-center px-1 text-xs text-stone-400">Sem arquivo anexado</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
