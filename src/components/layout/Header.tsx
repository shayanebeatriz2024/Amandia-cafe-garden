import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import { buildWhatsAppUrl } from '@/lib/links';
import { TrackedLink } from '@/components/ui/TrackedLink';
import { DoodleHeart, Sparkle } from '@/components/ui/doodles';
import { WhatsAppIcon } from '@/components/ui/icons';
import { MobileMenu } from './MobileMenu';

/** Logotipo tipográfico: "Amandia" em lettering (Caveat) + "Café Garden" em caixa-alta de impacto. */
function Wordmark() {
  return (
    <span className="flex flex-col leading-none">
      <span className="relative font-handwriting text-[2.1rem] font-bold text-amandia-green">
        {siteConfig.shortName}
        {/* Pontos de luz da identidade (decorativos) */}
        <DoodleHeart className="absolute -right-3.5 top-1 size-3 text-amandia-pink" />
        <Sparkle className="absolute -right-6 -top-0.5 size-2.5 text-amandia-orange" />
      </span>
      <span className="-mt-1 font-display-heavy text-[0.58rem] uppercase tracking-[0.3em] text-amandia-orange-ink">
        Café Garden
      </span>
    </span>
  );
}

/**
 * Header claro e translúcido, fixo ao rolar. Desktop: navegação em linha.
 * Mobile/tablet: faixa de seções sempre visível + menu completo via <dialog>. Tudo sem JS extra.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-linen-300/70 bg-bg/80 backdrop-blur-md supports-[backdrop-filter]:bg-bg/65">
      <div className="container flex h-header items-center justify-between gap-6">
        <Link href="/" aria-label={`${siteConfig.name} — início`} className="shrink-0">
          <Wordmark />
        </Link>

        <nav aria-label="Principal" className="hidden xl:block">
          <ul className="flex items-center gap-1 text-sm">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-full px-4 py-2 font-semibold text-heading transition-colors hover:bg-surface hover:text-amandia-orange-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Contato direto: ícone fixo do WhatsApp no lugar do antigo "Reservar" */}
          <TrackedLink
            href={buildWhatsAppUrl()}
            event="click_whatsapp"
            tracking={{ placement: 'header' }}
            aria-label="Falar com o Amandia no WhatsApp"
            title="WhatsApp"
            className="size-12 !px-0"
          >
            <WhatsAppIcon width={24} height={24} />
          </TrackedLink>
          <MobileMenu />
        </div>
      </div>

      {/* Mobile/tablet: seções sempre visíveis numa faixa de links diretos (rola na horizontal) */}
      <nav aria-label="Seções" className="xl:hidden">
        <ul className="section-tabs container">
          {siteConfig.nav.map((item) => (
            <li key={item.href} className="shrink-0 whitespace-nowrap">
              <Link href={item.href} className="section-tab">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
