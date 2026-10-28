import { ChapterHeading } from '@/components/ui/ChapterHeading';
import { CoffeeBean, CoffeeBranch, CoffeeMug } from '@/components/ui/coffee-illustrations';
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
        <CoffeeBranch className="absolute -bottom-16 left-[6%] w-14 rotate-[-24deg] text-ceramic-brown/35" />

        <CoffeeMug className="absolute right-[10%] top-[22%] w-20 text-ceramic-brown/55" />
        <CoffeeBean className="absolute right-[12%] top-[46%] w-4 -rotate-12 text-ceramic-brown/45" />
        <CoffeeBean className="absolute right-[15%] top-[44%] w-4 rotate-45 text-ceramic-brown/45" />
        <Sparkle className="absolute right-[11%] top-[56%] size-5 text-clay-500/70" />
        <CoffeeMug className="absolute bottom-[18%] right-[9%] w-24 text-ceramic-brown/55" />
      </div>

      <div className="container relative">
        <ChapterHeading
          id="trabalhe-conosco-titulo"
          eyebrow="Faça parte"
          align="center"
          title={
            <>
              Trabalhe <em>Conosco</em>
            </>
          }
          intro="Gosta de café, de gente e de fazer tudo com calma e capricho? Conte um pouco sobre você."
        />
        <WorkWithUsForm />
      </div>
    </section>
  );
}
