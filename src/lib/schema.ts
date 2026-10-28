import { siteConfig } from './site-config';
import type { OpeningHours } from './data/hours';

const DAY_OF_WEEK: Record<number, string> = {
  1: 'https://schema.org/Monday',
  2: 'https://schema.org/Tuesday',
  3: 'https://schema.org/Wednesday',
  4: 'https://schema.org/Thursday',
  5: 'https://schema.org/Friday',
  6: 'https://schema.org/Saturday',
  7: 'https://schema.org/Sunday',
};

/** "08:30:00" → "08:30" */
const hhmm = (time: string) => time.slice(0, 5);

/**
 * Agrupa dias com o mesmo intervalo num único OpeningHoursSpecification.
 * Dois turnos (manhã e tarde) viram dois blocos, cada um com os 7 dias.
 */
function buildOpeningHoursSpecification(hours: OpeningHours[]) {
  const groups = new Map<string, { days: string[]; row: OpeningHours }>();
  for (const row of hours) {
    const day = DAY_OF_WEEK[row.weekday];
    if (!day) continue;
    const key = [row.opens_at, row.closes_at, row.valid_from, row.valid_until].join('|');
    const group = groups.get(key) ?? { days: [], row };
    group.days.push(day);
    groups.set(key, group);
  }

  return [...groups.values()].map(({ days, row }) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: days,
    opens: hhmm(row.opens_at),
    closes: hhmm(row.closes_at),
    ...(row.valid_from && { validFrom: row.valid_from }),
    ...(row.valid_until && { validThrough: row.valid_until }),
  }));
}

/** Atributos do espaço como LocationFeatureSpecification (pet friendly, garden etc.). */
const AMENITY_SCHEMA_NAMES: Record<string, string> = {
  celebrations: 'Espaço para eventos e celebrações (mini weddings, aniversários)',
  garden: 'Garden ao ar livre',
  pet: 'Pet friendly',
  lgbtq: 'Acolhedor LGBTQ+',
};

/**
 * JSON-LD CafeOrCoffeeShop (subtipo de FoodEstablishment → LocalBusiness).
 * Validar em https://search.google.com/test/rich-results
 *
 * aggregateRating é omitido de propósito: avaliações do próprio negócio
 * ("self-serving") não são elegíveis para LocalBusiness no Google.
 */
export function buildLocalBusinessJsonLd(hours: OpeningHours[]) {
  const { url, address, geo } = siteConfig;
  const openingHoursSpecification = buildOpeningHoursSpecification(hours);

  return {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    '@id': `${url}/#cafe`,
    name: siteConfig.name,
    alternateName: 'Amandia Café',
    slogan: siteConfig.guidingPhrase,
    description: siteConfig.description,
    url,
    image: [`${url}/images/og-default.jpg`],
    logo: `${url}/icon.svg`,
    telephone: siteConfig.phoneE164,
    priceRange: siteConfig.priceRange,
    currenciesAccepted: 'BRL',
    servesCuisine: siteConfig.servesCuisine,
    acceptsReservations: siteConfig.acceptsReservations,
    hasMenu: `${url}/cardapio`,
    hasMap: siteConfig.googleMapsUrl,
    keywords: siteConfig.highlights.join(', '),
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${address.streetAddress} - ${address.neighborhood}`,
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    amenityFeature: siteConfig.amenities.map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: AMENITY_SCHEMA_NAMES[amenity.key] ?? amenity.label,
      value: true,
    })),
    petsAllowed: true,
    areaServed: ['Capão da Canoa', 'Xangri-lá', 'Atlântida', 'Arroio do Sal', 'Litoral Norte Gaúcho'],
    sameAs: [siteConfig.instagramUrl, siteConfig.googleMapsUrl],
    ...(openingHoursSpecification.length > 0 && { openingHoursSpecification }),
  };
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: 'pt-BR',
    publisher: { '@id': `${siteConfig.url}/#cafe` },
  };
}
