import Image from 'next/image';
import { photos, type Photo } from '@/lib/images';
import type { CSSProperties } from 'react';
import { ChapterHeading } from '@/components/ui/ChapterHeading';

type Moment = { photo: Photo; caption: string; position?: string };

const MOMENTS: Moment[] = [
  { photo: photos.mesaPostaBanquete, caption: 'Mesa posta para celebrar' },
  { photo: photos.cafeBoloCenoura, caption: 'Café passado & bolo quentinho', position: 'object-[62%_50%]' },
  { photo: photos.gardenQueBom, caption: 'Sombra fresca entre as flores', position: 'object-[50%_60%]' },
  { photo: photos.entradaBalancos, caption: 'Balanços de macramé na entrada', position: 'object-[55%_50%]' },
  { photo: photos.brownieCappuccino, caption: 'Brownie & cappuccino na cerâmica', position: 'object-[52%_60%]' },
  { photo: photos.guriaCafesEspeciais, caption: 'Cafés especiais para levar', position: 'object-[50%_70%]' },
];

/**
 * Ponto de partida de cada foto antes de se juntar à grade (3 colunas × 2 fileiras):
 * as laterais vêm de fora para dentro, a fileira de cima desce e a de baixo sobe.
 */
function convergeFrom(i: number): CSSProperties {
  const col = (i % 3) - 1; // -1, 0, 1
  const row = Math.floor(i / 3) === 0 ? -1 : 1;
  return { '--dx': `${col * 110}px`, '--dy': `${row * 70}px`, '--rot': `${col * 6}deg` } as CSSProperties;
}

/** Momentos no Garden — grade editorial de fotos verticais em arco (2 fileiras de 3). */
export function MomentsGallery() {
  return (
    <section id="momentos" aria-labelledby="momentos-titulo" className="overflow-hidden py-section">
      <div className="container">
        <ChapterHeading
          id="momentos-titulo"
          eyebrow="Galeria"
          align="center"
          title={
            <>
              Momentos no <em>Garden</em>
            </>
          }
        />

        <ul data-progress className="mx-auto mt-14 grid max-w-5xl gap-x-6 gap-y-12 sm:grid-cols-3 lg:gap-x-10 lg:gap-y-14">
          {MOMENTS.map((moment, i) => (
            <li key={moment.caption} className="converge" style={convergeFrom(i)}>
              <figure>
                <div className="relative aspect-[3/4] overflow-hidden rounded-b-2xl rounded-t-full border-2 border-ceramic-brown/60 shadow-hairline">
                  <Image
                    src={moment.photo.src}
                    alt={moment.photo.alt}
                    fill
                    quality={90}
                    placeholder="blur"
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 30vw, 100vw"
                    className={`object-cover ${moment.position ?? 'object-center'}`}
                  />
                </div>
                <figcaption className="mt-4 text-center font-handwriting text-2xl font-semibold text-amandia-green">
                  {moment.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
