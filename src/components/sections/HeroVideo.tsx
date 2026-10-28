'use client';

import { useEffect, useRef, useState } from 'react';

type HeroVideoProps = {
  src: string;
  poster: string;
  className?: string;
  /** Descrição para leitores de tela; omitida em vídeos decorativos. */
  label?: string;
  /** Mostra um botão discreto para ativar/silenciar o som. */
  soundToggle?: boolean;
  soundButtonClassName?: string;
};

function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      {on ? (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M19 5a10 10 0 0 1 0 14" />
        </>
      ) : (
        <>
          <path d="m22 9-6 6" />
          <path d="m16 9 6 6" />
        </>
      )}
    </svg>
  );
}

/**
 * Vídeo do Hero (autoPlay · loop · muted · playsInline).
 *
 * Performance: o Hero é o primeiro conteúdo da página. O poster aparece de imediato
 * (é o elemento LCP) e o arquivo de vídeo só começa a baixar depois do evento `load`,
 * para não competir com o carregamento inicial (meta LCP < 1s, docs/02-trd.md).
 * Com prefers-reduced-motion, fica só o poster (o botão de som inicia a reprodução).
 */
export function HeroVideo({ src, poster, className, label, soundToggle, soundButtonClassName }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const start = () => window.setTimeout(() => setReady(true), 150);
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => window.removeEventListener('load', start);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!ready || !v) return;
    v.load();
    v.play().catch(() => undefined);
  }, [ready]);

  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    if (!ready) setReady(true);
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused) v.play().catch(() => undefined);
  };

  return (
    <>
      <video
        ref={ref}
        className={className}
        poster={poster}
        autoPlay={ready}
        loop
        muted
        playsInline
        preload="none"
        aria-label={label}
        aria-hidden={label ? undefined : true}
        tabIndex={-1}
      >
        {ready && <source src={src} type="video/mp4" />}
      </video>

      {soundToggle && (
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={!muted}
          aria-label={muted ? 'Ativar o som do vídeo' : 'Silenciar o vídeo'}
          className={
            soundButtonClassName ??
            'flex items-center gap-1.5 rounded-full border border-ceramic-brown/30 bg-amandia-cream/90 px-3 py-1.5 text-xs font-medium text-amandia-green backdrop-blur-sm transition-all hover:bg-amandia-cream'
          }
        >
          <SoundIcon on={!muted} />
          {muted ? 'Ativar som' : 'Silenciar'}
        </button>
      )}
    </>
  );
}
