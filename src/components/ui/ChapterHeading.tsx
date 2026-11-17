import Image, { type StaticImageData } from 'next/image';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { SectionBadge } from './SectionBadge';
import { Twinkles } from './doodles';

type ChapterHeadingProps = {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Badge lúdica no topo do bloco (ex.: "Curadoria afetiva"). */
  badge?: { label: string; tone?: ComponentProps<typeof SectionBadge>['tone'] };
  /** Ilustração oficial (56px) que abre a seção. */
  icon?: StaticImageData;
  /** Frase curta em lettering verde ao lado da ilustração. */
  kicker?: string;
  /** Nota em lettering ao lado do eyebrow (ex.: "sob encomenda"). */
  note?: string;
  align?: 'left' | 'center';
  className?: string;
};

/**
 * Abertura de capítulo — cada seção da Home é um capítulo da mesma narrativa.
 * Badge arredondada + eyebrow + título com destaque em lettering + lead.
 */
export function ChapterHeading({
  id,
  eyebrow,
  title,
  intro,
  badge,
  icon,
  kicker,
  note,
  align = 'left',
  className,
}: ChapterHeadingProps) {
  const centered = align === 'center';
  return (
    <header data-parallax="0.04" className={cn('relative max-w-2xl', centered && 'mx-auto text-center', className)}>
      {icon && (
        <div className={cn('mb-5 flex items-center gap-4', centered && 'justify-center')}>
          <Image src={icon} alt="" className="illustration-light h-14 w-auto object-contain" sizes="80px" />
          {kicker && (
            <p className="font-handwriting text-2xl font-semibold leading-tight text-heading">{kicker}</p>
          )}
        </div>
      )}
      {badge && (
        <div className={cn('mb-6 flex items-center gap-3', centered && 'justify-center')}>
          <SectionBadge tone={badge.tone}>{badge.label}</SectionBadge>
          <Twinkles className="-mt-3" />
        </div>
      )}
      {/* Eyebrow longo + nota: a nota quebra para a linha de baixo no mobile em vez de colar na borda */}
      <p className={cn('flex flex-wrap items-baseline gap-x-3 gap-y-1.5', centered && 'justify-center')}>
        <span className="eyebrow min-w-0 [overflow-wrap:anywhere]">{eyebrow}</span>
        {note && (
          <span className="whitespace-nowrap font-handwriting text-lg leading-none text-amandia-pink-ink sm:text-xl">
            {note}
          </span>
        )}
      </p>
      <h2 id={id} className="mt-5 text-h2">
        {title}
      </h2>
      {intro && <p className={cn('mt-6 text-lg leading-relaxed', centered && 'mx-auto')}>{intro}</p>}
    </header>
  );
}
