import Image from 'next/image';
import { illustrations, photos, type Photo } from '@/lib/images';
import { cn } from '@/lib/cn';
import { CoffeeBranch, PourOverDoodle } from '@/components/ui/coffee-illustrations';
import { ChapterHeading } from '@/components/ui/ChapterHeading';
import { DoodleHeart } from '@/components/ui/doodles';

type Detail = {
  photo: Photo;
  title: string;
  /** Frase curta em lettering abaixo do círculo. */
  note: string;
  /** Enquadramento da foto dentro do círculo. */
  position?: string;
  offset?: string;
};

// Só fatos confirmados: o café é da torrefação parceira Guria Roasters (não torrado na casa).
const DETAILS: Detail[] = [
  {
    photo: photos.focacciaECafe,
    title: 'Pães & focaccias',
    note: 'massa feita aqui',
    position: 'object-[35%_75%]',
  },
  {
    photo: photos.mesaDecorada,
    title: 'Cafés especiais',
    note: 'grãos Guria Roasters',
    position: 'object-center',
    offset: 'md:mt-16',
  },
  {
    photo: photos.boloComFrutas,
    title: 'Confeitaria',
    note: 'brownies, bolos e a Torta Amandia',
    position: 'object-[60%_50%]',
  },
];

/** Produção / Processo artesanal — detalhes em círculos com moldura cerâmica. */
export function ProductionChapter() {
  return (
    <section id="producao" aria-labelledby="producao-titulo" className="relative overflow-hidden py-section">
      <PourOverDoodle className="pointer-events-none absolute left-8 top-24 hidden w-32 -scale-x-100 text-ceramic-brown/35 lg:block xl:left-[8%]" />
      <CoffeeBranch className="pointer-events-none absolute -bottom-6 right-8 hidden w-16 rotate-[-10deg] text-ceramic-brown/30 lg:block xl:right-[8%]" />
      <div className="container">
        <ChapterHeading
          id="producao-titulo"
          eyebrow="Produção artesanal"
          icon={illustrations.vasoSementes}
          badge={{ label: 'Feito à mão', tone: 'orange' }}
          align="center"
          title={
            <>
              Devagar, do jeito <em>que tem que ser</em>
            </>
          }
          intro="Por trás de cada fornada existe um processo artesanal, feito com tempo e cuidado."
        />

        <ul className="mx-auto mt-16 grid max-w-5xl gap-12 sm:grid-cols-3 sm:gap-8">
          {DETAILS.map((detail) => (
            <li key={detail.title} className={cn('flex flex-col items-center text-center', detail.offset)}>
              <div className="relative">
                <div className="relative size-56 overflow-hidden rounded-full border-4 border-ceramic-brown shadow-lift md:size-60">
                  <Image
                    src={detail.photo.src}
                    alt={detail.photo.alt}
                    fill
                    quality={90}
                    placeholder="blur"
                    sizes="240px"
                    className={cn('object-cover', detail.position)}
                  />
                </div>
              </div>
              <h3 className="mt-6 font-display-heavy text-lg uppercase tracking-wide text-amandia-green">
                {detail.title}
              </h3>
              <p className="mt-1 font-handwriting text-2xl font-semibold leading-tight text-amandia-green">
                {detail.note}
              </p>
            </li>
          ))}
        </ul>

        {/* Pausa em lettering afetivo */}
        <p className="mt-16 flex items-center justify-center gap-3 font-handwriting text-5xl font-bold text-amandia-green">
          Aconchego
          <DoodleHeart className="size-6 text-amandia-pink" />
        </p>
      </div>
    </section>
  );
}
