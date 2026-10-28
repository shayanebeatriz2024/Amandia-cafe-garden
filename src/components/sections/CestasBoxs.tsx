import Image from 'next/image';
import { photos } from '@/lib/images';
import { buildWhatsAppUrl } from '@/lib/links';
import { ChapterHeading } from '@/components/ui/ChapterHeading';
import { TrackedLink } from '@/components/ui/TrackedLink';
import { CoffeeBranch } from '@/components/ui/coffee-illustrations';
import { ChatIcon, GiftIcon } from '@/components/ui/icons';
import { DoodleHeart, Sparkle } from '@/components/ui/doodles';

/**
 * Capítulo IV — Cestas & Boxs. Bloco delicado inspirado nos stories oficiais:
 * fundo branco, ramos em linha e o círculo verde da identidade no canto.
 */
export function CestasBoxs() {
  return (
    <section id="cestas" aria-labelledby="cestas-titulo" className="py-section">
      <div className="container">
        <div className="card relative overflow-hidden border-2 border-ceramic-brown/50 px-6 py-16 md:px-16 md:py-20">
          {/* Ornamentos da identidade */}
          <span
            className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-brand-teal/90 md:size-64"
            aria-hidden="true"
          />
          <CoffeeBranch className="pointer-events-none absolute -left-3 -top-10 hidden w-20 rotate-[-12deg] text-ceramic-brown/45 md:block" />
          <CoffeeBranch className="pointer-events-none absolute -bottom-24 left-[44%] hidden w-16 rotate-[28deg] text-ceramic-brown/35 lg:block" />

          <div className="relative grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 md:pl-14">
              <ChapterHeading
                id="cestas-titulo"
                eyebrow="Cestas & Boxs"
                badge={{ label: 'Curadoria afetiva', tone: 'pink' }}
                title={
                  <>
                    Amandia <DoodleHeart className="inline size-7 text-amandia-pink" />{' '}
                    <em>em momentos especiais</em>
                  </>
                }
                intro="Cada cesta e box Amandia é preparada de forma artesanal, com ingredientes frescos e muita calma. Para o café da manhã de quem você ama ou para presentear numa data que importa."
              />
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <TrackedLink
                  href={buildWhatsAppUrl('Olá! Gostaria de encomendar uma Cesta/Box Amandia. 🌿')}
                  event="click_whatsapp"
                  tracking={{ placement: 'gift_card', item_name: 'Cestas & Boxs' }}
                >
                  <ChatIcon /> Encomendar pelo WhatsApp
                </TrackedLink>
                <span className="inline-flex items-center gap-2 text-sm text-muted">
                  <GiftIcon width={18} height={18} className="text-amandia-orange" />
                  Feitas sob encomenda
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xs lg:col-span-5">
              <div className="relative aspect-square overflow-hidden rounded-full border-4 border-ceramic-brown bg-surface shadow-lift">
                <Image
                  src={photos.cesta.src}
                  alt={photos.cesta.alt}
                  fill
                  quality={90}
                  placeholder="blur"
                  sizes="320px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -left-4 -top-2 size-24 -rotate-6 overflow-hidden rounded-full border-2 border-ceramic-brown bg-surface p-1.5 shadow-hairline">
                <Image src={photos.aconchego.src} alt="" quality={90} sizes="96px" className="size-full rounded-full object-cover" />
              </div>
              <Sparkle className="absolute -right-1 top-4 size-7 text-amandia-orange" />
              <p className="mt-6 text-center font-handwriting text-3xl font-semibold text-amandia-green">
                Feito com calma, entregue com afeto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
