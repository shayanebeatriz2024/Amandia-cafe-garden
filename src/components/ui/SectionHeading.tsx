import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type SectionHeadingProps = {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
};

/** Eyebrow + h2 serifado + parágrafo opcional (docs/04-design-system.md §6). */
export function SectionHeading({ id, eyebrow, title, intro, align = 'left', className }: SectionHeadingProps) {
  return (
    <div className={cn(align === 'center' && 'mx-auto text-center', 'max-w-2xl', className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-h2">
        {title}
      </h2>
      {intro && <p className={cn('mt-4 text-lg', align === 'center' && 'mx-auto')}>{intro}</p>}
    </div>
  );
}
