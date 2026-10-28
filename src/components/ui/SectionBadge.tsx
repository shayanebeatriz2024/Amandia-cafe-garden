import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

// Fundos claros com texto verde floresta → contraste ≥ 7:1. Sem ícones (só o letreiro).
const TONES = {
  butter: 'bg-surface shadow-hairline',
  pink: 'bg-amandia-pink-tint',
  orange: 'bg-amandia-orange-tint',
  green: 'bg-amandia-green text-linen-50',
} as const;

type SectionBadgeProps = {
  children: ReactNode;
  tone?: keyof typeof TONES;
  /** heavy = caixa-alta de impacto · hand = lettering */
  variant?: 'heavy' | 'hand';
  className?: string;
};

/** Badge arredondada no topo de cada bloco ("CURADORIA AFETIVA", "RECEITA DA CASA"…). */
export function SectionBadge({ children, tone = 'butter', variant = 'heavy', className }: SectionBadgeProps) {
  const box = TONES[tone];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-amandia-green',
        variant === 'heavy'
          ? 'font-display-heavy text-[0.7rem] uppercase tracking-[0.14em]'
          : 'font-handwriting text-xl font-semibold leading-none',
        box,
        className,
      )}
    >
      {children}
    </span>
  );
}
