import Link from 'next/link';
import { Lock } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { buildGoogleMapsDirectionsUrl, buildGoogleReviewUrl, buildPhoneUrl, buildWazeUrl } from '@/lib/links';
import { groupHoursForDisplay, type HoursRow } from '@/lib/hours-format';
import { TrackedLink } from '@/components/ui/TrackedLink';
import { buttonClasses } from '@/components/ui/button-styles';
import { CoffeeBranch } from '@/components/ui/coffee-illustrations';
import { InstagramIcon, StarIcon } from '@/components/ui/icons';

type FooterProps = {
  hours: readonly HoursRow[];
};

/** Epílogo: claro, com a frase-guia fechando a narrativa. */
export function Footer({ hours }: FooterProps) {
  const { address } = siteConfig;
  const groups = groupHoursForDisplay(hours);

  return (
    <footer className="relative overflow-hidden border-t border-linen-300 bg-bg">
      <CoffeeBranch className="pointer-events-none absolute -top-6 right-6 hidden w-20 rotate-[14deg] text-ceramic-brown/25 md:block" />

      <div className="container py-section">
        <h2 className="max-w-3xl text-h2">
          Quando no caminho existe <em>amor</em>, o caminho é bom.
        </h2>
        <span className="rule-gold mt-8 block" aria-hidden="true" />

        <div className="mt-14 grid gap-12 text-sm md:grid-cols-4">
          <div>
            <p className="font-handwriting text-4xl font-bold leading-none text-amandia-green">{siteConfig.shortName}</p>
            <p className="font-display-heavy text-[0.6rem] uppercase tracking-[0.3em] text-amandia-orange-ink">Café Garden</p>
            <p className="mt-4 leading-relaxed">{siteConfig.positioning}</p>
          </div>

          {/* NAP — precisa ser idêntico ao Google Business Profile */}
          <div>
            <h2 className="eyebrow mb-4">Onde estamos</h2>
            <address className="not-italic leading-relaxed">
              {address.streetAddress} · {address.neighborhood}
              <br />
              {address.city} – {address.region}, {address.postalCode}
            </address>
            <TrackedLink
              href={buildPhoneUrl()}
              event="click_phone"
              tracking={{ placement: 'footer' }}
              variant="ghost"
              className="mt-2 font-medium"
            >
              {siteConfig.phone}
            </TrackedLink>
            <div className="mt-3 flex gap-4">
              <TrackedLink
                href={buildGoogleMapsDirectionsUrl()}
                event="click_route"
                tracking={{ placement: 'footer', provider: 'google_maps' }}
                variant="ghost"
              >
                Google Maps
              </TrackedLink>
              <TrackedLink
                href={buildWazeUrl()}
                event="click_route"
                tracking={{ placement: 'footer', provider: 'waze' }}
                variant="ghost"
              >
                Waze
              </TrackedLink>
            </div>
            <a
              href={buildGoogleReviewUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Avaliar o Amandia no Google (abre em nova aba)"
              className={buttonClasses('ghost', 'mt-3 font-medium')}
            >
              <StarIcon width={16} height={16} className="text-amandia-orange" />
              Avalie-nos no Google
            </a>
          </div>

          <div>
            <h2 className="eyebrow mb-4">Horários</h2>
            <ul className="space-y-2 tabular-nums">
              {groups.map((group) => (
                <li key={group.days}>
                  <span className="font-medium text-heading">{group.days}</span>
                  <br />
                  {group.shifts.length > 0 ? group.shifts.join(' e ') : 'Fechado'}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow mb-4">Capítulos</h2>
            <ul className="space-y-2">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-heading hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <TrackedLink
              href={siteConfig.instagramUrl}
              event="click_instagram"
              tracking={{ placement: 'footer' }}
              variant="ghost"
              className="mt-5 font-medium"
            >
              <InstagramIcon width={18} height={18} /> {siteConfig.instagramHandle}
            </TrackedLink>
          </div>
        </div>
      </div>

      <div className="border-t border-linen-300">
        <div className="container flex items-center justify-between gap-4 py-6 text-xs text-muted">
          <p>
            © {new Date().getFullYear()} {siteConfig.name} · {address.city}, {address.region}
          </p>
          {/* Acesso discreto ao painel interno (sem prefetch: a rota é protegida) */}
          <Link
            href="/admin"
            prefetch={false}
            rel="nofollow"
            className="inline-flex items-center gap-1 text-muted/60 transition-colors hover:text-bark-700"
          >
            <Lock className="size-3" aria-hidden="true" />
            Acesso restrito
          </Link>
        </div>
      </div>
    </footer>
  );
}
