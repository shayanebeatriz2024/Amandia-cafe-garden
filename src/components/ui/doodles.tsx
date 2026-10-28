import type { SVGProps } from 'react';
import { cn } from '@/lib/cn';

/**
 * Micro-ilustrações lúdicas da direção de arte Amandia (estrelas cintilantes,
 * corações, sóis e folhagens dos flyers "Garden Bazar"). Sempre decorativas.
 * A cor vem de `className` (text-amandia-pink, text-amandia-orange…) via currentColor.
 */
type DoodleProps = SVGProps<SVGSVGElement>;

function Svg({ className, children, viewBox = '0 0 24 24', ...props }: DoodleProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn('pointer-events-none shrink-0', className)}
      {...props}
    >
      {children}
    </svg>
  );
}

/** Estrela cintilante de 4 pontas. */
export function Sparkle(props: DoodleProps) {
  return (
    <Svg {...props}>
      <path d="M12 0c.9 6.6 4.9 10.6 12 12-7.1 1.4-11.1 5.4-12 12-.9-6.6-4.9-10.6-12-12C7.1 10.6 11.1 6.6 12 0Z" />
    </Svg>
  );
}

/** Coração desenhado à mão (levemente assimétrico). */
export function DoodleHeart(props: DoodleProps) {
  return (
    <Svg {...props}>
      <path d="M12.2 21.3C6.4 17.6 1.8 13.6 2 8.6 2.1 5.4 4.5 3 7.4 3c2 0 3.6 1.1 4.7 2.9C13.2 4.1 14.9 3 16.9 3 19.8 3 22 5.5 22 8.5c0 5.2-4.4 9.1-9.8 12.8Z" />
    </Svg>
  );
}

/** Sol solar de 12 raios (como nos cardápios "Opção Sol"). */
export function SunBurst(props: DoodleProps) {
  const points = Array.from({ length: 24 }, (_, i) => {
    const r = i % 2 === 0 ? 12 : 5.5;
    const a = (Math.PI / 12) * i - Math.PI / 2;
    return `${(12 + r * Math.cos(a)).toFixed(2)},${(12 + r * Math.sin(a)).toFixed(2)}`;
  }).join(' ');
  return (
    <Svg {...props}>
      <polygon points={points} />
    </Svg>
  );
}

/** Folhagem solar — duas folhas cheias num talo curvo. */
export function SunLeaf(props: DoodleProps) {
  return (
    <Svg viewBox="0 0 48 48" {...props}>
      <path d="M8 44C14 30 22 20 40 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 26C10 26 4 20 2 10c10 0 17 6 18 16Z" />
      <path d="M28 18c0-10 6-16 16-18 0 10-6 17-16 18Z" />
    </Svg>
  );
}

/** Pequena constelação (estrelas + pontos) para cantos de cards e títulos. */
export function Twinkles({ className }: { className?: string }) {
  return (
    <span className={cn('pointer-events-none relative inline-block size-10', className)} aria-hidden="true">
      <Sparkle className="absolute left-0 top-0 size-5 text-amandia-pink" />
      <Sparkle className="absolute bottom-0 right-0 size-3.5 text-amandia-orange" />
      <span className="absolute bottom-1 left-2 size-1.5 rounded-full bg-amandia-orange/70" />
    </span>
  );
}

