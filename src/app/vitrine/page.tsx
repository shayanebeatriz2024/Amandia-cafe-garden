import type { Metadata } from 'next';
import { getMenuSection } from '@/lib/data/menu';
import { PageHeader } from '@/components/sections/PageHeader';
import { MenuSectionList } from '@/components/sections/MenuSectionList';

export const metadata: Metadata = {
  title: 'Vitrine',
  description: 'Doces e salgados do dia na vitrine do Amandia Café Garden, em Capão da Canoa (RS).',
  alternates: { canonical: '/vitrine' },
};

export default async function Page() {
  const categories = await getMenuSection('vitrine');

  return (
    <>
      <PageHeader
        eyebrow="Doces e salgados"
        title="Vitrine"
        intro="A vitrine muda todo dia. Chame a gente no WhatsApp para reservar o seu antes que acabe."
      />
      <MenuSectionList
        categories={categories}
        emptyMessage="A vitrine de hoje ainda está sendo montada. Chame a gente no WhatsApp para saber o que saiu do forno."
      />
    </>
  );
}
