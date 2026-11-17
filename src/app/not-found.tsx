import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

export default function NotFound() {
  return (
    <section className="container grid min-h-[60svh] content-center gap-6 py-section">
      <p className="eyebrow">Página não encontrada</p>
      <h1 className="max-w-3xl text-h1">
        Este caminho não levou a lugar nenhum, <em>mas o nosso leva.</em>
      </h1>
      <p className="font-serif text-h3 italic text-muted">{siteConfig.guidingPhrase}</p>
      <Link
        href="/"
        className="inline-flex min-h-12 w-fit items-center rounded-xl bg-amandia-offwhite px-5 text-sm font-medium text-moss-900 transition-colors hover:bg-amandia-butter"
      >
        Voltar ao início
      </Link>
    </section>
  );
}
