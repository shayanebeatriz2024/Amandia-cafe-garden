import Image from 'next/image';
import { getMenuSection, type MenuItem } from '@/lib/data/menu';
import { formatPrice } from '@/lib/format';
import { MESA_POSTA_INFO } from '@/data/menu';
import { illustrations, photos } from '@/lib/images';
import { buildWhatsAppUrl } from '@/lib/links';
import { cn } from '@/lib/cn';
import { CoffeeBranch } from '@/components/ui/coffee-illustrations';
import { ChapterHeading } from '@/components/ui/ChapterHeading';
import { PackageMark } from '@/components/ui/PackageMark';
import { TrackedLink } from '@/components/ui/TrackedLink';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { DoodleHeart, Sparkle } from '@/components/ui/doodles';
import { ChatIcon } from '@/components/ui/icons';

// Tom de cada pacote (as marcas gráficas vêm do PackageMark).
const PACKAGE_STYLE: Record<string, { tagline: string; featured?: boolean }> = {
  'mesa-posta-mar': { tagline: 'Leve como a brisa da praia' },
  'mesa-posta-terra': { tagline: 'Raiz, sabor e aconchego' },
  'mesa-posta-sol': { tagline: 'Para celebrar com calor' },
  'mesa-posta-lua': { tagline: 'A experiência mais completa', featured: true },
};

const variantOf = (pkg: MenuItem) => pkg.slug.replace('mesa-posta-', '');

function quoteMessage(pkg: MenuItem): string {
  const price = formatPrice(pkg.price_cents);
  return `Olá! Gostaria de reservar a Mesa Posta Opção ${pkg.name}${
    price ? ` (${price} por pessoa)` : ''
  } para uma celebração no Garden. Somos ___ pessoas, na data ___. 🌿`;
}

/** Capítulo II — Mesa Posta & Celebrações. Interatividade só com CSS (zero JS extra). */
export async function MesaPosta() {
  const [category] = await getMenuSection('mesa_posta');
  if (!category || category.items.length === 0) return null;

  return (
    <section id="mesa-posta" aria-labelledby="mesa-posta-titulo" className="relative overflow-hidden py-section">
      <CoffeeBranch className="pointer-events-none absolute -top-10 right-6 hidden w-16 rotate-[16deg] text-ceramic-brown/40 md:block xl:right-14" />
      <div className="container relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <ChapterHeading
              id="mesa-posta-titulo"
              eyebrow="Mesa Posta & Celebrações"
              icon={illustrations.passaroRamo}
              kicker="Feito com calma, entregue com afeto."
              badge={{ label: 'Celebrações', tone: 'pink' }}
              note="sob encomenda"
              title={
                <>
                  Abrimos o nosso jardim <em>para a sua celebração</em>
                </>
              }
              intro="Comemorações, encontros, reuniões, lançamentos e vivências especiais. Criamos este espaço para receber com afeto, aconchego e leveza."
            />

            <div className="card relative mt-10 p-7">
              <Sparkle className="absolute -right-2 -top-2 size-6 text-amandia-orange" />
              <p className="eyebrow">Todas as opções incluem</p>
              <ul className="mt-4 space-y-3">
                {MESA_POSTA_INFO.includedInAll.map((included) => (
                  <li key={included} className="flex gap-3">
                    <DoodleHeart className="mt-1 size-4 text-amandia-pink" />
                    {included}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Colagem de fotos reais */}
          <div className="grid grid-cols-5 gap-4 lg:col-span-6">
            <figure className="relative col-span-3 aspect-[3/4] overflow-hidden rounded-arch border-4 border-ceramic-brown shadow-hairline">
              <Image
                src={photos.mesaDeDoces.src}
                alt={photos.mesaDeDoces.alt}
                fill
                quality={90}
                placeholder="blur"
                sizes="(min-width: 1024px) 28vw, 60vw"
                className="object-cover"
              />
            </figure>
            <div className="col-span-2 flex flex-col gap-4 pt-12">
              <figure className="relative aspect-square overflow-hidden rounded-full border-2 border-ceramic-brown shadow-hairline">
                <Image
                  src={photos.croissantsEFrutas.src}
                  alt={photos.croissantsEFrutas.alt}
                  fill
                  quality={90}
                  placeholder="blur"
                  sizes="(min-width: 1024px) 18vw, 40vw"
                  className="object-cover"
                />
              </figure>
              <p className="font-handwriting text-2xl font-semibold leading-tight text-amandia-green">
                O nome de cada convidado, escrito à mão numa folha do jardim
                <DoodleHeart className="ml-1 inline size-4 text-amandia-pink" />
              </p>
            </div>
          </div>
        </div>

        {/* Pacotes */}
        <ul className="mt-20 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {category.items.map((pkg) => {
            const style = PACKAGE_STYLE[pkg.slug] ?? { tagline: '' };
            const price = formatPrice(pkg.price_cents);

            return (
              <li key={pkg.id}>
                <article
                  className={cn(
                    'card group relative flex h-full flex-col p-7 transition duration-300',
                    'hover:-translate-y-1 hover:shadow-lift focus-within:-translate-y-1 focus-within:shadow-lift motion-reduce:transform-none',
                    style.featured && 'border-2 border-ceramic-brown',
                  )}
                >
                  {style.featured && (
                    <SectionBadge tone="butter" className="absolute -top-3.5 left-6">
                      Tábua de frios nobres
                    </SectionBadge>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="leading-none">
                        <span className="block font-display-heavy text-sm uppercase tracking-[0.18em] text-muted">
                          Opção
                        </span>
                        <span className="mt-1 block font-display-heavy text-4xl uppercase text-amandia-green">
                          {pkg.name}
                        </span>
                      </h3>
                    </div>
                    <PackageMark
                      variant={variantOf(pkg)}
                      className="transition-transform duration-500 group-hover:rotate-12"
                    />
                  </div>

                  {style.tagline && (
                    <p className="mt-2 font-handwriting text-xl leading-tight text-amandia-green">{style.tagline}</p>
                  )}

                  {price && (
                    <p className="mt-6 flex items-baseline gap-2 border-y border-linen-300 py-4">
                      <span className="font-display-heavy text-3xl tabular-nums text-amandia-green">
                        {price}
                      </span>
                      <span className="text-sm text-muted">{pkg.price_label ?? ''}</span>
                    </p>
                  )}

                  <ul className="mt-6 space-y-2.5 text-sm leading-snug">
                    {pkg.includes.map((included) => (
                      <li key={included} className="flex gap-2.5">
                        <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-ceramic-brown/60" aria-hidden="true" />
                        {included}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <TrackedLink
                      href={buildWhatsAppUrl(quoteMessage(pkg))}
                      event="click_booking"
                      tracking={{ placement: 'mesa_posta', item_name: `Mesa Posta ${pkg.name}` }}
                      variant={style.featured ? 'primary' : 'secondary'}
                      className="w-full"
                      aria-label={`Reservar Mesa Posta Opção ${pkg.name} pelo WhatsApp`}
                    >
                      <ChatIcon width={18} height={18} /> Reservar Mesa Posta
                    </TrackedLink>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        {/* Informações importantes */}
        <aside
          aria-labelledby="mesa-posta-info"
          className="mt-10 grid gap-6 rounded-4xl border-2 border-dashed border-amandia-orange/40 bg-surface/60 p-7 md:grid-cols-[auto_1fr] md:gap-10 md:p-10"
        >
          <h3 id="mesa-posta-info" className="font-handwriting text-3xl font-semibold text-amandia-green">
            Informações importantes
          </h3>
          <ul className="grid gap-3 text-sm sm:grid-cols-2">
            {MESA_POSTA_INFO.rules.map((rule) => (
              <li key={rule} className="flex gap-2.5">
                <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-ceramic-brown/60" aria-hidden="true" />
                {rule}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
