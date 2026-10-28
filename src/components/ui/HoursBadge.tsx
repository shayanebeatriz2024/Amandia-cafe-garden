import { siteConfig } from '@/lib/site-config';
import { cn } from '@/lib/cn';
import { ClockIcon } from './icons';

/** Selo com o horário oficial em dois turnos. */
export function HoursBadge({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-linen-300 bg-surface px-4 py-2 text-sm text-heading shadow-hairline',
        className,
      )}
    >
      <span className="relative flex size-2" aria-hidden="true">
        <span className="absolute inline-flex size-full rounded-full bg-moss-400 opacity-60 motion-safe:animate-ping" />
        <span className="relative inline-flex size-2 rounded-full bg-moss-600" />
      </span>
      <ClockIcon width={16} height={16} className="text-moss-600" />
      <span className="tabular-nums">{siteConfig.hoursSummary}</span>
    </p>
  );
}
