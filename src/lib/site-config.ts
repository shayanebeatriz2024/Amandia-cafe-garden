/**
 * Fonte única de verdade para NAP (Name, Address, Phone) e dados de marca.
 * Precisa bater exatamente com o Google Business Profile e o Instagram.
 */
export const siteConfig = {
  name: 'Amandia Café Garden',
  shortName: 'Amandia',
  /** Palavra-chave de acolhimento da marca. */
  tagline: 'Aconchego',
  /** Frase de posicionamento usada no Hero e nas redes. */
  positioning: 'Cafés, Focaccias, Brownies e Garden! Lugar de gente boa. Somos pet friendly.',
  guidingPhrase: 'Quando no caminho existe amor, o caminho é bom.',
  description:
    'Café-jardim em Capão da Canoa, RS: focaccias artesanais, croissant, Torta Amandia, cafés especiais e brunch num garden ao ar livre. Mesa posta, cestas e boxes, mini weddings e celebrações. Pet friendly e acolhedor LGBTQ+.',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  locale: 'pt_BR',
  timeZone: 'America/Sao_Paulo',

  address: {
    streetAddress: 'R. Sepé, 2963',
    neighborhood: 'Navegantes',
    city: 'Capão da Canoa',
    region: 'RS',
    postalCode: '95555-000',
    country: 'BR',
    reference: 'Próximo à esquina com a R. Ubirajara e à Praia de Navegantes',
  },
  geo: { latitude: -29.7681563, longitude: -50.0199218 },
  plusCode: '6XJJ+P2 Capão da Canoa, RS',

  /** Ficha do Google Maps (CID extraído do embed oficial). */
  googleMapsUrl: 'https://maps.google.com/?cid=7760593784597518645',
  googleMapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3463.327984189904!2d-50.019921800000006!3d-29.768156299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x951879fe4b54bca1%3A0x6bb32aee010a1935!2sAmandia%20Caf%C3%A9%20Garden!5e0!3m2!1spt-BR!2sbr!4v1710000000000!5m2!1spt-BR!2sbr',
  // Place ID (formato "ChIJ…") ainda não informado — opcional, melhora o link de rota.
  googlePlaceId: '',

  /**
   * Prova social exibida na UI. NÃO entra no JSON-LD: o Google não aceita
   * avaliações "self-serving" de LocalBusiness em dados estruturados.
   * Atualizar periodicamente.
   */
  googleRating: { value: 4.7, count: 261, checkedAt: '2026-10' },

  phone: '(51) 99984-7175',
  phoneE164: '+5551999847175',
  whatsappNumber: '5551999847175',
  instagramHandle: '@amandiacafegarden',
  instagramUrl: 'https://www.instagram.com/amandiacafegarden/',

  priceRange: 'R$ 20–40',
  // Sem "padaria": o perfil no Google é de cafeteria (Amandia Café Garden).
  servesCuisine: ['Café especial', 'Focaccia', 'Brunch', 'Confeitaria'],
  acceptsReservations: true,

  highlights: [
    'Focaccias artesanais',
    'Croissant',
    'Torta Amandia',
    'Cafés especiais',
    'Brunch',
    'Doces finos',
    'Cestas & Boxs',
    'Mesa Posta',
  ],

  /** Atributos destacados pela imprensa — também viram amenityFeature no Schema.org. */
  amenities: [
    {
      key: 'celebrations',
      label: 'Lugar para celebrar',
      description: 'Mini weddings, aniversários e encontros com quem você ama.',
    },
    {
      key: 'garden',
      label: 'Garden ao ar livre',
      description: 'Mesas entre as plantas, com luz natural e sombra fresca.',
    },
    {
      key: 'pet',
      label: 'Pet friendly',
      description: 'Seu pet é bem-vindo para dividir o passeio com você.',
    },
    {
      key: 'lgbtq',
      label: 'Acolhedor LGBTQ+',
      description: 'Um espaço seguro e afetuoso, para todas as pessoas.',
    },
  ],

  /**
   * Horário oficial — dois turnos: até 12h e das 14h30 às 19h30.
   * Usado quando o Supabase não está configurado/vazio (a tabela opening_hours é a fonte oficial).
   * Fonte: post oficial do Instagram (30/09/2026) — "9h às 12h · 14h30 às 19h30".
   * ISO weekday: 1 = segunda … 7 = domingo. Dias de funcionamento: confirmar (o post não lista).
   */
  /** Resumo do horário oficial exibido em badges. */
  hoursSummary: 'Aberto das 9:00 às 12:00 · reabre 14:30 às 19:30',

  defaultHours: [1, 2, 3, 4, 5, 6, 7].flatMap((weekday) => [
    { weekday, opens_at: '09:00:00', closes_at: '12:00:00', valid_from: null, valid_until: null },
    { weekday, opens_at: '14:30:00', closes_at: '19:30:00', valid_from: null, valid_until: null },
  ]),

  nav: [
    { href: '/#cardapio', label: 'Cardápio' },
    { href: '/#cestas', label: 'Cestas & Boxs' },
    { href: '/#mesa-posta', label: 'Mesa Posta' },
    { href: '/#garden', label: 'Garden Bazar' },
    { href: '/#como-chegar', label: 'Como chegar' },
    { href: '/#trabalhe-conosco', label: 'Faça parte da nossa equipe' },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
export type AmenityKey = (typeof siteConfig.amenities)[number]['key'];
