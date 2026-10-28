import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Chip } from '@/components/ui/Chip';
import { GuidingQuote } from '@/components/ui/GuidingQuote';
import { RatingBadge } from '@/components/ui/RatingBadge';
import { SectionHeading } from '@/components/ui/SectionHeading';
import * as Icons from '@/components/ui/icons';

/**
 * Styleguide interno para revisão do design system (docs/04-design-system.md).
 * Existe só em desenvolvimento: em produção responde 404 e nunca é indexado.
 */
export const metadata: Metadata = {
  title: 'Styleguide',
  robots: { index: false, follow: false },
};

// Classes literais (não interpoladas) para o Tailwind gerar todas.
const PALETTE = [
  {
    name: 'moss',
    swatches: [
      ['50', 'bg-moss-50', '#F2F5F1'],
      ['100', 'bg-moss-100', '#E2EAE2'],
      ['200', 'bg-moss-200', '#C5D4C8'],
      ['300', 'bg-moss-300', '#9FB6A5'],
      ['400', 'bg-moss-400', '#7A9A82'],
      ['500', 'bg-moss-500', '#5A7F63'],
      ['600', 'bg-moss-600', '#476A52'],
      ['700', 'bg-moss-700', '#355541'],
      ['800', 'bg-moss-800', '#2A4433'],
      ['900', 'bg-moss-900', '#1F3728'],
      ['950', 'bg-moss-950', '#14241A'],
    ],
  },
  {
    name: 'linen',
    swatches: [
      ['50', 'bg-linen-50', '#FFFFFF'],
      ['100', 'bg-linen-100', '#FAF8F5'],
      ['200', 'bg-linen-200', '#F4F0E9'],
      ['300', 'bg-linen-300', '#EBE7DF'],
      ['400', 'bg-linen-400', '#DAD3C6'],
    ],
  },
  {
    name: 'bark · clay · sage',
    swatches: [
      ['bark-500', 'bg-bark-500', '#6B746D'],
      ['bark-700', 'bg-bark-700', '#3D4A41'],
      ['bark-900', 'bg-bark-900', '#26302A'],
      ['clay-300', 'bg-clay-300', '#E8C9A6'],
      ['clay-500', 'bg-clay-500', '#C28E58'],
      ['clay-700', 'bg-clay-700', '#8E6033'],
      ['sage-200', 'bg-sage-200', '#E3EBE2'],
      ['sage-400', 'bg-sage-400', '#A9BCA9'],
    ],
  },
] as const;

export default function StyleguidePage() {
  if (process.env.NODE_ENV === 'production') notFound();

  const iconEntries = Object.entries(Icons);

  return (
    <div className="container space-y-20 py-section">
      <SectionHeading eyebrow="Design system" title="Light & Refined" intro="Tokens e componentes base." />

      <section className="space-y-8">
        <h2 className="text-h2">Cores</h2>
        {PALETTE.map((group) => (
          <div key={group.name}>
            <p className="eyebrow mb-3">{group.name}</p>
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-11">
              {group.swatches.map(([label, bg, hex]) => (
                <li key={label} className="text-xs">
                  <span className={`block h-16 rounded-xl ring-1 ring-inset ring-black/5 ${bg}`} />
                  <span className="mt-1 block font-medium text-heading">{label}</span>
                  <span className="text-muted">{hex}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <h2 className="text-h2">Tipografia</h2>
        <p className="text-display font-serif italic text-heading">Display — aconchego</p>
        <p className="font-serif text-h1 text-heading">H1 — Um jardim para desacelerar</p>
        <p className="font-serif text-h2 text-heading">
          H2 — Do forno <em>e da xícara</em>
        </p>
        <p className="font-serif text-h3 text-heading">H3 — Focaccia de alecrim</p>
        <p className="max-w-prose">
          Corpo (Inter 16px) — Mesas entre as plantas, luz natural e o tempo que cada café merece.
        </p>
        <p className="text-sm text-muted">Legenda — preços em tabular-nums: R$ 24,00 · 8h30 – 12h</p>
        <p className="eyebrow">Eyebrow</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-h2">Botões, chips e selos</h2>
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href="#">Primário</ButtonLink>
          <ButtonLink href="#" variant="secondary">
            Secundário
          </ButtonLink>
          <ButtonLink href="#" variant="ghost">
            Ghost <Icons.ArrowRightIcon width={16} height={16} />
          </ButtonLink>
          <span className="rounded-xl bg-moss-900 p-2">
            <ButtonLink href="#" variant="light">
              Claro (sobre musgo)
            </ButtonLink>
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip>Vegano</Chip>
          <Chip tone="linen">Focaccias artesanais</Chip>
          <Chip tone="clay">Esgotado hoje</Chip>
        </div>
        <RatingBadge />
      </section>

      <section className="space-y-6">
        <h2 className="text-h2">Frase-guia</h2>
        <GuidingQuote variant="inline" />
        <div className="rounded-2xl bg-moss-900 p-8">
          <GuidingQuote variant="footer" />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-h2">Ícones</h2>
        <ul className="grid grid-cols-4 gap-4 sm:grid-cols-6 lg:grid-cols-10">
          {iconEntries.map(([name, Icon]) => (
            <li key={name} className="flex flex-col items-center gap-2 rounded-xl bg-surface p-4 text-xs">
              <Icon width={24} height={24} className="text-primary" />
              {name.replace('Icon', '')}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-h2">Superfícies</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-surface p-6 shadow-soft">shadow-soft</div>
          <div className="rounded-2xl bg-surface p-6 shadow-lift">shadow-lift</div>
          <div className="h-40 rounded-arch bg-sage-200" aria-label="rounded-arch" />
        </div>
      </section>
    </div>
  );
}
