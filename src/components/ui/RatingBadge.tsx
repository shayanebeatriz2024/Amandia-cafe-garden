import { siteConfig } from '@/lib/site-config';
import { cn } from '@/lib/cn';
import { StarIcon } from './icons';

/** Prova social — leva à ficha do Google Maps com as avaliações reais. */
export function RatingBadge({ className }: { className?: string }) {
  const { value, count } = siteConfig.googleRating;
  const rating = value.toLocaleString('pt-BR', { minimumFractionDigits: 1 });

  return (
    <a
      href={siteConfig.googleMapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-2 text-sm text-ink transition-colors hover:text-primary',
        className,
      )}
    >
      <StarIcon className="fill-amandia-orange text-amandia-orange" width={16} height={16} />
      <span>
        <strong className="font-semibold text-heading">{rating}</strong> no Google ·{' '}
        {count}+ avaliações
      </span>
    </a>
  );
}
