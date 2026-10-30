import { buildGoogleMapsDirectionsUrl, buildWhatsAppUrl } from '@/lib/links';
import { TrackedLink } from '@/components/ui/TrackedLink';
import { ChatIcon, MapPinIcon } from '@/components/ui/icons';
import { HeroVideo } from './HeroVideo';

/**
 * Prólogo em tela cheia: o vídeo ocupa o Hero de ponta a ponta e fica fixo (sticky)
 * enquanto as seções seguintes sobem por cima dele, como uma cortina (ver app/page.tsx).
 *
 * O poster do vídeo é o elemento LCP (pré-carregado); o vídeo entra após o load.
 */
const HERO_VIDEO = '/videos/hero-destaque.mp4';
const HERO_POSTER = '/videos/hero-destaque-poster.jpg';

export function Hero() {
  return (
    // isolate: cria o contexto de empilhamento local para vídeo (-z-10), overlays e conteúdo (z-10)
    // Altura = tela menos o header; abaixo do xl o header também tem a faixa de seções
    <section className="sticky top-0 isolate z-0 flex h-[calc(100svh-theme(spacing.header)-theme(spacing.header-tabs))] min-h-[34rem] items-center overflow-hidden xl:h-[calc(100svh-theme(spacing.header))]">
      {/* Poster = LCP: pré-carregado com prioridade alta (React hoista para o <head>) */}
      <link rel="preload" as="image" href={HERO_POSTER} fetchPriority="high" />

      {/* Vídeo full-bleed + botão discreto de som (canto inferior direito) */}
      <HeroVideo
        src={HERO_VIDEO}
        poster={HERO_POSTER}
        label="Vídeo do salão do Amandia: balcão, vitrine de doces e luzes acolhedoras"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        soundToggle
        soundButtonClassName="absolute bottom-16 right-5 z-30 flex items-center gap-1.5 rounded-full border border-ceramic-brown/30 bg-amandia-cream/90 px-3 py-1.5 text-xs font-medium text-amandia-green backdrop-blur-sm transition-all hover:bg-amandia-cream md:bottom-20 md:right-8"
      />

      {/* Sem nenhuma camada sobre o vídeo: 100% de nitidez e saturação originais.
          A leitura do texto claro vem de uma sombra em camadas aplicada só nas letras. */}

      <div className="container relative z-10">
        <div className="relative max-w-2xl motion-safe:animate-fade-up [text-shadow:0_1px_2px_rgba(10,20,14,0.7),0_2px_10px_rgba(10,20,14,0.55),0_6px_28px_rgba(10,20,14,0.5)]">
          {/* Texto claro com sombra em camadas. "amor" em terracota claro (#E8C9A6) */}
          <h1 className="font-serif text-display font-medium text-amandia-cream">
            Quando no caminho existe <em className="text-clay-300">amor</em>, o caminho é bom.
          </h1>

          <p className="mt-8 max-w-prose text-lg leading-relaxed text-amandia-cream">
            <strong className="font-display-heavy text-amandia-cream">
              Cafés, Focaccias, Brownies e Garden! Lugar de gente boa.
            </strong>
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <TrackedLink
              href={buildGoogleMapsDirectionsUrl()}
              event="click_route"
              tracking={{ placement: 'hero', provider: 'google_maps' }}
              variant="light"
            >
              <MapPinIcon /> Como chegar
            </TrackedLink>
            <TrackedLink
              href={buildWhatsAppUrl()}
              event="click_whatsapp"
              tracking={{ placement: 'hero' }}
              variant="outlineLight"
            >
              <ChatIcon /> Falar no WhatsApp
            </TrackedLink>
          </div>
        </div>
      </div>
    </section>
  );
}
