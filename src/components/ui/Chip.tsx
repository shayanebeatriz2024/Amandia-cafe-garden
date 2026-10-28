import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

const TONES = {
  moss: 'bg-moss-100 text-moss-800',
  linen: 'bg-linen-50 text-bark-700 ring-1 ring-inset ring-linen-300',
  clay: 'bg-clay-300/30 text-clay-700',
} as const;

type ChipProps = {
  children: ReactNode;
  tone?: keyof typeof TONES;
  icon?: ReactNode;
  className?: string;
};

export function Chip({ children, tone = 'moss', icon, className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium',
        TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
