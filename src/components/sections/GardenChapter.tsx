import type { ComponentType, CSSProperties, SVGProps } from 'react';
import Image from 'next/image';
import { siteConfig, type AmenityKey } from '@/lib/site-config';
import { photos } from '@/lib/images';
import { GardenVideo } from './GardenVideo';
import { EightPointStar, GardenBazarLettering } from './GardenBazarLettering';
import { GardenBazarSignup } from './GardenBazarSignup';
import { CoffeeBranch } from '@/components/ui/coffee-illustrations';
import { ChapterHeading } from '@/components/ui/ChapterHeading';
import { PawIcon, RainbowIcon, SparklesIcon, SunIcon } from '@/components/ui/icons';
import { DoodleHeart } from '@/components/ui/doodles';

const AMENITY_TINTS = ['bg-amandia-butter', 'bg-amandia-orange-tint', 'bg-amandia-pink-tint', 'bg-sage-200'];

/** Atributos que continuam no Schema.org/SEO mas não aparecem como card nesta seção. */
const HIDDEN_AMENITIES = new Set<AmenityKey>(['lgbtq']);

const AMENITY_ICONS: Record<AmenityKey, ComponentType<SVGProps<SVGSVGElement>>> = {
  celebrations: SparklesIcon,
  garden: SunIcon,
  pet: PawIcon,
  lgbtq: RainbowIcon,
};

/** Capítulo I — Garden & Refúgio: grid editorial estilo revista. */
export function GardenChapter() {
  return (
    <section id="garden" aria-labelledby="garden-titulo" className="relative overflow-hidden py-section">
      {/* Marca d'água: ramo oficial na transição entre o Hero e o Garden */}
      <CoffeeBranch className="pointer-events-none absolute -top-16 right-8 hidden w-16 rotate-[28deg] text-ceramic-brown/40 md:block xl:right-16 xl:w-20" />
      <div className="container relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <ChapterHeading
            id="garden-titulo"
            eyebrow="Garden Café Bazar"
            note="pet friendly"
            title={
              <>
                <span className="sr-only">Garden Bazar</span>
                <GardenBazarLettering className="w-full max-w-[22rem] text-amandia-green lg:max-w-[26rem]" />
              </>
            }
            className="lg:col-span-7"
          />

          {/* Card editorial "Compre Local" — recria o post oficial do Bazar */}
          <div className="lg:col-span-5">
            <div className="relative bg-transparent px-8 pb-8 pt-10 text-center">
              <blockquote className="font-light text-amandia-green">
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
        <h3 className="mt-14 flex items-center justify-center gap-3 text-center font-handwriting text-3xl font-semibold text-amandia-green">
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
        <p className="mt-14 flex items-center justify-center gap-3 text-center font-handwriting text-4xl font-semibold text-amandia-green">
          Lugar de gente boa.
          <DoodleHeart className="size-5 text-amandia-pink" />
        </p>

        {/* Atributos do espaço — montagem em "folhear de livro" (cada card gira a partir da lombada) */}
        <ul data-reveal className="mt-14 grid gap-px overflow-hidden rounded-4xl border border-linen-300 bg-linen-300 sm:grid-cols-3">
          {siteConfig.amenities.filter((amenity) => !HIDDEN_AMENITIES.has(amenity.key)).map((amenity, i) => {
            const Icon = AMENITY_ICONS[amenity.key];
            return (
              <li key={amenity.key} className="page-flip bg-surface p-7" style={{ '--i': i } as CSSProperties}>
                <span className={`inline-flex size-12 items-center justify-center rounded-full text-amandia-green ${AMENITY_TINTS[i % AMENITY_TINTS.length]}`}>
                  <Icon width={22} height={22} />
                </span>
                <h3 className="mt-5 font-display-heavy text-lg">{amenity.label}</h3>
                <p className="mt-2 text-sm leading-relaxed">{amenity.description}</p>
              </li>
            );
          })}
        </ul>

        <GardenBazarSignup />
      </div>
    </section>
  );
}
