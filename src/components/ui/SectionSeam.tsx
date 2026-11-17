import Image from 'next/image';
import { cn } from '@/lib/cn';
import { illustrations } from '@/lib/images';

const SEAM_POSITIONS = {
  center: 'left-1/2 -translate-x-1/2',
  left: 'left-[8%] -rotate-12',
  right: 'right-[8%] rotate-12',
} as const;

const SEAM_ART = {
  janela: illustrations.adesivoJanela,
  coracao: illustrations.adesivoCoracaoVaso,
} as const;

type SectionSeamProps = {
  position?: keyof typeof SEAM_POSITIONS;
  /** Adesivo da cartela oficial usado na emenda (padrão: janela). */
  art?: keyof typeof SEAM_ART;
};

/**
 * Marca d'água da janela (adesivo da cartela oficial) na emenda entre duas seções: altura zero (não mexe no layout),
 * metade sobre cada seção, quase transparente e fora da árvore de acessibilidade.
 */
export function SectionSeam({ position = 'center', art = 'janela' }: SectionSeamProps) {
  return (
    <div className="pointer-events-none relative h-0" aria-hidden="true">
      <Image
        src={SEAM_ART[art]}
        alt=""
        sizes="(min-width: 1024px) 160px, (min-width: 768px) 128px, 96px"
        className={cn(
          'absolute top-0 -translate-y-1/2 opacity-40',
          art === 'coracao' ? 'w-16 md:w-20 lg:w-24' : 'w-24 md:w-32 lg:w-40',
          SEAM_POSITIONS[position],
        )}
      />
    </div>
  );
}
