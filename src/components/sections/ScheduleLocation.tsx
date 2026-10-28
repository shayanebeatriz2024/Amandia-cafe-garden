import { siteConfig } from '@/lib/site-config';
import { groupHoursForDisplay, type HoursRow } from '@/lib/hours-format';
import {
  buildGoogleMapsDirectionsUrl,
  buildPhoneUrl,
  buildWazeUrl,
  buildWhatsAppUrl,
} from '@/lib/links';
import { ChapterHeading } from '@/components/ui/ChapterHeading';
import { CoffeeBranch } from '@/components/ui/coffee-illustrations';
import { HoursBadge } from '@/components/ui/HoursBadge';
import { TrackedLink } from '@/components/ui/TrackedLink';
import {
  ChatIcon,
  ClockIcon,
  InstagramIcon,
  MapPinIcon,
  NavigationIcon,
  PhoneIcon,
} from '@/components/ui/icons';

type ScheduleLocationProps = {
  hours: readonly HoursRow[];
};

/**
 * Capítulo V — Como chegar & Horários.
 * O iframe do Google Maps fica abaixo da dobra com loading="lazy" e altura fixa:
 * não compete com o LCP nem causa layout shift.
 */
export function ScheduleLocation({ hours }: ScheduleLocationProps) {
  const { address } = siteConfig;
  const groups = groupHoursForDisplay(hours);

  return (
    <section id="como-chegar" aria-labelledby="como-chegar-titulo" className="relative overflow-hidden py-section">
      <CoffeeBranch className="pointer-events-none absolute -top-8 left-4 hidden w-16 -rotate-[18deg] text-ceramic-brown/35 md:block xl:left-10" />
      <div className="container relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <ChapterHeading
            id="como-chegar-titulo"
            eyebrow="Como chegar & Horários"
            badge={{ label: 'Vem pro Garden', tone: 'butter' }}
            title={
              <>
                O caminho até o <em>aconchego</em>
              </>
            }
            intro="No bairro Navegantes, pertinho da praia. Venha a pé depois do mar, de carro ou de bicicleta."
          />
          <HoursBadge className="self-start lg:self-end" />
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <div className="card flex flex-col p-7 md:p-10 lg:col-span-5">
            <dl className="space-y-8">
              <div className="flex gap-4">
                <dt className="mt-0.5 text-moss-600">
                  <MapPinIcon />
                  <span className="sr-only">Endereço</span>
                </dt>
                <dd>
                  <address className="not-italic">
                    <span className="font-serif text-xl text-heading">{address.streetAddress}</span>
                    <br />
                    {address.neighborhood} · {address.city} – {address.region}, {address.postalCode}
                  </address>
                  <p className="mt-2 text-sm text-muted">{address.reference}</p>
                  <p className="mt-1 text-sm text-muted">Plus Code: {siteConfig.plusCode}</p>
                </dd>
              </div>

              <div className="flex gap-4">
                <dt className="mt-0.5 text-moss-600">
                  <ClockIcon />
                  <span className="sr-only">Horário de funcionamento</span>
                </dt>
                <dd>
                  <ul className="space-y-1">
                    {groups.map((group) => (
                      <li key={group.days} className="tabular-nums">
                        <span className="font-medium text-heading">{group.days}</span>
                        <span className="block text-sm">
                          {group.shifts.length > 0 ? group.shifts.join(' e ') : 'Fechado'}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-sm text-muted">
                    Em feriados e na temporada o horário pode mudar. Confira no Instagram.
                  </p>
                </dd>
              </div>

              <div className="flex gap-4">
                <dt className="mt-0.5 text-moss-600">
                  <PhoneIcon />
                  <span className="sr-only">Contato</span>
                </dt>
                <dd className="flex flex-wrap gap-x-5 gap-y-1">
                  <TrackedLink
                    href={buildPhoneUrl()}
                    event="click_phone"
                    tracking={{ placement: 'location' }}
                    variant="ghost"
                    className="font-medium"
                  >
                    {siteConfig.phone}
                  </TrackedLink>
                  <TrackedLink
                    href={siteConfig.instagramUrl}
                    event="click_instagram"
                    tracking={{ placement: 'location' }}
                    variant="ghost"
                  >
                    <InstagramIcon width={16} height={16} />
                    {siteConfig.instagramHandle}
                  </TrackedLink>
                </dd>
              </div>
            </dl>

            <div className="mt-auto grid gap-3 pt-10 sm:grid-cols-2">
              <TrackedLink
                href={buildGoogleMapsDirectionsUrl()}
                event="click_route"
                tracking={{ placement: 'location', provider: 'google_maps' }}
                className="sm:col-span-2"
              >
                <MapPinIcon /> Traçar rota no Google Maps
              </TrackedLink>
              <TrackedLink
                href={buildWhatsAppUrl()}
                event="click_whatsapp"
                tracking={{ placement: 'location' }}
                variant="secondary"
              >
                <ChatIcon /> WhatsApp
              </TrackedLink>
              <TrackedLink
                href={buildWazeUrl()}
                event="click_route"
                tracking={{ placement: 'location', provider: 'waze' }}
                variant="secondary"
              >
                <NavigationIcon /> Waze
              </TrackedLink>
            </div>
          </div>

          {/* Moldura branca + fundo linho como placeholder enquanto o mapa carrega */}
          <div className="card p-2 lg:col-span-7">
            <div className="h-full rounded-2xl bg-linen-200">
              <iframe
                src={siteConfig.googleMapsEmbedUrl}
                title={`Mapa: ${siteConfig.name}, ${address.streetAddress} – ${address.neighborhood}, ${address.city}`}
                className="h-[400px] w-full rounded-2xl border-0 shadow-sm md:h-[450px] lg:h-full lg:min-h-[450px]"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
