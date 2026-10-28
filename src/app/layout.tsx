import type { Metadata, Viewport } from 'next';
import { Caveat, Lora, Plus_Jakarta_Sans } from 'next/font/google';
import { siteConfig } from '@/lib/site-config';
import { getBusinessHours } from '@/lib/data/hours';
import { buildLocalBusinessJsonLd, buildWebSiteJsonLd } from '@/lib/schema';
import { JsonLd } from '@/components/seo/JsonLd';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyActionBar } from '@/components/layout/StickyActionBar';
import { PublicOnly } from '@/components/layout/PublicOnly';
import './globals.css';

// Fontes self-hosted no build (sem requisição externa em runtime, CLS ≈ 0).
// Todas variáveis: um arquivo por família cobre todos os pesos.
const serif = Lora({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const hand = Caveat({
  subsets: ['latin'],
  variable: '--font-hand',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} · Café-jardim em Capão da Canoa, RS`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    'café Capão da Canoa',
    'café da manhã Capão da Canoa',
    'brunch Capão da Canoa',
    'focaccia',
    'café-jardim',
    'mesa posta',
    'cestas de presente Capão da Canoa',
    'Litoral Norte Gaúcho',
  ],
  category: 'food',
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    url: '/',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION && {
    verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION },
  }),
  formatDetection: { telephone: false, address: false, email: false },
  // Impede a extensão Dark Reader de escurecer o site (tema claro é a identidade da marca)
  other: { 'darkreader-lock': 'true' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FAF6EE',
  // Site só tem tema claro: evita inversão pelo modo escuro automático do navegador
  colorScheme: 'only light',
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const hours = await getBusinessHours();

  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable} ${hand.variable}`}>
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2"
        >
          Pular para o conteúdo
        </a>

        <PublicOnly>
          <Header />
        </PublicOnly>
        {/* pb compensa a StickyActionBar no mobile */}
        <main id="conteudo" className="pb-28 md:pb-0">
          {children}
        </main>
        <PublicOnly>
          <Footer hours={hours.regular} />
          <StickyActionBar />

          <JsonLd data={[buildLocalBusinessJsonLd(hours.regular), buildWebSiteJsonLd()]} />
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        </PublicOnly>
      </body>
    </html>
  );
}
