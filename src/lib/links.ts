import { siteConfig } from './site-config';

const DEFAULT_WHATSAPP_MESSAGE = 'Olá, Amandia! 🌿';

/** Link wa.me com mensagem pré-preenchida (RF-02). */
export function buildWhatsAppUrl(message: string = DEFAULT_WHATSAPP_MESSAGE): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Rota no Google Maps — abre o app nativo em mobile (RF-03).
 * O destino por nome + endereço faz o Maps abrir a ficha do café
 * (com fotos e avaliações), não apenas um pino.
 */
export function buildGoogleMapsDirectionsUrl(): string {
  const { name, address } = siteConfig;
  const params = new URLSearchParams({
    api: '1',
    destination: `${name}, ${address.streetAddress} - ${address.neighborhood}, ${address.city} - ${address.region}`,
  });
  if (siteConfig.googlePlaceId) params.set('destination_place_id', siteConfig.googlePlaceId);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function buildWazeUrl(): string {
  const { latitude, longitude } = siteConfig.geo;
  return `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
}

export function buildPhoneUrl(): string {
  return `tel:${siteConfig.phoneE164}`;
}
