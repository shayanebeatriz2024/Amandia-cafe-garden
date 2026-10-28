import type { Metadata } from 'next';
import { PageHeader } from '@/components/sections/PageHeader';
import { CestasBoxs } from '@/components/sections/CestasBoxs';

export const metadata: Metadata = {
  title: 'Cestas & Boxs',
  description:
    'Cestas de café da manhã e boxes de presente do Amandia Café Garden, preparadas de forma artesanal em Capão da Canoa (RS). Encomende pelo WhatsApp.',
  alternates: { canonical: '/presentes' },
};

export default function PresentesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Presentes"
        title="Cestas & Boxs"
        intro="Amandia em momentos especiais: preparadas à mão, sob encomenda."
      />
      <CestasBoxs />
    </>
  );
}
