'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from 'react';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/cn';
import { BrandHeart } from '@/components/ui/doodles';
import type { ItemDecor, PageDecor, MenuArt } from '@/lib/menu-decor';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/icons';

export interface MenuPage {
  slug: string;
  name: string;
  description: string | null;
  extras: { title: string; items: Array<{ name: string; price_cents: number }> } | null;
  items: Array<{
    id: string;
    name: string;
    description: string | null;
    price_cents: number | null;
    price_label: string | null;
    is_available: boolean;
    note: string | null;
    decor: ItemDecor | null;
  }>;
  decor: PageDecor | null;
}

const FLIP_MS = 750;
const SWIPE_MIN_PX = 50;

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
      {/* theme-base: o caderno é papel creme (leitura confortável) dentro do site verde */}
      <div className="theme-base menu-book__tabs" aria-label="Páginas do cardápio" role="group">
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

      <div className="theme-base relative md:px-16">
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
        <PageArrow direction="prev" disabled={isFirst} onClick={() => goTo(current - 1)} className="theme-base md:hidden" />
        <p className="font-handwriting text-2xl text-heading" aria-live="polite">
          <span className="sr-only">{pages[shown]?.name}, </span>
          página {shown + 1} de {pages.length}
        </p>
        <PageArrow direction="next" disabled={isLast} onClick={() => goTo(current + 1)} className="theme-base md:hidden" />
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
  return (
    <div className="notebook-page__body">
      {/* Topo da página como no impresso: letreiro manuscrito à esquerda e desenho do cardápio/cartela
          à direita, no fluxo (nunca sobre o texto). No celular, o desenho desce centralizado. */}
      <div className="notebook-page__top">
        <header className="min-w-0">
          <h3 id={`menu-pagina-${page.slug}`} className="notebook-page__title">
            {page.decor?.lettering ? (
              <>
                {/* O nome segue para leitores de tela; o letreiro é o mesmo nome da aba */}
                <span className="sr-only">{page.name}</span>
                <Image src={page.decor.lettering} alt="" sizes="260px" className="h-24 w-auto md:h-28" />
              </>
            ) : (
              page.name
            )}
          </h3>
          {!page.decor?.lettering && <HandUnderline />}
          {page.description && <p className="notebook-page__subtitle">{page.description}</p>}
          {page.decor?.producaoNossa && <ProducaoNossaSeal />}
        </header>

        {page.decor?.cover && (
          <div className="notebook-page__art" aria-hidden="true">
            <Image src={page.decor.cover.src} alt="" sizes="256px" className={cn('h-auto', page.decor.cover.className)} />
          </div>
        )}
      </div>

      <ul className="relative z-10 mt-10 gap-x-12 lg:columns-2">
        {page.items.map((item) => {
          const price = formatPrice(item.price_cents);
          return (
            <li key={item.id} className="mb-6 break-inside-avoid">
              {item.decor?.heading && (
                <div className="mb-5 border-b border-heading/40 pb-1">
                  {item.decor.heading.note && (
                    <CalloutNote text={item.decor.heading.note} art={item.decor.heading.noteArt} className="mb-1 justify-end" />
                  )}
                  <p className="font-sans text-base font-bold text-heading">{item.decor.heading.text}</p>
                </div>
              )}
              {/* Como no impresso: a anotação fica acima do nome, com a linha descendo até ele */}
              {item.note && <CalloutNote text={item.note} art={item.decor?.noteArt} className="mb-1 justify-end" />}
              {/* Como no impresso: nome em negrito, descrição e o preço na linha de baixo, tudo em sans limpa */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {item.decor?.heart && <BrandHeart className="size-4 shrink-0 text-heading" />}
                <span className="min-w-0 break-words font-sans text-base font-bold leading-snug text-heading">{item.name}</span>
                {item.decor?.badge && (
                  <Image
                    src={item.decor.badge.art.src}
                    alt={item.decor.badge.text}
                    sizes="160px"
                    className={cn('h-auto', item.decor.badge.art.className)}
                  />
                )}
              </div>
              {!item.is_available && (
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-amandia-pink-ink">Esgotado hoje</p>
              )}
              {item.description && <p className="mt-0.5 font-sans text-sm leading-relaxed text-ink/85">{item.description}</p>}
              {price && (
                <p className="mt-0.5 font-sans text-sm tabular-nums text-ink/85">
                  {price}
                  {item.price_label && <span className="ml-1 text-xs text-muted">{item.price_label}</span>}
                </p>
              )}
              {item.decor?.art && (
                <div className="mt-1 flex items-end justify-end gap-3">
                  <ArtRow art={item.decor.art} />
                </div>
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
                <span className="flex items-center gap-2">
                  <BrandHeart className="size-3 shrink-0 text-heading/70" />
                  {extra.name}
                </span>
                <span className="whitespace-nowrap tabular-nums text-heading">{formatPrice(extra.price_cents)}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {(page.decor?.footerLeft || page.decor?.footerRight) && (
        <div className="relative z-10 mt-8 flex items-end justify-between gap-6" aria-hidden="true">
          {page.decor.footerLeft ? <ArtRow art={page.decor.footerLeft} /> : <span />}
          {page.decor.footerRight && <ArtRow art={page.decor.footerRight} />}
        </div>
      )}

      <p className="relative mt-8 text-center font-handwriting text-xl text-muted" aria-hidden="true">
        — {number} de {total} —
      </p>
    </div>
  );
}

/**
 * Anotação manuscrita do impresso com a linha de chamada (traço curvo terminando em "|").
 * Com `art`, usa o traço recortado do próprio cardápio (o texto fica como alt); sem ele,
 * cai na fonte manuscrita.
 */
function CalloutNote({ text, art, className }: { text: string; art?: MenuArt; className?: string }) {
  return (
    <p className={cn('flex items-end gap-1.5 font-note text-base uppercase leading-none tracking-wide text-heading/80', className)}>
      <svg viewBox="0 0 64 14" className="w-12 shrink-0 text-heading/60" aria-hidden="true" focusable="false">
        <path d="M2 12C18 4 38 3 60 4M60 0v8" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      {art ? <Image src={art.src} alt={text} sizes="200px" className={cn('h-auto', art.className)} /> : text}
    </p>
  );
}

/** Ilustrações do impresso lado a lado (decorativas, no fluxo, nunca sobre preços). */
function ArtRow({ art }: { art: MenuArt[] }) {
  return (
    <span className="flex shrink-0 items-end gap-2" aria-hidden="true">
      {art.map((a) => (
        <Image key={a.src.src} src={a.src} alt="" sizes="200px" className={cn('h-auto', a.className)} />
      ))}
    </span>
  );
}

/** Selo do impresso: coração cheio com "a produção é nossa" dentro e os risquinhos de brilho. */
function ProducaoNossaSeal() {
  return (
    <p className="relative mt-5 inline-flex h-24 w-28 items-center justify-center">
      <svg viewBox="0 0 100 90" className="absolute inset-0 size-full -rotate-6 text-heading" aria-hidden="true" focusable="false">
        <path
          d="M52 87C24 68 3 50 3 28 3 13 14 3 28 3c10 0 18 6 23 15C56 9 64 3 74 3c13 0 23 10 23 25 0 22-19 40-45 59z"
          fill="currentColor"
        />
      </svg>
      <span className="relative -mt-3 text-center font-sans text-xs leading-tight text-surface">
        a produção
        <br />
        <span className="text-base">é nossa</span>
      </span>
      <svg viewBox="0 0 20 20" className="absolute -bottom-1 -right-3 w-5 text-heading" aria-hidden="true" focusable="false">
        <path d="M3 17l4-6M9 18l6-4M10 11l7-1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </p>
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
