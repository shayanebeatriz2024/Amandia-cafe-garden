import { cn } from '@/lib/cn';

/** Variantes de botão — acabamento editorial (pílula, peso médio, tracking leve). */
export const BUTTON_VARIANTS = {
  // Site em verde sálvia: primário claro (off-white) com texto verde-escuro
  primary: 'bg-amandia-offwhite text-moss-900 shadow-hairline hover:bg-amandia-butter',
  secondary: 'border border-white/40 bg-white/5 text-amandia-offwhite hover:border-amandia-butter hover:bg-white/15 hover:text-amandia-butter',
  light: 'bg-linen-50 text-moss-900 hover:bg-linen-200',
  ghost: 'text-amandia-offwhite underline-offset-4 hover:text-amandia-butter hover:underline',
  // Contorno claro para fundos escuros (Hero sobre vídeo)
  outlineLight: 'border border-amandia-cream/70 text-amandia-cream hover:bg-amandia-cream/10',
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;

export function buttonClasses(variant: ButtonVariant = 'primary', className?: string): string {
  return cn(
    variant !== 'ghost' &&
      'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold tracking-wide transition-colors',
    // ghost: alvo de toque de 44px no celular (WCAG 2.5.5); no desktop volta ao tamanho do texto
    variant === 'ghost' && 'inline-flex min-h-11 items-center gap-2 md:min-h-0',
    BUTTON_VARIANTS[variant],
    className,
  );
}
