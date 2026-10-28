# Amandia Café Garden

> *Quando no caminho existe amor, o caminho é bom.*

Site do Amandia Café Garden — café-jardim em Capão da Canoa, RS.
Next.js (App Router) · TypeScript · Tailwind CSS · Supabase · Vercel.

## Documentação

| Doc | Conteúdo |
|-----|----------|
| [01-prd.md](docs/01-prd.md) | Escopo, público, metas de conversão |
| [02-trd.md](docs/02-trd.md) | Stack, caching na Vercel Edge, GA4 |
| [03-app-flow.md](docs/03-app-flow.md) | Mapa do site e fluxos de usuário |
| [04-design-system.md](docs/04-design-system.md) | Tokens, tipografia, ícones |
| [05-backend-schema.sql](docs/05-backend-schema.sql) | Esquema Supabase + RLS |
| [06-implementation-plan.md](docs/06-implementation-plan.md) | Fases de implementação |

## Rodando localmente

```bash
cp .env.example .env.local   # preencha as variáveis
npm install
npm run dev
```

Sem as variáveis do Supabase o site funciona com estados vazios.

## Estrutura

```
src/
├── app/                    # Rotas (App Router)
│   ├── layout.tsx          # Metadata, fontes, JSON-LD LocalBusiness, GA4
│   ├── page.tsx            # Home
│   ├── o-espaco/ cardapio/ vitrine/ presentes/ agenda/
│   ├── api/revalidate/     # Webhook Supabase → revalidateTag
│   ├── sitemap.ts · robots.ts · not-found.tsx · icon.svg
├── components/
│   ├── analytics/          # GoogleAnalytics (Consent Mode v2)
│   ├── layout/             # Header, Footer, StickyActionBar
│   ├── sections/           # Hero, PageHeader, MenuSectionList
│   ├── seo/                # JsonLd
│   └── ui/                 # TrackedLink, icons
├── lib/
│   ├── data/               # menu, events, hours (Supabase + cache tags)
│   ├── supabase/server.ts  # cliente com Data Cache da Vercel
│   ├── analytics.ts        # eventos GA4 de clique externo
│   ├── links.ts            # WhatsApp, Maps, Waze, telefone
│   ├── schema.ts           # JSON-LD
│   └── site-config.ts      # NAP — fonte única (⚠️ placeholders)
└── types/database.ts
supabase/migrations/        # SQL para `supabase db push`
```
