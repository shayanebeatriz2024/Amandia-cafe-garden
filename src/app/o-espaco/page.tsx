import type { Metadata } from 'next';
import { getBusinessHours } from '@/lib/data/hours';
import { PageHeader } from '@/components/sections/PageHeader';
import { GardenChapter } from '@/components/sections/GardenChapter';
import { MesaPosta } from '@/components/sections/MesaPosta';
import { ScheduleLocation } from '@/components/sections/ScheduleLocation';

export const metadata: Metadata = {
  title: 'O Espaço',
  description:
    'Garden ao ar livre, Mesa Posta (Opções Mar, Terra, Sol e Lua, a partir de R$ 47,90 por pessoa) e espaço para celebrações no Amandia Café Garden, em Navegantes, Capão da Canoa (RS). Pet friendly e acolhedor LGBTQ+.',
  alternates: { canonical: '/o-espaco' },
};

export default async function EspacoPage() {
  const hours = await getBusinessHours();

  return (
    <>
      <PageHeader
        eyebrow="O Espaço"
        title="Um jardim para estar e para celebrar"
        intro="Mesas entre as plantas, luz natural e o tempo que cada café merece, a poucos passos da Praia de Navegantes."
      />
      <GardenChapter />
      <MesaPosta />
      <ScheduleLocation hours={hours.regular} />
    </>
  );
}
