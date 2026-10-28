import { siteConfig } from '@/lib/site-config';
import { cn } from '@/lib/cn';
import { HeartIcon } from './icons';

const VARIANTS = {
  hero: { wrapper: 'text-display text-heading', icon: 'hidden' },
  inline: { wrapper: 'text-h3 text-heading', icon: 'mt-1.5 text-clay-500' },
  footer: { wrapper: 'text-h2 text-linen-50', icon: 'mt-3 text-clay-300' },
} as const;

type GuidingQuoteProps = {
  variant?: keyof typeof VARIANTS;
  /** Renderiza como h1 (hero da Home) em vez de <p>. */
  as?: 'h1' | 'p';
  className?: string;
};

/** A frase-guia — sempre exatamente igual (docs/04-design-system.md §8). */
export function GuidingQuote({ variant = 'inline', as: Tag = 'p', className }: GuidingQuoteProps) {
  const styles = VARIANTS[variant];
  return (
    <Tag className={cn('flex items-start gap-3 font-serif font-medium italic', styles.wrapper, className)}>
      <HeartIcon className={cn('shrink-0', styles.icon)} width={24} height={24} />
      <span>{siteConfig.guidingPhrase}</span>
    </Tag>
  );
}
