import type { Config } from 'tailwindcss';

/**
 * Design tokens "Light & Refined" — Amandia Café Garden.
 * Estética clara, editorial e solar. Referência: docs/04-design-system.md
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', md: '2rem', lg: '3rem' },
      screens: { '2xl': '80rem' },
    },
    extend: {
      colors: {
        // Verde nobre → oliva (estrutura, títulos, CTAs)
        moss: {
          50: '#F2F5F1',
          100: '#E2EAE2',
          200: '#C5D4C8',
          300: '#9FB6A5',
          400: '#7A9A82',
          500: '#5A7F63',
          600: '#476A52', // oliva — acento / links
          700: '#355541',
          800: '#2A4433',
          900: '#1F3728', // verde escuro nobre — títulos e botão primário
          950: '#14241A',
        },
        // Linho natural — fundos e superfícies
        linen: {
          50: '#FFFFFF', // cards
          100: '#FAF6EE', // fundo global
          200: '#F4F0E9', // capítulos alternados
          300: '#EAE3D2', // bordas delicadas
          400: '#DAD3C6',
        },
        // Texto
        bark: {
          500: '#6B746D', // legendas (AA: 4.6:1)
          700: '#3D4A41', // corpo (8.8:1)
          900: '#26302A',
        },
        // Dourado terracota — ornamentos (300/500) e texto (700)
        clay: {
          300: '#E8C9A6',
          500: '#C28E58', // ornamento apenas (2.7:1)
          700: '#8E6033', // texto dourado (5.1:1)
        },
        sage: {
          200: '#E3EBE2',
          400: '#A9BCA9',
        },
        // Direção de arte "solar & lúdica" — materiais gráficos oficiais da Amandia.
        // orange/pink vivos = pontos de luz (ornamentos, fundos); *-ink = versões para TEXTO (AA).
        amandia: {
          green: '#2F5241', // verde floresta — contraste principal (8.2:1)
          orange: '#F07D2B', // laranja solar — só ornamento (2.6:1)
          'orange-ink': '#A84D0C', // laranja para texto (5.3:1)
          'orange-tint': '#FDE6D3',
          pink: '#F3839F', // rosa — só ornamento (2.3:1)
          'pink-ink': '#B8335A', // rosa para texto (5.4:1)
          'pink-tint': '#FDE2EA',
          butter: '#FFF1B5',
          cream: '#FAF6EE', // fundo solar suave (= vanilla / bg)
          vanilla: '#FAF6EE', // fundo global do site (baunilha clara)
          terracotta: '#C86D3B', // destaque em títulos — só texto grande (3.4:1)
          white: '#FFFFFF',
        },
        // Marrom cerâmica — terracota queimada dos vasos do jardim. Molduras de arcos/círculos.
        'ceramic-brown': '#9E5433',
        'ceramic-border': '#A65E3E',
        // Cores da identidade visual (stories e cardápios do Amandia)
        brand: {
          teal: '#3C6A63',
          orange: '#E0943F',
          blush: '#F6B9B2',
        },
        // Tokens semânticos (ver globals.css)
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        ink: 'rgb(var(--color-text) / <alpha-value>)',
        heading: 'rgb(var(--color-heading) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          hover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
        },
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
      },
      fontFamily: {
        // Lora — títulos e textos refinados
        serif: ['var(--font-serif)', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        // Plus Jakarta Sans — texto corrido e UI
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        // Caveat — lettering expressivo ("Garden Bazar", "dia 26")
        handwriting: ['var(--font-hand)', 'Segoe Print', 'Comic Sans MS', 'cursive'],
        // Plus Jakarta Sans 800 — chamadas de impacto ("MINI FESTIVAL DE FOCACCIA");
        // o peso vem da utility .font-display-heavy em globals.css
        'display-heavy': ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Lora é larga: display mais contido para a frase-guia caber em ~3 linhas
        display: ['clamp(2.5rem, 3.6vw + 1rem, 4.1rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        h1: ['clamp(2.25rem, 4vw + 1rem, 3.75rem)', { lineHeight: '1.08', letterSpacing: '-0.01em' }],
        h2: ['clamp(2rem, 3vw + 1rem, 3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        h3: ['1.625rem', { lineHeight: '1.2' }],
        eyebrow: ['0.72rem', { lineHeight: '1.4', letterSpacing: '0.22em' }],
      },
      spacing: {
        section: 'clamp(5.5rem, 10vw, 9rem)',
        header: '4.5rem',
        // Faixa de seções do header no mobile/tablet (some no xl)
        'header-tabs': '3.5rem',
      },
      borderRadius: {
        leaf: '2.5rem 0.5rem',
        arch: '999px 999px 1.25rem 1.25rem',
        '4xl': '2rem',
      },
      boxShadow: {
        hairline: '0 4px 20px rgba(0, 0, 0, 0.04)',
        soft: '0 4px 20px rgba(0, 0, 0, 0.04)',
        lift: '0 18px 40px -18px rgba(31, 55, 40, 0.22)',
      },
      maxWidth: {
        prose: '62ch',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        // Vapor de café: fio sobe, alarga e some (CSS puro)
        steam: {
          '0%': { opacity: '0', transform: 'translateY(2px) scaleX(1)' },
          '25%': { opacity: '0.75' },
          '100%': { opacity: '0', transform: 'translateY(-14px) scaleX(1.6)' },
        },
      },
      animation: {
        steam: 'steam 2.8s ease-out infinite',
        'fade-up': 'fade-up 600ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
