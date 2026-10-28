import { getMenuSection } from '@/lib/data/menu';
import { MENU_EXTRAS, MENU_NOTES } from '@/data/menu';
import { illustrations, photos, type Photo } from '@/lib/images';
import { PourOverDoodle } from '@/components/ui/coffee-illustrations';
import { ChapterHeading } from '@/components/ui/ChapterHeading';
import { MenuBook, type MenuPage } from './MenuBook';

// Foto "colada" em cada página, por slug de categoria (as do Supabase podem ganhar image_path na Fase 4).
const PAGE_PHOTOS: Record<string, Photo> = {
  'sanduiches-focaccias': photos.focacciaECafe,
  'cafes-especiais': photos.mesaDecorada,
  bebidas: photos.bebidas,
  doces: photos.mesaDeDoces,
  'graos-para-levar': photos.guriaCafesEspeciais,
};

// Ordem das páginas do caderno: da xícara → forno → doces → bebidas → grãos para levar.
const PAGE_ORDER = ['cafes-especiais', 'sanduiches-focaccias', 'doces', 'bebidas', 'graos-para-levar'];

/** Cardápio Artesanal & Vitrine — um caderno de receitas folheável. */
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
      const photo = PAGE_PHOTOS[category.slug];
      return {
        slug: category.slug,
        name: category.name,
        description: category.description,
        photo: photo ? { src: photo.src, alt: photo.alt } : null,
        extras: MENU_EXTRAS[category.slug] ?? null,
        items: category.items.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price_cents: item.price_cents,
          price_label: item.price_label,
          is_available: item.is_available,
          note: MENU_NOTES[item.slug] ?? null,
        })),
      };
    });

  if (pages.length === 0) return null;

  return (
    <section id="cardapio" aria-labelledby="cardapio-titulo" className="relative overflow-hidden py-section">
      {/* Sequência de extração no coado (coador, bule e xícara) na área de respiro (decorativo) */}
      <PourOverDoodle className="pointer-events-none absolute right-8 top-20 hidden w-40 text-ceramic-brown/40 md:block xl:right-[9%] xl:w-48" />
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
