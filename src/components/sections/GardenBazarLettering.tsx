import type { SVGProps } from 'react';
import { cn } from '@/lib/cn';

/**
 * Lettering oficial "GARDEN BAZAR" (traço à mão do flyer): B alto, sublinhado
 * saindo da base do Z e coração no final. Decorativo — o texto acessível fica no h2.
 * A cor vem de `className` via currentColor.
 */
export function GardenBazarLettering({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 190"
      fill="none"
      stroke="currentColor"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn('pointer-events-none', className)}
      {...props}
    >
      {/* GARDEN */}
      <path d="M90 31C84 22 74 20 68 26 60 34 60 66 68 76 76 84 88 80 92 70V56H80" />
      <path d="M100 80 114 22l16 58M106 58l19-2" />
      <path d="M140 80V24c16-4 26 6 22 18-4 10-14 12-21 10l23 28" />
      <path d="M174 80V24c24-2 32 20 26 38-4 14-16 19-26 18Z" />
      <path d="M232 24h-22v56h24M210 52h18" />
      <path d="M242 82V24l26 54V18" />
      {/* BAZAR */}
      <path d="M24 170V90c34-6 42 26 4 37 44-3 48 41-4 43" />
      <path d="m74 170 15-55 15 55M79 152l21-2" />
      <path d="m112 116 28-1-26 57c46 4 116 10 170 0 10-2 16-8 20-18" />
      <path d="m148 164 13-46 13 46M152 148l19-2" />
      <path d="M184 164v-46c18-4 28 8 22 18-4 8-14 10-21 8l27 20" />
      <path
        d="M246 152c-14-10-22-20-20-28 2-8 12-8 18 0 4-10 16-10 18 0 2 10-6 20-16 28Z"
        fill="currentColor"
        strokeWidth={3}
      />
    </svg>
  );
}

/** Estrela de 8 pontas (raios principais longos, diagonais curtas), como nos posts do Bazar. */
export function EightPointStar({ className, ...props }: SVGProps<SVGSVGElement>) {
  const points = Array.from({ length: 16 }, (_, i) => {
    const r = i % 2 === 1 ? 2 : i % 4 === 0 ? 12 : 8;
    const a = (Math.PI / 8) * i - Math.PI / 2;
    return `${(12 + r * Math.cos(a)).toFixed(2)},${(12 + r * Math.sin(a)).toFixed(2)}`;
  }).join(' ');
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn('pointer-events-none shrink-0', className)}
      {...props}
    >
      <polygon points={points} />
    </svg>
  );
}
