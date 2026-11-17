import Image from 'next/image';
import { illustrations } from '@/lib/images';
import { ChapterHeading } from '@/components/ui/ChapterHeading';
import { CoffeeBean } from '@/components/ui/coffee-illustrations';
import { Sparkle, SunBurst } from '@/components/ui/doodles';
import { WorkWithUsForm } from './WorkWithUsForm';

/** Trabalhe Conosco — cadastro breve enviado ao WhatsApp, entre estrelas, grãos e canecas. */
export function WorkWithUs() {
  return (
    <section
      id="trabalhe-conosco"
      aria-labelledby="trabalhe-conosco-titulo"
      className="relative overflow-hidden py-section"
    >
      {/* Ilustrações sutis nas laterais — decorativas, só a partir do tablet */}
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
        <Sparkle className="absolute left-[12%] top-[12%] size-4 text-amandia-orange/70" />
        <Sparkle className="absolute left-[16%] top-[16%] size-6 text-clay-500/70" />
        <SunBurst className="absolute left-[9%] top-[26%] size-8 text-amandia-pink/70" />
        <CoffeeBean className="absolute left-[14%] top-[40%] w-4 rotate-12 text-ceramic-brown/50" />
        <CoffeeBean className="absolute left-[8%] top-[52%] w-5 -rotate-45 text-ceramic-brown/45" />
        <CoffeeBean className="absolute left-[12%] top-[56%] w-4 rotate-[30deg] text-ceramic-brown/45" />
        <Sparkle className="absolute left-[14%] top-[66%] size-4 text-clay-500/70" />

        {/* Caneca na mão: adesivo da cartela oficial */}
        <Image src={illustrations.adesivoCanecaMao} alt="" sizes="80px" className="absolute right-[10%] top-[20%] w-16 opacity-60 lg:w-20" />
        <CoffeeBean className="absolute right-[12%] top-[46%] w-4 -rotate-12 text-ceramic-brown/45" />
        <CoffeeBean className="absolute right-[15%] top-[44%] w-4 rotate-45 text-ceramic-brown/45" />
        <Sparkle className="absolute right-[11%] top-[56%] size-5 text-clay-500/70" />
        <Image src={illustrations.adesivoCanecaMao} alt="" sizes="96px" className="absolute bottom-[16%] right-[9%] w-20 -scale-x-100 opacity-60 lg:w-24" />
      </div>

      <div className="container relative">
        <ChapterHeading
          id="trabalhe-conosco-titulo"
          eyebrow="Faça parte"
          align="center"
          title={
            <>
              Faça parte da <em>nossa equipe</em>
            </>
          }
          intro="Gosta de café, de gente e de fazer tudo com calma e capricho? Conte um pouco sobre você."
        />
        <WorkWithUsForm />
      </div>
    </section>
  );
}
