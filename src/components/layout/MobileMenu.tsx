'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { siteConfig } from '@/lib/site-config';
import { buildGoogleMapsDirectionsUrl, buildWhatsAppUrl } from '@/lib/links';
import { TrackedLink } from '@/components/ui/TrackedLink';
import { GuidingQuote } from '@/components/ui/GuidingQuote';
import { ChatIcon, CloseIcon, MapPinIcon, MenuIcon } from '@/components/ui/icons';

/**
 * Menu mobile com <dialog> nativo: foco preso, Esc para fechar e
 * backdrop sem biblioteca. Fecha sozinho ao trocar de rota.
 */
export function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        aria-label="Abrir menu"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
        className="-mr-2 inline-flex size-12 items-center justify-center rounded-full text-heading xl:hidden"
      >
        <MenuIcon width={24} height={24} />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Menu"
        // Clique no backdrop (fora do conteúdo) fecha o menu
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-0 ml-auto h-dvh max-h-none w-[min(22rem,100%)] max-w-none bg-bg p-0 text-ink backdrop:bg-moss-950/40"
      >
        <div className="flex h-full flex-col px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-3">
          <div className="flex justify-end">
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={close}
              className="-mr-2 inline-flex size-12 items-center justify-center rounded-xl text-heading"
            >
              <CloseIcon width={24} height={24} />
            </button>
          </div>

          <nav aria-label="Principal (mobile)" className="mt-4">
            <ul className="space-y-1">
              <li>
                <Link href="/" className="block py-2 font-serif text-h3 text-heading">
                  Início
                </Link>
              </li>
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? 'page' : undefined}
                    className="block py-2 font-serif text-h3 text-heading aria-[current=page]:italic aria-[current=page]:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto space-y-6">
            <GuidingQuote variant="inline" className="text-xl" />
            <div className="grid gap-3">
              <TrackedLink
                href={buildGoogleMapsDirectionsUrl()}
                event="click_route"
                tracking={{ placement: 'mobile_menu', provider: 'google_maps' }}
              >
                <MapPinIcon /> Como chegar
              </TrackedLink>
              <TrackedLink
                href={buildWhatsAppUrl()}
                event="click_whatsapp"
                tracking={{ placement: 'mobile_menu' }}
                variant="secondary"
              >
                <ChatIcon /> WhatsApp
              </TrackedLink>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
