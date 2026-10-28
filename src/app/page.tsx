import type { Metadata } from 'next';
import { getBusinessHours } from '@/lib/data/hours';
import { ScrollEffects } from '@/components/motion/ScrollEffects';
import { Hero } from '@/components/sections/Hero';
import { GardenChapter } from '@/components/sections/GardenChapter';
import { MomentsGallery } from '@/components/sections/MomentsGallery';
import { MesaPosta } from '@/components/sections/MesaPosta';
import { MenuChapter } from '@/components/sections/MenuChapter';
import { ProductionChapter } from '@/components/sections/ProductionChapter';
import { CestasBoxs } from '@/components/sections/CestasBoxs';
import { CoffeeBranch } from '@/components/ui/coffee-illustrations';
import { SectionSeam } from '@/components/ui/SectionSeam';
import { ScheduleLocation } from '@/components/sections/ScheduleLocation';
import { WorkWithUs } from '@/components/sections/WorkWithUs';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

/**
 * A Home é uma narrativa em capítulos (docs/03-app-flow.md §3):
 * Prólogo → Cardápio & Vitrine → Produção artesanal → Cestas & Boxs → Mesa Posta
 * → Garden Café Bazar → Galeria → Como chegar → Trabalhe Conosco.
 *
 * Efeito cortina: o Hero (vídeo em tela cheia) é sticky em z-0; as seções seguintes ficam
 * num container z-20 com fundo baunilha, topo arredondado com filete marrom cerâmica e sombra
 * em tom terracota, e sobem por cima dele.
 */
export default async function HomePage() {
  const hours = await getBusinessHours();

  return (
    <>
      <ScrollEffects />
      <Hero />
      <div className="relative z-20 rounded-t-[2.5rem] border-t-2 border-ceramic-brown/40 bg-bg shadow-[0_-12px_40px_rgba(158,84,51,0.18)]">
        <MenuChapter />
        <ProductionChapter />
        <SectionSeam position="left" />
        <CestasBoxs />
        <SectionSeam position="right" />
        <MesaPosta />
        <SectionSeam />
        <GardenChapter />
        <MomentsGallery />
        <SectionSeam position="left" />
        <ScheduleLocation hours={hours.regular} />
        <SectionSeam position="right" />
        <WorkWithUs />

        {/* Ramos de café nas laterais da página — só em telas largas, nas margens (decorativos) */}
        <CoffeeBranch className="pointer-events-none absolute left-1 top-[14%] hidden w-12 text-ceramic-brown/25 xl:block 2xl:left-8 2xl:w-16" />
        <CoffeeBranch className="pointer-events-none absolute right-1 top-[46%] hidden w-12 -scale-x-100 text-ceramic-brown/25 xl:block 2xl:right-8 2xl:w-16" />
        <CoffeeBranch className="pointer-events-none absolute left-1 top-[76%] hidden w-12 text-ceramic-brown/25 xl:block 2xl:left-8 2xl:w-16" />
      </div>
    </>
  );
}
