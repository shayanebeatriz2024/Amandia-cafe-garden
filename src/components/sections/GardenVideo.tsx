'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

type GardenVideoProps = {
  src: string;
  poster: string;
  /** Descrição do conteúdo do vídeo para leitores de tela. */
  label: string;
  className?: string;
};

function SoundOffIcon() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="m22 9-6 6" />
      <path d="m16 9 6 6" />
    </svg>
  );
}

function SoundOnIcon() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19 5a10 10 0 0 1 0 14" />
    </svg>
  );
}

/** Xícara com fios de vapor animados (CSS puro; parados com prefers-reduced-motion). */
function SteamCup() {
  return (
    <span className="relative inline-flex size-5 items-end justify-center" aria-hidden="true">
      <span className="absolute -top-2.5 left-[5px] h-2.5 w-[2px] rounded-full bg-ceramic-brown/60 motion-safe:animate-steam" />
      <span className="absolute -top-3 left-[9px] h-3 w-[2px] rounded-full bg-ceramic-brown/60 motion-safe:animate-steam [animation-delay:0.9s]" />
      <span className="absolute -top-2.5 left-[13px] h-2.5 w-[2px] rounded-full bg-ceramic-brown/60 motion-safe:animate-steam [animation-delay:1.8s]" />
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10h12v4a6 6 0 0 1-6 6h0a6 6 0 0 1-6-6v-4Z" />
        <path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16" />
      </svg>
    </span>
  );
}

/**
 * Vídeo do Garden em arco, com som opcional.
 * - Só carrega quando a seção se aproxima da tela (não pesa no LCP).
 * - Começa mudo (exigência dos navegadores para autoplay).
 * - Com prefers-reduced-motion, não toca sozinho: o botão inicia a reprodução.
 */
export function GardenVideo({ src, poster, label, className }: GardenVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [muted, setMuted] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (inView && v && !reducedMotion) v.play().catch(() => undefined);
  }, [inView, reducedMotion]);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused) v.play().catch(() => undefined);
  };

  return (
    <figure
      className={cn(
        // Arco (como na galeria) na proporção real da gravação (720×1280 = 9:16): o quadro inteiro
        // aparece, sem cortes; a largura máxima define a altura.
        'relative aspect-[9/16] w-full overflow-hidden rounded-b-[2rem] rounded-t-full border-4 border-ceramic-brown bg-linen-200 shadow-md',
        className,
      )}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover object-center"
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
      >
        {inView && <source src={src} type="video/mp4" />}
      </video>

      {/* Badge botânico com vapor de café */}
      <figcaption className="absolute bottom-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-amandia-butter px-3 py-1 font-handwriting text-xl font-semibold text-amandia-green shadow-hairline">
        <SteamCup />
        Café quentinho no Garden
      </figcaption>

      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={!muted}
        aria-label={muted ? 'Ativar o som do vídeo' : 'Silenciar o vídeo'}
        className="absolute bottom-[4.25rem] right-4 flex items-center gap-1.5 rounded-full border border-ceramic-brown/30 bg-amandia-cream/90 px-3 py-1.5 text-xs font-medium text-amandia-green backdrop-blur-sm transition-all hover:bg-amandia-cream"
      >
        {muted ? <SoundOffIcon /> : <SoundOnIcon />}
        {muted ? 'Ativar som' : 'Silenciar'}
      </button>
    </figure>
  );
}
