'use client';

import Image, { type StaticImageData } from 'next/image';
import { useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from 'react';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/cn';
import { CakeSlice, CoffeeBean, CoffeeBranch, CoffeeMug, FlowerSprig } from '@/components/ui/coffee-illustrations';
import { Sparkle } from '@/components/ui/doodles';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/icons';

export interface MenuPage {
  slug: string;
  name: string;
  description: string | null;
  photo: { src: StaticImageData; alt: string } | null;
  extras: { title: string; items: Array<{ name: string; price_cents: number }> } | null;
  items: Array<{
    id: string;
    name: string;
    description: string | null;
    price_cents: number | null;
    price_label: string | null;
    is_available: boolean;
    note: string | null;
  }>;
}

const FLIP_MS = 750;
const SWIPE_MIN_PX = 50;

/** Ilustração de fundo de cada página (quase transparente). */
const PAGE_DOODLES: Record<string, typeof CoffeeMug> = {
  'cafes-especiais': CoffeeMug,
  doces: CakeSlice,
  bebidas: FlowerSprig,
  'sanduiches-focaccias': CoffeeBranch,
};

/**
 * Cardápio em livro de capa dura: uma página por categoria, folheada com animação 3D
 * (a página gira pela lombada à esquerda). Setas laterais, abas-índice, teclado ←/→
 * e deslize no celular. Todas as páginas ficam no HTML (indexáveis); as fora de vista
 * ficam invisíveis e inertes.
 */
export function MenuBook({ pages }: { pages: MenuPage[] }) {
  const [current, setCurrent] = useState(0);
  const [turning, setTurning] = useState<{ from: number; to: number } | null>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Array<HTMLElement | null>>([]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const goTo = (target: number) => {
    if (turning || target === current || target < 0 || target >= pages.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(target);
      return;
    }
    setTurning({ from: current, to: target });
  };

  // Folhear: avançando, a página atual gira para a esquerda e revela a próxima;
  // voltando, a página anterior volta da esquerda e cobre a atual.
  useEffect(() => {
    if (!turning) return;
    const forward = turning.to > turning.from;
    const page = pageRefs.current[forward ? turning.from : turning.to];
    if (!page) return;

    const turned = 'perspective(2400px) rotateY(-180deg)';
    const flat = 'perspective(2400px) rotateY(0deg)';
    const options: KeyframeAnimationOptions = {
      duration: FLIP_MS,
      easing: 'cubic-bezier(0.45, 0.05, 0.25, 1)',
      fill: 'forwards',
    };
    const flip = page.animate({ transform: forward ? [flat, turned] : [turned, flat] }, options);
    const shade = page
      .querySelector('[data-page-shade]')
      ?.animate({ opacity: forward ? [0, 0.35] : [0.35, 0] }, options);

    let cancelled = false;
    flip.finished
      .then(() => {
        if (cancelled) return;
        setCurrent(turning.to);
        setTurning(null);
        // No celular, se a página nova começa acima da tela, volta ao topo do caderno.
        const top = bookRef.current?.getBoundingClientRect().top ?? 0;
        if (top < 0) bookRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      })
      .catch(() => {});

    // Cancela depois do commit do novo estado: a página virada já está oculta, sem "piscar".
    return () => {
      cancelled = true;
      flip.cancel();
      shade?.cancel();
    };
  }, [turning]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') goTo(current + 1);
    else if (e.key === 'ArrowLeft') goTo(current - 1);
    else return;
    e.preventDefault();
  };

  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = t ? { x: t.clientX, y: t.clientY } : null;
  };

  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    const t = e.changedTouches[0];
    if (!start || !t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy)) return;
    goTo(dx < 0 ? current + 1 : current - 1);
  };

  const shown = turning?.to ?? current;
  const isFirst = shown === 0;
  const isLast = shown === pages.length - 1;

  return (
    <div ref={bookRef} className="mt-12 scroll-mt-36 xl:scroll-mt-24" onKeyDown={onKeyDown}>
      {/* Abas-índice do livro (marcadores de capítulo) */}
      <div className="menu-book__tabs" aria-label="Páginas do cardápio" role="group">
        {pages.map((page, i) => (
          <button
            key={page.slug}
            type="button"
            onClick={() => goTo(i)}
            aria-current={i === shown ? 'page' : undefined}
            className="menu-book__tab"
          >
            {page.name}
          </button>
        ))}
      </div>

      <div className="relative md:px-16">
        <PageArrow direction="prev" disabled={isFirst} onClick={() => goTo(current - 1)} className="hidden md:flex" />
        <PageArrow direction="next" disabled={isLast} onClick={() => goTo(current + 1)} className="hidden md:flex" />

        <div className="menu-book__stack" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {/* Folhas de baixo do bloco (profundidade) */}
          <span className="menu-book__under menu-book__under--2" aria-hidden="true" />
          <span className="menu-book__under menu-book__under--1" aria-hidden="true" />

          {pages.map((page, i) => {
            const isCurrent = i === current;
            const inFlip = turning !== null && (i === turning.from || i === turning.to);
            const onTop = turning !== null && i === (turning.to > turning.from ? turning.from : turning.to);
            return (
              <article
                key={page.slug}
                ref={(el) => {
                  pageRefs.current[i] = el;
                }}
                aria-labelledby={`menu-pagina-${page.slug}`}
                aria-hidden={!isCurrent}
                inert={!isCurrent}
                className={cn(
                  'notebook-page',
                  isCurrent ? 'relative' : 'absolute inset-x-0 top-0',
                  !isCurrent && !inFlip && 'invisible',
                  onTop ? 'z-20' : 'z-10',
                )}
              >
                <NotebookPageContent page={page} number={i + 1} total={pages.length} />
                <span data-page-shade className="pointer-events-none absolute inset-0 bg-moss-950 opacity-0" aria-hidden="true" />
              </article>
            );
          })}

          {/* Lombada do livro: fica parada enquanto as páginas giram */}
          <span className="menu-book__spine" aria-hidden="true" />
        </div>
      </div>

      {/* Controles de baixo: no celular, as setas ficam aqui para não cobrir o texto */}
      <div className="mt-6 flex items-center justify-between gap-4 md:justify-center">
        <PageArrow direction="prev" disabled={isFirst} onClick={() => goTo(current - 1)} className="md:hidden" />
        <p className="font-handwriting text-2xl text-amandia-green" aria-live="polite">
          <span className="sr-only">{pages[shown]?.name}, </span>
          página {shown + 1} de {pages.length}
        </p>
        <PageArrow direction="next" disabled={isLast} onClick={() => goTo(current + 1)} className="md:hidden" />
      </div>
    </div>
  );
}

function PageArrow({
  direction,
  disabled,
  onClick,
  className,
}: {
  direction: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
  className?: string;
}) {
  const Icon = direction === 'prev' ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Página anterior' : 'Próxima página'}
      className={cn('menu-book__arrow', direction === 'prev' ? 'md:left-0' : 'md:right-0', className)}
    >
      <Icon width={22} height={22} />
    </button>
  );
}

function NotebookPageContent({ page, number, total }: { page: MenuPage; number: number; total: number }) {
  const Doodle = PAGE_DOODLES[page.slug] ?? CoffeeMug;
  return (
    <div className="notebook-page__body">
      {/* Ilustrações de fundo, bem sutis */}
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
        <Doodle className="absolute bottom-10 right-10 w-28 text-ceramic-brown/15 lg:w-36" />
        <CoffeeBean className="absolute bottom-40 right-48 w-4 rotate-12 text-ceramic-brown/15" />
        <Sparkle className="absolute right-[40%] top-10 size-4 text-clay-500/25" />
      </div>

      {/* Topo da página: título à esquerda e foto "colada" à direita, no fluxo (nunca sobre o texto).
          No celular, a foto desce centralizada logo abaixo do título. */}
      <div className="notebook-page__top">
        <header className="min-w-0">
          <h3 id={`menu-pagina-${page.slug}`} className="notebook-page__title">
            {page.name}
          </h3>
          <HandUnderline />
          {page.description && <p className="notebook-page__subtitle">{page.description}</p>}
        </header>

        {page.photo && (
          <figure className="notebook-page__photo">
            <span className="notebook-page__tape" aria-hidden="true" />
            <Image
              src={page.photo.src}
              alt={page.photo.alt}
              placeholder="blur"
              quality={90}
              sizes="176px"
              className="aspect-[4/5] w-full object-cover"
            />
          </figure>
        )}
      </div>

      <ul className="relative z-10 mt-10 gap-x-12 lg:columns-2">
        {page.items.map((item) => {
          const price = formatPrice(item.price_cents);
          return (
            <li key={item.id} className="mb-6 break-inside-avoid">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-lg leading-snug text-heading">{item.name}</span>
                <span className="mx-1 hidden min-w-6 flex-1 border-b border-dotted border-ceramic-brown/30 sm:block" aria-hidden="true" />
                {price && (
                  <span className="ml-auto shrink-0 whitespace-nowrap font-handwriting text-2xl leading-none text-amandia-green sm:ml-0">
                    {price}
                    {item.price_label && <span className="ml-1 font-sans text-xs text-muted">{item.price_label}</span>}
                  </span>
                )}
              </div>
              {!item.is_available && (
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-amandia-pink-ink">Esgotado hoje</p>
              )}
              {item.description && <p className="mt-1 text-sm leading-relaxed text-ink/85">{item.description}</p>}
              {item.note && (
                <p className="mt-1 flex items-center gap-1.5 font-handwriting text-xl leading-none text-amandia-orange-ink">
                  <Sparkle className="size-3 text-amandia-orange" />
                  {item.note}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {page.extras && (
        <aside className="relative z-10 mt-4 rounded-2xl border border-dashed border-ceramic-brown/35 px-5 py-4">
          <h4 className="font-handwriting text-2xl text-amandia-pink-ink">{page.extras.title}</h4>
          <ul className="mt-2 grid gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
            {page.extras.items.map((extra) => (
              <li key={extra.name} className="flex justify-between gap-3">
                <span>{extra.name}</span>
                <span className="whitespace-nowrap tabular-nums text-heading">{formatPrice(extra.price_cents)}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <p className="relative mt-8 text-center font-handwriting text-xl text-muted" aria-hidden="true">
        — {number} de {total} —
      </p>
    </div>
  );
}

/** Traço manual sob o título da página. */
function HandUnderline() {
  return (
    <svg viewBox="0 0 160 12" className="-mt-1 w-32 text-amandia-orange md:w-40" aria-hidden="true" focusable="false">
      <path
        d="M2 8C30 3 58 10 84 6S136 2 158 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
