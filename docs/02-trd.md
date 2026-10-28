# 02 · TRD — Technical Requirements Document

> Arquitetura Jamstack: **Next.js (App Router) + TypeScript + Tailwind CSS**, conteúdo em **Supabase (Postgres)**, entrega pela **Vercel Edge Network**, medição em **Google Analytics 4**.

---

## 1. Stack

| Camada | Tecnologia | Por quê |
|--------|-----------|---------|
| Framework | **Next.js 15 (App Router)** + React 19 | Server Components (zero JS por padrão), ISR, `next/image`, `next/font`, Metadata API. |
| Linguagem | **TypeScript** (`strict: true`) | Contratos tipados do banco à UI (`src/types/database.ts`). |
| Estilo | **Tailwind CSS 3.4** + `tailwind.config.ts` | Tokens botânicos centralizados; CSS final ~10kb purgado. |
| Dados | **Supabase** (Postgres + PostgREST + Storage) | Painel de edição pronto, RLS para leitura pública, webhooks de banco. |
| Hospedagem | **Vercel** (Edge Network + Data Cache) | ISR global, revalidação por tag, imagens otimizadas na borda. |
| Analytics | **GA4** via `next/script` (`afterInteractive`) + Consent Mode v2 | Eventos de conversão em cliques externos. |
| Fontes | `next/font/google` (self-hosted no build) | Sem requisição a fonts.googleapis.com em runtime; `font-display: swap` + `adjustFontFallback` (CLS ≈ 0). |

### Dependências de runtime (mínimas por design)
`next`, `react`, `react-dom`, `@supabase/supabase-js`. Nada de UI kits, animação JS ou bibliotecas de ícones completas — ícones são SVG inline em `src/components/ui/icons.tsx`.

---

## 2. Arquitetura de renderização

```
                   ┌──────────────────────────────────────────────┐
  Usuário (4G) ──► │ Vercel Edge (CDN)  ─ HTML estático em cache  │
                   │   • Cache HIT → resposta < 100ms              │
                   │   • Stale → serve stale + regenera em bg      │
                   └───────────────┬──────────────────────────────┘
                                   │ (regeneração ISR)
                   ┌───────────────▼──────────────────────────────┐
                   │ Next.js Server Components (Node/Edge runtime)│
                   │   fetch() com { revalidate, tags }            │
                   └───────────────┬──────────────────────────────┘
                                   │ PostgREST (anon key, RLS read-only)
                   ┌───────────────▼──────────────────────────────┐
                   │ Supabase Postgres                             │
                   │   trigger → Database Webhook                  │
                   └───────────────┬──────────────────────────────┘
                                   │ POST /api/revalidate?secret=…
                                   └──► revalidateTag('menu' | 'events' | 'hours')
```

### Regras
- **Todas as páginas são estáticas (SSG + ISR).** Nenhuma rota usa `cookies()`/`headers()` no caminho de renderização, o que tornaria a rota dinâmica.
- **Dados pelo servidor:** Server Components chamam `src/lib/data/*`. O cliente nunca fala com o Supabase diretamente no MVP (nenhuma chave exposta além de `NEXT_PUBLIC_*` estritamente necessárias).
- **Componentes cliente** apenas onde há interação real: `OpenStatus` (relógio), `TrackedLink` (evento GA4), `ConsentBanner`, filtros de dieta do cardápio.

---

## 3. Estratégia de caching (Vercel Edge)

### 3.1 Camadas

| Camada | O que guarda | Invalidação |
|--------|-------------|-------------|
| **Edge CDN** | HTML/RSC payload de cada rota | Automática quando o Data Cache da rota é revalidado |
| **Next.js Data Cache** | Respostas `fetch` ao Supabase, marcadas com tags | `revalidateTag(tag)` via webhook **ou** tempo (`revalidate`) |
| **Image Optimization Cache** | AVIF/WebP redimensionados | `minimumCacheTTL` = 30 dias; troca de imagem = novo path no Storage |
| **Assets estáticos** (`/_next/static`) | JS/CSS/fontes com hash | `Cache-Control: public, max-age=31536000, immutable` (padrão Next) |

### 3.2 Tags e TTL de segurança

| Tag | Tabelas | TTL fallback (`revalidate`) | Rotas afetadas |
|-----|---------|-----------------------------|----------------|
| `menu` | `menu_categories`, `menu_items` | 3600s | `/`, `/cardapio`, `/vitrine`, `/presentes` |
| `events` | `events` | 900s | `/`, `/agenda`, `sitemap.xml` |
| `hours` | `opening_hours`, `special_hours` | 3600s | layout (JSON-LD), `/` |

O TTL é uma **rede de segurança** caso um webhook falhe; o caminho normal é a revalidação sob demanda (< 60s, RF-07).

### 3.3 Revalidação sob demanda

- Endpoint: `POST /api/revalidate` (`src/app/api/revalidate/route.ts`).
- Autenticação: header `x-revalidate-secret` comparado a `REVALIDATE_SECRET` (comparação em tempo constante).
- Payload: o formato padrão do *Database Webhook* do Supabase (`{ type, table, record, old_record }`). O endpoint mapeia `table → tag`.
- Configuração no Supabase: *Database → Webhooks* → um webhook por tabela de conteúdo, eventos `INSERT/UPDATE/DELETE`, header com o segredo.

### 3.4 "Aberto agora" sem quebrar o cache

O HTML é estático, mas o status depende do relógio. Solução:
1. O servidor embute os horários da semana + exceções dos próximos 14 dias no HTML (pequeno JSON).
2. O componente cliente `OpenStatus` calcula o status no navegador usando `Intl.DateTimeFormat` com `timeZone: 'America/Sao_Paulo'`.
3. Até hidratar, renderiza um placeholder de mesma altura (CLS = 0).

### 3.5 Headers

Configurados em `next.config.ts`:
- `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restritiva.
- CSP será adicionada na Fase 4 após mapear domínios do GA4 (`*.googletagmanager.com`, `*.google-analytics.com`) e do mapa (`frame-src https://www.google.com`).
- **Mapa embutido:** o iframe do Google Maps em `ScheduleLocation` usa `loading="lazy"` e altura fixa (400/450px): fica abaixo da dobra, não afeta LCP nem CLS e só baixa (~500 kB+) quando o usuário rola até ele.

---

## 4. Supabase

- **Esquema:** ver `05-backend-schema.sql`.
- **Acesso:** chave `anon` + RLS com políticas `SELECT` apenas para linhas `is_published = true`. Escrita somente via painel (role `authenticated` do(a) dono(a)) ou `service_role` em scripts.
- **Storage:** bucket público `media` para fotos; caminho versionado (`menu/focaccia-alecrim-v2.jpg`) para não brigar com cache de imagem.
- **Cliente:** `src/lib/supabase/server.ts` cria o client com `global.fetch` customizado que injeta `next: { revalidate, tags }` em cada requisição — assim o Data Cache da Vercel funciona com o SDK.
- **Resiliência:** se as variáveis de ambiente não existirem (dev/preview sem Supabase), a camada de dados retorna listas vazias e a UI mostra estados vazios elegantes — o build nunca falha por falta de dados.

### Variáveis de ambiente

| Variável | Escopo | Uso |
|----------|--------|-----|
| `NEXT_PUBLIC_SITE_URL` | público | URLs canônicas, sitemap, JSON-LD |
| `NEXT_PUBLIC_GA_ID` | público | ID de medição GA4 (`G-XXXXXXX`) |
| `NEXT_PUBLIC_SUPABASE_URL` | público | URL do projeto |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | público | leitura sob RLS |
| `REVALIDATE_SECRET` | **servidor** | autentica webhooks |

---

## 5. Google Analytics 4

### 5.1 Carregamento
- `src/components/analytics/GoogleAnalytics.tsx` injeta `gtag.js` com `strategy="afterInteractive"` — não bloqueia LCP.
- Só é renderizado em produção e quando `NEXT_PUBLIC_GA_ID` existe.
- **Consent Mode v2:** antes de carregar o gtag, define `ad_storage`, `ad_user_data`, `ad_personalization` e `analytics_storage` como `denied`. O `ConsentBanner` (Fase 4) chama `gtag('consent','update', { analytics_storage: 'granted' })`.
- `page_view` automático do GA4 cobre navegações client-side do App Router (*Enhanced measurement → Page changes based on browser history events*).

### 5.2 Eventos de cliques externos

Disparados por `trackOutbound()` em `src/lib/analytics.ts`, usado pelo componente `TrackedLink`. Usa `transport_type: 'beacon'` para não perder o evento quando a página é trocada.

| Evento | Quando | Parâmetros |
|--------|--------|-----------|
| `click_whatsapp` | link `wa.me` | `link_url`, `link_domain`, `placement`, `item_name?` |
| `click_route` | Google Maps / Waze | `link_url`, `link_domain`, `placement`, `provider` |
| `click_booking` | CTA de reserva (agenda, mesa posta, encomenda) | `placement`, `item_name`, `event_id?` |
| `click_instagram` | perfil/post | `link_url`, `placement` |
| `click_phone` | `tel:` | `placement` |

- `placement` identifica de onde veio o clique: `hero`, `sticky_bar`, `menu_item`, `gift_card`, `event_card`, `footer`, `header`.
- Marcar `click_whatsapp`, `click_route`, `click_booking` como **Key Events** no GA4.
- Registrar `placement`, `item_name` e `provider` como **dimensões personalizadas** (escopo evento).

### 5.3 Search Console
- Verificação via `metadata.verification.google` no `layout.tsx` (env opcional `NEXT_PUBLIC_GSC_VERIFICATION`).

---

## 6. SEO técnico

- **Metadata API:** `metadataBase`, `title.template = "%s · Amandia Café Garden"`, `description`, `alternates.canonical`, Open Graph e Twitter por rota.
- **JSON-LD** (`src/lib/schema.ts`):
  - Layout: `CafeOrCoffeeShop` (subtipo de `LocalBusiness`/`FoodEstablishment`) com `address`, `geo`, `telephone`, `openingHoursSpecification`, `servesCuisine`, `hasMenu`, `sameAs` (Instagram), `priceRange`, `acceptsReservations`.
  - `/cardapio`: `Menu` → `MenuSection` → `MenuItem` com `offers`.
  - `/agenda`: `Event` por evento, com `location` apontando para o café.
- `src/app/sitemap.ts` e `src/app/robots.ts` gerados dinamicamente.
- URLs em português, curtas e sem acento: `/cardapio`, `/vitrine`, `/presentes`, `/agenda`, `/o-espaco`.
- `lang="pt-BR"` no `<html>`.

---

## 7. Performance — orçamento

| Recurso | Orçamento |
|---------|-----------|
| JS de primeira carga (home) | ≤ 110 kB (base Next 15 + React 19 ≈ 103 kB; ilhas cliente ≤ 7 kB) |
| CSS | ≤ 15 kB gzip |
| Imagem LCP (hero mobile) | ≤ 60 kB AVIF, `priority`, `sizes="100vw"` |
| Fontes | 2 famílias, subsets `latin`, apenas pesos usados |
| Requisições de terceiros antes do LCP | **0** |

Verificação: Lighthouse CI no pipeline de PR (Fase 5) + Vercel Speed Insights em produção.

---

## 8. Qualidade e convenções

- ESLint (`next/core-web-vitals`, `next/typescript`), Prettier com `prettier-plugin-tailwindcss`.
- Imports absolutos com alias `@/*` → `src/*`.
- Server Components por padrão; arquivos cliente começam com `'use client'` e ficam o menor possível.
- Tipos do banco gerados por `supabase gen types typescript` → `src/types/database.ts` (versão manual enquanto o projeto Supabase não existe).
