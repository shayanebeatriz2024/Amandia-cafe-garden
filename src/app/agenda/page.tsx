import type { Metadata } from 'next';
import { getUpcomingEvents } from '@/lib/data/events';
import { formatPrice } from '@/lib/data/menu';
import { buildWhatsAppUrl } from '@/lib/links';
import { siteConfig } from '@/lib/site-config';
import { PageHeader } from '@/components/sections/PageHeader';
import { TrackedLink } from '@/components/ui/TrackedLink';

export const metadata: Metadata = {
  title: 'Agenda',
  description:
    'Oficinas, música e encontros especiais no jardim do Amandia Café Garden, em Capão da Canoa (RS).',
  alternates: { canonical: '/agenda' },
};

const dateFormat = new Intl.DateTimeFormat('pt-BR', {
  timeZone: siteConfig.timeZone,
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
});

export default async function AgendaPage() {
  const events = await getUpcomingEvents();

  return (
    <>
      <PageHeader
        eyebrow="Agenda"
        title="Próximos encontros"
        intro="Oficinas, música e datas especiais no garden. As vagas são limitadas, então reserve com antecedência."
      />

      <div className="container pb-section">
        {events.length === 0 ? (
          <p className="text-muted">
            Nenhum encontro marcado por enquanto. Acompanhe o Instagram para ser o primeiro a saber.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {events.map((event) => {
              const when = dateFormat.format(new Date(event.starts_at));
              const href =
                event.booking_url ??
                buildWhatsAppUrl(`Olá! Quero reservar para "${event.title}" (${when}). 🌿`);
              return (
                <li key={event.id} className="grid gap-4 py-8 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="eyebrow">{when}</p>
                    <h2 className="mt-2 text-h3">{event.title}</h2>
                    {event.summary && <p className="mt-2 max-w-prose">{event.summary}</p>}
                    <p className="mt-2 text-sm text-muted">
                      {[event.location_label, formatPrice(event.price_cents)].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <TrackedLink
                    href={href}
                    event="click_booking"
                    tracking={{ placement: 'event_card', item_name: event.title, event_id: event.id }}
                    variant={event.is_sold_out ? 'secondary' : 'primary'}
                  >
                    {event.is_sold_out ? 'Lotado · lista de espera' : 'Reservar'}
                  </TrackedLink>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
