import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import { buildWhatsAppUrl } from '@/lib/links';
import { TrackedLink } from '@/components/ui/TrackedLink';
import logoBranco from '../../../public/images/identidade/logo-amandia-branco.png';
import { WhatsAppIcon } from '@/components/ui/icons';
import { MobileMenu } from './MobileMenu';

/** Logotipo oficial (branco, fundo transparente) sobre o verde sálvia da marca. */
function Logo() {
  return (
    <Image
      src={logoBranco}
      alt={siteConfig.name}
      priority
      sizes="96px"
      className="h-16 w-auto"
    />
  );
}

/**
 * Header no verde sálvia oficial (o mesmo fundo do logotipo), fixo ao rolar. Desktop: navegação em linha.
 * Mobile/tablet: faixa de seções sempre visível + menu completo via <dialog>. Tudo sem JS extra.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-bg">
      <div className="container flex h-header items-center justify-between gap-6">
        <Link href="/" aria-label={`${siteConfig.name} — início`} className="-my-1 shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden xl:block">
          <ul className="flex items-center gap-1 text-sm">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-full px-4 py-2 font-semibold text-heading transition-colors hover:bg-surface hover:text-amandia-butter"
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
            variant="light"
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
