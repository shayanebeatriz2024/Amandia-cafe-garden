/**
 * GA4 — eventos de cliques externos (docs/02-trd.md §5).
 * Seguro em SSR e quando o gtag não foi carregado (dev, sem NEXT_PUBLIC_GA_ID, bloqueadores).
 */

export const OUTBOUND_EVENT_NAMES = [
  'click_whatsapp',
  'click_route',
  'click_booking',
  'click_instagram',
  'click_phone',
] as const;

export type OutboundEventName = (typeof OUTBOUND_EVENT_NAMES)[number];

/** Categoria/rótulo legíveis enviados junto de cada evento (facilitam os relatórios do GA4). */
const EVENT_META: Record<OutboundEventName, { event_category: string; event_label: string }> = {
  click_whatsapp: { event_category: 'Contato', event_label: 'Botão WhatsApp' },
  click_booking: { event_category: 'Reserva', event_label: 'Botão Reservar' },
  click_route: { event_category: 'Localização', event_label: 'Botão Como chegar' },
  click_instagram: { event_category: 'Redes sociais', event_label: 'Botão Instagram' },
  click_phone: { event_category: 'Contato', event_label: 'Botão Telefone' },
};

export type Placement =
  | 'header'
  | 'hero'
  | 'sticky_bar'
  | 'menu_item'
  | 'gift_card'
  | 'event_card'
  | 'mesa_posta'
  | 'page_footer'
  | 'footer'
  | 'location'
  | 'mobile_menu'
  | 'careers'
  | 'bazar_signup';

export interface OutboundEventParams {
  placement: Placement;
  item_name?: string;
  event_id?: string;
  provider?: 'google_maps' | 'waze';
  link_url?: string;
}

type Gtag = (command: 'event' | 'config' | 'consent' | 'js', ...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

export function trackEvent(name: OutboundEventName, params: OutboundEventParams): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  let linkDomain: string | undefined;
  if (params.link_url) {
    try {
      linkDomain = new URL(params.link_url).hostname;
    } catch {
      linkDomain = undefined; // tel:, mailto: etc.
    }
  }

  window.gtag('event', name, {
    ...EVENT_META[name],
    ...params,
    link_domain: linkDomain,
    outbound: true,
    transport_type: 'beacon', // garante o envio mesmo ao sair da página
  });
}
