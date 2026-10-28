import type { Metadata } from 'next';
import { getMenuSection } from '@/lib/data/menu';
import { PageHeader } from '@/components/sections/PageHeader';
import { MenuSectionList } from '@/components/sections/MenuSectionList';

export const metadata: Metadata = {
  title: 'Cardápio',
  description: 'Cardápio do Amandia Café Garden em Capão da Canoa: focaccias, cafés e brunch servidos no jardim.',
  alternates: { canonical: '/cardapio' },
};

export default async function Page() {
  const categories = await getMenuSection('cardapio');

  return (
    <>
      <PageHeader
        eyebrow="Do forno e da xícara"
        title="Cardápio"
        intro="Focaccias assadas no dia, cafés preparados com calma e o que mais a estação trouxer."
      />
      <MenuSectionList
        categories={categories}
        emptyMessage="O cardápio está sendo atualizado. Enquanto isso, acompanhe as novidades no nosso Instagram."
      />
    </>
  );
}
