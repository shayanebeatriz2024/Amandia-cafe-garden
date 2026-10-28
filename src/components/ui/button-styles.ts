import { cn } from '@/lib/cn';

/** Variantes de botão — acabamento editorial (pílula, peso médio, tracking leve). */
export const BUTTON_VARIANTS = {
  primary: 'bg-amandia-green text-linen-50 shadow-hairline hover:bg-moss-900',
  secondary: 'border border-amandia-green/25 bg-surface text-amandia-green hover:border-amandia-orange hover:bg-amandia-orange-tint',
  light: 'bg-linen-50 text-moss-900 hover:bg-linen-200',
  ghost: 'text-moss-600 underline-offset-4 hover:underline',
  // Contorno claro para fundos escuros (Hero sobre vídeo)
  outlineLight: 'border border-amandia-cream/70 text-amandia-cream hover:bg-amandia-cream/10',
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;

export function buttonClasses(variant: ButtonVariant = 'primary', className?: string): string {
  return cn(
    variant !== 'ghost' &&
      'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold tracking-wide transition-colors',
    variant === 'ghost' && 'inline-flex items-center gap-2',
    BUTTON_VARIANTS[variant],
    className,
  );
}
