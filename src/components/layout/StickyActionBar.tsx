import { buildGoogleMapsDirectionsUrl, buildWhatsAppUrl } from '@/lib/links';
import { TrackedLink } from '@/components/ui/TrackedLink';
import { ChatIcon, MapPinIcon } from '@/components/ui/icons';

/** Barra de conversão fixa — apenas mobile (RF-08). */
export function StickyActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/90 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
      <div className="grid grid-cols-2 gap-3">
        <TrackedLink
          href={buildGoogleMapsDirectionsUrl()}
          event="click_route"
          tracking={{ placement: 'sticky_bar', provider: 'google_maps' }}
        >
          <MapPinIcon /> Como chegar
        </TrackedLink>
        <TrackedLink
          href={buildWhatsAppUrl()}
          event="click_whatsapp"
          tracking={{ placement: 'sticky_bar' }}
          variant="secondary"
        >
          <ChatIcon /> WhatsApp
        </TrackedLink>
      </div>
    </div>
  );
}
