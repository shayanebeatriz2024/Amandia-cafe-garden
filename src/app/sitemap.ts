import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';
import { getUpcomingEvents } from '@/lib/data/events';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const events = await getUpcomingEvents();
  // A agenda "muda" quando o evento mais recente é editado — sinal útil para o Google.
  const agendaModified = events.map((e) => e.updated_at).sort().at(-1);

  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/cardapio`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/o-espaco`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/vitrine`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/presentes`, changeFrequency: 'monthly', priority: 0.7 },
    {
      url: `${base}/agenda`,
      changeFrequency: 'weekly',
      priority: 0.7,
      ...(agendaModified && { lastModified: agendaModified }),
    },
  ];
}
