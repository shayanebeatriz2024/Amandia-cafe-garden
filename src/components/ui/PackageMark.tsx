import type { SVGProps } from 'react';

/**
 * Marcas gráficas dos pacotes Mesa Posta — reproduzem a linguagem dos
 * cardápios oficiais: Mar (ondas, verde), Terra (círculo, laranja),
 * Sol (estrela de 12 pontas, laranja) e Lua (estrela de 4 pontas, verde).
 */
type MarkProps = SVGProps<SVGSVGElement> & { variant: string };

const TEAL = '#3C6A63';
const ORANGE = '#E0943F';

export function PackageMark({ variant, ...props }: MarkProps) {
  const common = {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 64 64',
    width: 56,
    height: 56,
    'aria-hidden': true,
    focusable: false,
    ...props,
  } as const;

  switch (variant) {
    case 'mar':
      return (
        <svg {...common}>
          <path
            fill={TEAL}
            d="M4 36c8-10 18-12 28-6s18 6 26-6c-2 12-12 20-24 16-8-3-12-6-18-4-5 1-9 4-12 8 0-3 0-6 0-8Z"
          />
          <path fill={TEAL} d="M14 46c6-6 12-6 18-2-6-1-11 1-16 6Z" opacity="0.85" />
          <path fill={TEAL} d="M40 26c6 1 11-2 14-8-1 6-6 11-14 8Z" opacity="0.85" />
        </svg>
      );
    case 'terra':
      return (
        <svg {...common}>
          <path fill={ORANGE} d="M32 6c15 0 26 10 26 25 0 16-11 27-27 27C16 58 6 47 6 32 6 17 17 6 32 6Z" />
        </svg>
      );
    case 'sol': {
      const points = Array.from({ length: 24 }, (_, i) => {
        const r = i % 2 === 0 ? 30 : 13;
        const a = (Math.PI / 12) * i - Math.PI / 2;
        return `${(32 + r * Math.cos(a)).toFixed(2)},${(32 + r * Math.sin(a)).toFixed(2)}`;
      }).join(' ');
      return (
        <svg {...common}>
          <polygon fill={ORANGE} points={points} />
        </svg>
      );
    }
    case 'lua':
      return (
        <svg {...common}>
          <path fill={TEAL} d="M32 2C34 22 42 30 62 32 42 34 34 42 32 62 30 42 22 34 2 32 22 30 30 22 32 2Z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="24" fill={TEAL} />
        </svg>
      );
  }
}
