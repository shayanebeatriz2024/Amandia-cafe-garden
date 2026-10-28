'use client';

import { useState, type FormEvent } from 'react';
import { buildWhatsAppUrl } from '@/lib/links';
import { trackEvent } from '@/lib/analytics';
import { buttonClasses } from '@/components/ui/button-styles';
import { WhatsAppIcon } from '@/components/ui/icons';

type Exhibitor = {
  fullName: string;
  brand: string;
  talent: string;
  product: string;
};

/** Mensagem no mesmo formato das reservas: saudação + dados + 🌿. */
function exhibitorMessage({ fullName, brand, talent, product }: Exhibitor): string {
  return [
    'Olá! Quero participar do Garden Café Bazar como expositor(a). 🌿',
    '',
    `*Nome completo:* ${fullName}`,
    `*Marca:* ${brand}`,
    `*Sobre meu talento e trabalho:* ${talent}`,
    `*Meu produto:* ${product}`,
  ].join('\n');
}

/** Cadastro de expositores/artesãos do Bazar — os dados seguem prontos para o WhatsApp. */
export function GardenBazarForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const href = buildWhatsAppUrl(
      exhibitorMessage({
        fullName: String(data.get('fullName')).trim(),
        brand: String(data.get('brand')).trim(),
        talent: String(data.get('talent')).trim(),
        product: String(data.get('product')).trim(),
      }),
    );

    trackEvent('click_whatsapp', { placement: 'bazar_signup', item_name: 'Garden Café Bazar', link_url: href });
    window.open(href, '_blank', 'noopener,noreferrer');
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 flex max-w-xl flex-col gap-4">
      <label className="sr-only" htmlFor="bazar-full-name">
        Nome completo
      </label>
      <input
        id="bazar-full-name"
        name="fullName"
        type="text"
        autoComplete="name"
        placeholder="Nome completo"
        required
        className="form-field"
      />

      <label className="sr-only" htmlFor="bazar-brand">
        Nome da marca
      </label>
      <input
        id="bazar-brand"
        name="brand"
        type="text"
        autoComplete="organization"
        placeholder="Nome da marca"
        required
        className="form-field"
      />

      <label className="sr-only" htmlFor="bazar-talent">
        Me conte um pouco sobre o talento e o seu trabalho
      </label>
      <textarea
        id="bazar-talent"
        name="talent"
        rows={4}
        placeholder="Me conte um pouco sobre o talento e o seu trabalho"
        required
        className="form-field resize-y rounded-3xl"
      />

      <label className="sr-only" htmlFor="bazar-product">
        O que é o seu produto
      </label>
      <textarea
        id="bazar-product"
        name="product"
        rows={3}
        placeholder="O que é o seu produto"
        required
        className="form-field resize-y rounded-3xl"
      />

      <button type="submit" className={buttonClasses('primary', 'mt-2 w-full')}>
        <WhatsAppIcon /> Enviar dados para WhatsApp
      </button>

      <p className="text-center text-muted" aria-live="polite">
        {sent ? 'Pronto! É só enviar a mensagem no WhatsApp.' : 'E entraremos em contato.'}
      </p>
    </form>
  );
}
