import Script from 'next/script';

type GoogleAnalyticsProps = {
  gaId: string | undefined;
};

/**
 * GA4 com Consent Mode v2 (docs/02-trd.md §5.1).
 * - Carrega após a hidratação (`afterInteractive`): zero impacto no LCP.
 * - Consentimento padrão "denied" (LGPD): sem cookies até o ConsentBanner (Fase 4)
 *   chamar gtag('consent', 'update', { analytics_storage: 'granted' }).
 * - Só renderiza em produção e com ID configurado.
 */
export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  if (!gaId || process.env.NODE_ENV !== 'production') return null;

  return (
    <>
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500
          });
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
      <Script
        id="ga4-lib"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
    </>
  );
}
