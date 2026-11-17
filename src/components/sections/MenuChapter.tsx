import { getMenuSection } from '@/lib/data/menu';
import { MENU_EXTRAS, MENU_NOTES } from '@/data/menu';
import { illustrations } from '@/lib/images';
import Image from 'next/image';
import { ChapterHeading } from '@/components/ui/ChapterHeading';
import { MenuBook, type MenuPage } from './MenuBook';
import { ITEM_DECOR, PAGE_DECOR } from '@/lib/menu-decor';

// Ordem das páginas do livro = ordem do cardápio impresso 2026 (PDF): bebidas → cafés → salgados → doces.
// Grãos para levar não está no impresso e fica por último.
const PAGE_ORDER = ['bebidas', 'cafes-especiais', 'sanduiches-focaccias', 'doces', 'graos-para-levar'];

/** Cardápio Artesanal & Vitrine — um livro de receitas folheável. */
export async function MenuChapter() {
  const [cardapio, vitrine] = await Promise.all([getMenuSection('cardapio'), getMenuSection('vitrine')]);

  const pages: MenuPage[] = [...cardapio, ...vitrine]
    .filter((category) => category.items.length > 0)
    .sort((a, b) => {
      const ia = PAGE_ORDER.indexOf(a.slug);
      const ib = PAGE_ORDER.indexOf(b.slug);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    })
    .map((category) => {
      return {
        slug: category.slug,
        name: category.name,
        description: category.description,
        extras: MENU_EXTRAS[category.slug] ?? null,
        decor: PAGE_DECOR[category.slug] ?? null,
        items: category.items.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price_cents: item.price_cents,
          price_label: item.price_label,
          is_available: item.is_available,
          note: MENU_NOTES[item.slug] ?? null,
          decor: ITEM_DECOR[item.slug] ?? null,
        })),
      };
    });

  if (pages.length === 0) return null;

  return (
    <section id="cardapio" aria-labelledby="cardapio-titulo" className="relative overflow-hidden py-section">
      {/* Sequência de extração no coado (coador, bule e xícara) na área de respiro (decorativo) */}
      {/* Adesivo da cartela oficial: coador sobre a xícara */}
      <Image
        src={illustrations.adesivoCoadorXicara}
        alt=""
        data-parallax="0.1"
        sizes="192px"
        className="pointer-events-none absolute right-8 top-20 hidden w-36 opacity-60 md:block xl:right-[9%] xl:w-44"
      />
      <div className="container relative">
        <ChapterHeading
          id="cardapio-titulo"
          eyebrow="Cardápio Artesanal & Vitrine"
          icon={illustrations.xicaraAfeto}
          badge={{ label: 'Receita da casa', tone: 'orange' }}
          note="feito aqui"
          title={
            <>
              Do grão <em>à fatia</em>
            </>
          }
          intro="Focaccias feitas aqui, brownies e doces finos, cafés especiais e bebidas para aconchegar. Tudo preparado de forma artesanal e com muita calma."
        />
        <MenuBook pages={pages} />
      </div>
    </section>
  );
}
