import Image from 'next/image';
import { photos } from '@/lib/images';
import { GardenVideo } from './GardenVideo';
import { EightPointStar, GardenBazarLettering } from './GardenBazarLettering';
import { GardenBazarSignup } from './GardenBazarSignup';
import { ChapterHeading } from '@/components/ui/ChapterHeading';
import { DoodleHeart } from '@/components/ui/doodles';

/** Capítulo I — Garden & Refúgio: grid editorial estilo revista. */
export function GardenChapter() {
  return (
    <section id="garden" aria-labelledby="garden-titulo" className="relative overflow-hidden py-section">
      {/* Marca d'água: ramo oficial na transição entre o Hero e o Garden */}
      <div className="container relative">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <ChapterHeading
            id="garden-titulo"
            eyebrow="Garden Café Bazar"
            note="pet friendly"
            title={
              <>
                <span className="sr-only">Garden Bazar</span>
                <GardenBazarLettering className="w-full max-w-[22rem] text-heading lg:max-w-[26rem]" />
              </>
            }
            className="lg:col-span-7"
          />

          {/* Card editorial "Compre Local" — recria o post oficial do Bazar */}
          <div className="lg:col-span-5">
            <div className="relative bg-transparent px-8 pb-8 pt-10 text-center">
              <blockquote className="font-light text-heading">
                <p className="mx-auto grid w-fit grid-cols-[auto_auto_auto] items-center gap-x-3 text-2xl leading-tight sm:text-[1.7rem]">
                  <span className="text-left">pequenos</span>
                  <EightPointStar className="row-span-2 size-12 text-amandia-pink" />
                  <span className="text-right">negócios,</span>
                  <span className="text-left">grandes</span>
                  <span className="text-right">sonhos.</span>
                </p>
                <p className="mt-6 text-xl leading-snug sm:text-[1.4rem]">
                  compre local e fortaleça
                  <br />a economia criativa.
                </p>
              </blockquote>
              <EightPointStar className="absolute bottom-24 left-5 size-5 text-amandia-pink" />
              <EightPointStar className="absolute bottom-20 right-6 size-9 text-amandia-pink" />
              <p className="mt-12 rounded-full bg-moss-700 px-6 py-2.5 font-serif text-lg text-clay-300">
                café, focaccia &amp; marcas locais
              </p>
            </div>
            <p className="mt-6 text-center text-lg leading-relaxed text-muted">
              uma curadoria afetiva de marcas, arte, comidinhas e encontros reais
            </p>
          </div>
        </div>

        {/* Vídeo do Garden em arco + selo da imprensa como apoio textual */}
        <div className="mt-14 flex flex-col items-center gap-10 md:flex-row md:items-end md:justify-center md:gap-14">
          {/* Vídeo real do Garden em arco (vertical, sem cortes) com controle de som */}
          <div className="relative w-full max-w-[21rem] lg:max-w-[23rem]">
            <GardenVideo
              src="/videos/garden-experiencia.mp4"
              poster="/videos/garden-experiencia-poster.jpg"
              label="Vídeo do Garden do Amandia: ombrelone, cadeira de madeira, sofá com almofadas e varal de luzes ao sol"
            />
          </div>

          {/* Selo da imprensa: foto da revista + serifa itálica delicada + coração coral */}
          <figure className="max-w-xs text-center md:mb-16 md:text-left">
            <Image
              src={photos.revista.src}
              alt={photos.revista.alt}
              placeholder="blur"
              sizes="320px"
              className="mb-8 w-full rounded-[2rem] border border-ceramic-brown/30 object-cover shadow-lift"
            />
            <blockquote className="relative rounded-[2rem] border border-ceramic-brown/30 bg-surface/70 px-7 py-6 shadow-hairline">
              <DoodleHeart className="absolute -top-3 left-1/2 size-6 -translate-x-1/2 text-amandia-pink md:left-8 md:translate-x-0" />
              <p className="font-serif text-xl italic leading-snug text-heading">
                “Um lugar para estar, e também para celebrar.”
              </p>
            </blockquote>
            <figcaption className="mt-3 text-[0.7rem] uppercase tracking-[0.2em] text-muted">
              Destaque na imprensa · <span className="font-semibold text-amandia-orange-ink">Revista</span>
            </figcaption>
          </figure>
        </div>

        {/* Mesas do espaço, onde o Bazar acontece */}
        <h3 className="mt-14 flex items-center justify-center gap-3 text-center font-handwriting text-3xl font-semibold text-heading">
          <EightPointStar className="size-5 text-amandia-pink" />
          Fotos reais do Bazar
          <EightPointStar className="size-5 text-amandia-pink" />
        </h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {[photos.gardenMesaBolo, photos.gardenOmbrelones].map((photo) => (
            <Image
              key={photo.alt}
              src={photo.src}
              alt={photo.alt}
              placeholder="blur"
              sizes="(min-width: 640px) 50vw, 100vw"
              className="aspect-[4/3] w-full rounded-[2rem] border border-ceramic-brown/30 object-cover shadow-lift"
            />
          ))}
        </div>

        {/* Pausa em lettering afetivo */}
        <p className="mt-14 flex items-center justify-center gap-3 text-center font-handwriting text-4xl font-semibold text-heading">
          Lugar de gente boa.
          <DoodleHeart className="size-5 text-amandia-offwhite" />
        </p>

        <GardenBazarSignup />
      </div>
    </section>
  );
}
