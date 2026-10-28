import { cn } from '@/lib/cn';
import { FlowerSprig } from './coffee-illustrations';

const SEAM_POSITIONS = {
  center: 'left-1/2 -translate-x-1/2',
  left: 'left-[8%] -rotate-12',
  right: 'right-[8%] rotate-12',
} as const;

type SectionSeamProps = {
  position?: keyof typeof SEAM_POSITIONS;
};

/**
 * Marca d'água da florzinha na emenda entre duas seções: altura zero (não mexe no layout),
 * metade sobre cada seção, quase transparente e fora da árvore de acessibilidade.
 */
export function SectionSeam({ position = 'center' }: SectionSeamProps) {
  return (
    <div className="pointer-events-none relative h-0" aria-hidden="true">
      <FlowerSprig
        className={cn(
          'absolute top-0 w-20 -translate-y-1/2 text-ceramic-brown/15 md:w-28 lg:w-32',
          SEAM_POSITIONS[position],
        )}
      />
    </div>
  );
}
