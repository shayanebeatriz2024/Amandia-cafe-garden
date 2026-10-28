/**
 * Catálogo comercial estático (out/2026) — transcrito dos cardápios/stories oficiais
 * do Amandia (assets/originais/). Espelha o seed de docs/05-backend-schema.sql.
 *
 * Serve de fallback quando o Supabase não está configurado ou a seção está vazia.
 * Assim que o painel do Supabase for preenchido, ele passa a ser a fonte oficial.
 * Itens sem preço (price_cents: null) aparecem sem valor — preço ainda não informado.
 */
import type { MenuSection } from '@/types/database';
import type { MenuCategory, MenuItem } from '@/lib/data/menu';

type CatalogItem = Pick<MenuItem, 'slug' | 'name'> & Partial<MenuItem>;
type CatalogCategory = Omit<MenuCategory, 'id' | 'items'> & {
  section: MenuSection;
  items: CatalogItem[];
};

const item = (data: CatalogItem, sort_order: number): MenuItem => ({
  id: data.slug,
  description: null,
  price_cents: null,
  price_label: null,
  image_path: null,
  image_alt: null,
  dietary_tags: [],
  is_featured: false,
  is_available: true,
  lead_time_hours: null,
  includes: [],
  ...data,
  sort_order,
});

export const MESA_POSTA_SLUG = 'mesa-posta';

/** Regras e itens comuns a todos os pacotes (story "Todas as opções incluem"). */
export const MESA_POSTA_INFO = {
  includedInAll: [
    'Mesa decorada',
    'Nome de cada convidado escrito à mão em uma folha colhida em nosso jardim',
    'Café passado com grãos',
  ],
  rules: [
    'Grupos de no mínimo 10 e no máximo 75 pessoas.',
    'A partir de 40 pessoas, é necessária a locação do Garden com exclusividade (consulte valores).',
    'Para finais de semana e feriados, consulte a disponibilidade.',
    'Preparada de forma exclusiva. Agende com 48 horas de antecedência.',
  ],
  minGuests: 10,
  maxGuests: 75,
  leadTimeHours: 48,
} as const;

const SANDUICHE_FOCACCIA = 'Sanduíches no pão focaccia (requeijão cremoso, salame, tomate e alface)';

const CATALOG: CatalogCategory[] = [
  {
    slug: MESA_POSTA_SLUG,
    name: 'Mesa Posta & Celebrações',
    description: 'Mesas preparadas no Garden para celebrar quem você ama.',
    icon: 'utensils',
    section: 'mesa_posta',
    items: [
      {
        slug: 'mesa-posta-mar',
        name: 'Mar',
        price_cents: 4790,
        price_label: 'por pessoa',
        is_featured: true,
        lead_time_hours: 48,
        includes: [
          'Pães de queijo',
          'Bolo artesanal de cenoura com cobertura de chocolate',
          'Frutas da estação',
        ],
      },
      {
        slug: 'mesa-posta-terra',
        name: 'Terra',
        price_cents: 6290,
        price_label: 'por pessoa',
        is_featured: true,
        lead_time_hours: 48,
        includes: [
          SANDUICHE_FOCACCIA,
          'Pães de queijo',
          'Pizza de sardinha (um clássico da casa)',
          'Bolo artesanal de cenoura com cobertura de chocolate',
          'Brownies artesanais decorados',
          'Frutas da estação',
        ],
      },
      {
        slug: 'mesa-posta-sol',
        name: 'Sol',
        price_cents: 7590,
        price_label: 'por pessoa',
        is_featured: true,
        lead_time_hours: 48,
        includes: [
          SANDUICHE_FOCACCIA,
          'Pães de queijo',
          'Croissants caprese (tomate cereja, mussarela de búfala maçaricada, rúcula e pesto)',
          'Bolo artesanal de cenoura com cobertura de chocolate',
          'Brownies artesanais decorados',
          'Mini banoffees',
          'Frutas da estação',
        ],
      },
      {
        slug: 'mesa-posta-lua',
        name: 'Lua',
        price_cents: 11990,
        price_label: 'por pessoa',
        is_featured: true,
        lead_time_hours: 48,
        includes: [
          'Estilo tábua de frios',
          'Queijos especiais',
          'Seleção de frios nobres',
          'Frutas da estação',
          'Mix de grãos',
          SANDUICHE_FOCACCIA,
          'Pastas artesanais',
          'Geleia de abacaxi com pimenta',
          'Brownies artesanais decorados',
          'Mini banoffees',
        ],
      },
    ],
  },
  // ---- Cardápio impresso 2026 (cardápioatualizado 2026.pdf) ----
  {
    slug: 'sanduiches-focaccias',
    name: 'Salgados',
    description: 'A produção é nossa: focaccia feita aqui.',
    icon: 'wheat',
    section: 'cardapio',
    items: [
      {
        slug: 'italianinho',
        name: 'Italianinho',
        description: 'Pão focaccia, requeijão, duplo queijo maçaricado e salame.',
        price_cents: 2190,
      },
      {
        slug: 'italianissimo',
        name: 'Italianíssimo',
        description: 'Pão focaccia, requeijão, duplo queijo maçaricado, salame, salada de alface e tomate.',
        price_cents: 2690,
      },
      {
        slug: 'caprese',
        name: 'Caprese',
        description: 'Pão focaccia, requeijão, tomate, manjericão e queijo de búfala.',
        price_cents: 2990,
        dietary_tags: ['vegetariano'],
      },
      {
        slug: 'pampas',
        name: 'Pampas',
        description:
          'Pão focaccia, carne de panela, queijo maçaricado, tomate, alface e requeijão. Acompanha geleia de abacaxi com pimenta.',
        price_cents: 3290,
      },
      {
        slug: 'pizza-de-sardinha',
        name: 'Pizza de sardinha artesanal da Vó Amandia',
        description: 'Sabor de infância que é tradição por aqui.',
        price_cents: 1290,
      },
      { slug: 'pao-de-queijo', name: 'Pão de queijo', description: 'Porção com 5 mini.', price_cents: 1290 },
      { slug: 'mini-croissant', name: 'Mini croissant sem recheio', price_cents: 700 },
      {
        slug: 'ovos-mexidos',
        name: 'Ovos mexidos',
        description: '3 ovos, uma pitada de sal e carinho.',
        price_cents: 1600,
      },
      {
        slug: 'pao-na-chapa',
        name: 'Pão na chapa',
        description: 'Com pão focaccia, acompanha mel ou requeijão.',
        price_cents: 1290,
      },
      {
        slug: 'farroupilha',
        name: 'Farroupilha com pão focaccia',
        description: 'Pão prensado com duplo queijo e presunto.',
        price_cents: 1490,
      },
      {
        slug: 'torrada-colonial',
        name: 'Torrada colonial',
        description: 'Pão focaccia com salame e duplo queijo.',
        price_cents: 2090,
      },
    ],
  },
  {
    slug: 'cafes-especiais',
    name: 'Cafés',
    description: '“simples_mente” um convite para desacelerar.',
    icon: 'coffee',
    section: 'cardapio',
    items: [
      { slug: 'cafe-passado-calma', name: 'Café passado com cALMA', price_cents: 1290 },
      { slug: 'golden-cafe', name: 'Golden', description: 'Café passado com especiarias.', price_cents: 1400 },
      {
        slug: 'prensa-francesa',
        name: 'Prensa Francesa 350 ml',
        description: 'Ideal para compartilhar.',
        price_cents: 2600,
      },
      { slug: 'cafe-com-leite', name: 'Café com leite', description: 'Simples e essencial.', price_cents: 1290 },
      { slug: 'capuccino-canela', name: 'Capuccino com canela “Confort Coffee”', price_cents: 1290 },
      { slug: 'capuccino-tradicional', name: 'Capuccino tradicional “Confort Coffee”', price_cents: 1290 },
      { slug: 'capuccino-italiano', name: 'Capuccino Italiano', price_cents: 1290 },
      {
        slug: 'mocamandia',
        name: 'Mocamandia',
        description: 'Camada de chocolate ou caramelo salgado, café espresso e leite vaporizado.',
        price_cents: 1890,
      },
      { slug: 'cafes-gelados', name: 'Cafés gelados', description: 'Consulte sabor.', price_cents: 1990 },
      { slug: 'chocolate-quente', name: 'Chocolate quente', description: 'Sabor de infância.', price_cents: 1990 },
      { slug: 'espressinho', name: 'Espressinho ou carioquinha', price_cents: 890 },
      { slug: 'pingadinho', name: 'Pingadinho', price_cents: 990 },
      { slug: 'duplo-espresso', name: 'Duplo espresso ou carioca', price_cents: 1000 },
      { slug: 'cha', name: 'Chá', description: 'Consulte sabor.', price_cents: 600 },
    ],
  },
  {
    slug: 'bebidas',
    name: 'Bebidas',
    description: 'Para brindar sem pressa.',
    icon: 'coffee',
    section: 'cardapio',
    items: [
      { slug: 'agua-mineral', name: 'Água mineral', description: 'Com gás ou sem gás.', price_cents: 600 },
      {
        slug: 'suco-natural',
        name: 'Suco natural',
        description: 'Laranja ou abacaxi com hortelã.',
        price_cents: 1600,
      },
      { slug: 'soda-italiana', name: 'Soda italiana', description: 'Maçã verde ou morango.', price_cents: 1600 },
      {
        slug: 'caipirinha-vodka',
        name: 'Caipirinha Amandia · vodka',
        description: 'Limão, abacaxi ou morango.',
        price_cents: 2600,
      },
      {
        slug: 'caipirinha-velho-barreiro',
        name: 'Caipirinha Amandia · Velho Barreiro',
        description: 'Limão, abacaxi ou morango.',
        price_cents: 2200,
      },
      {
        slug: 'mojito-coffee',
        name: 'Mojito Coffee',
        description: 'Espresso, uma dose de rum, limão, açúcar, água com gás e hortelã frescas.',
        price_cents: 2700,
      },
      { slug: 'carajillo', name: 'Carajillo', description: 'Espresso + licor 43.', price_cents: 2990 },
      { slug: 'espumante-moscatel', name: 'Garrafa de espumante · Moscatel', price_cents: 7800 },
      { slug: 'espumante-brut', name: 'Garrafa de espumante · Brut', price_cents: 9800 },
      { slug: 'longneck-corona', name: 'Longneck Corona', price_cents: 1500 },
      { slug: 'longneck-heineken', name: 'Longneck Heineken', price_cents: 1500 },
    ],
  },
  {
    slug: 'doces',
    name: 'Doces',
    description: 'Pra ser feliz.',
    icon: 'cake',
    section: 'vitrine',
    items: [
      {
        slug: 'bolos-amandia',
        name: 'Bolos Amandia',
        description:
          'Uma porção de carinho e nostalgia em cada pedaço, feita com amor e ingredientes selecionados para aquecer a cALMA e seu coração. Consulte os sabores do dia.',
        price_cents: 1290,
      },
      {
        slug: 'brownie-ao-leite',
        name: 'Brownie artesanal · ao leite',
        description: 'Especialidade da casa!',
        price_cents: 1600,
      },
      {
        slug: 'brownie-meio-amargo',
        name: 'Brownie artesanal · meio amargo',
        description: 'Especialidade da casa!',
        price_cents: 1790,
      },
      {
        slug: 'sobremesa-garden',
        name: 'Sobremesa Garden',
        description:
          'Caramelo salgado, mousse capuccino, terra comestível de brownie meio amargo e um ramo de hortelã, servida em um delicado vaso de cerâmica.',
        price_cents: 2000,
      },
      { slug: 'quindim', name: 'Quindim', description: 'O melhor do litoral.', price_cents: 1000 },
      { slug: 'brigadeiro', name: 'Brigadeiro artesanal', price_cents: 800 },
      {
        slug: 'taca-iemanja',
        name: 'Taça Iemanjá',
        description: 'Sorvete de creme e cocada cremosa com doce de leite.',
        price_cents: 2000,
      },
      {
        slug: 'torta-amandia',
        name: 'Torta Amandia',
        description: 'Camada de brownie meio amargo, brigadeiro de café, nozes tostadas e mousse capuccino.',
        price_cents: 2200,
        dietary_tags: ['contem_nozes'],
      },
      {
        slug: 'torta-banoffe',
        name: 'Torta Banoffe',
        description:
          'Base amanteigada de biscoito crocante, camada de doce de leite, banana, nata batida e canela polvilhada.',
        price_cents: 2000,
      },
      {
        slug: 'mil-folhas',
        name: 'Mil folhas',
        description: 'Massa folhada crocante, recheada com doce de leite, creme ou os dois (Duo).',
        price_cents: 1600,
      },
    ],
  },
  {
    slug: 'graos-para-levar',
    name: 'Grãos para levar',
    description: 'Cafés especiais da Guria Coffee Roasters, à venda no balcão.',
    icon: 'coffee',
    section: 'vitrine',
    items: [
      // Fichas transcritas das embalagens (foto do balcão, out/2026)
      {
        slug: 'guria-classico-g1',
        name: 'Guria Clássico G1 (250 g)',
        description: 'Torra clara, notas de caramelo. Catuaí Vermelho do produtor Augusto Borges.',
        price_cents: 5250,
        price_label: 'pacote',
      },
      {
        slug: 'guria-classico-g2',
        name: 'Guria Clássico G2 (250 g)',
        description:
          'Torra média, notas de chocolate. Catuaí Vermelho, processo natural, da Mantiqueira de Minas. Produtor Augusto Borges.',
        price_cents: 5250,
        price_label: 'pacote',
      },
    ],
  },
  {
    slug: 'cestas-boxs',
    name: 'Cestas & Boxs',
    description:
      'Cada cesta e box Amandia é preparada de forma artesanal, com ingredientes frescos e muita calma.',
    icon: 'gift',
    section: 'presentes',
    items: [],
  },
];

/** Categorias estáticas de uma seção, no mesmo formato da camada de dados. */
export function getStaticSection(section: MenuSection): MenuCategory[] {
  return CATALOG.filter((c) => c.section === section).map(({ section: _section, items, ...c }) => ({
    ...c,
    id: c.slug,
    items: items.map((data, i) => item(data, (i + 1) * 10)),
  }));
}

/** Adicionais impressos ao pé de cada página do cardápio, por categoria. */
export const MENU_EXTRAS: Record<string, { title: string; items: Array<{ name: string; price_cents: number }> }> = {
  'cafes-especiais': {
    title: 'Adicionais',
    items: [
      { name: 'Leite', price_cents: 150 },
      { name: 'Leite zero lactose', price_cents: 200 },
      { name: 'Café descafeinado', price_cents: 200 },
      { name: 'Bola de sorvete', price_cents: 890 },
    ],
  },
  'sanduiches-focaccias': {
    title: 'Para personalizar a sua experiência',
    items: [
      { name: 'Salada', price_cents: 350 },
      { name: 'Bacon', price_cents: 400 },
      { name: 'Ovos', price_cents: 350 },
      { name: 'Salame', price_cents: 400 },
      { name: 'Queijo ou presunto', price_cents: 300 },
      { name: 'Manteiga', price_cents: 200 },
      { name: 'Requeijão', price_cents: 300 },
      { name: 'Mel', price_cents: 300 },
      { name: 'Doce de leite', price_cents: 350 },
      { name: 'Ganache', price_cents: 350 },
    ],
  },
  doces: {
    title: 'Adicionais para o brownie',
    items: [
      { name: 'Sorvete', price_cents: 890 },
      { name: 'Ferrero Rocher', price_cents: 1000 },
    ],
  },
};

/** Anotações à mão do cardápio impresso ("o mais pedido", "um clássico da casa"…), por slug do item. */
export const MENU_NOTES: Record<string, string> = {
  'capuccino-canela': 'o mais pedido',
  'caipirinha-vodka': 'um clássico da casa',
  'pizza-de-sardinha': 'um clássico da casa',
  caprese: 'opção vegetariana',
  'bolos-amandia': 'nossa história começou com esses bolos',
  'torta-amandia': 'nossa torta autoral',
};
