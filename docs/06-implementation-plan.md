# 06 · Plano de Implementação — Frontend

> Cada fase termina com algo **deployável** em preview na Vercel e com um critério de aceite verificável. Nenhuma fase depende de conteúdo final para avançar — placeholders tipados seguram o lugar.

---

## Visão geral

| Fase | Nome | Entregável | Estimativa |
|------|------|-----------|-----------|
| 1 | Fundação e Documentação | Docs, estrutura, configs, layout com SEO/GA4 | 1–2 dias |
| 2 | Design System em código | Tokens, fontes, ícones, componentes base | 2–3 dias |
| 3 | Home "O Caminho" | Home completa com dados do Supabase | 3–4 dias |
| 4 | Páginas internas + conversão | Cardápio, Vitrine, Presentes, Agenda, O Espaço; CTAs rastreados; consentimento | 4–5 dias |
| 5 | SEO, performance e QA | JSON-LD por página, Lighthouse CI, a11y, testes | 2–3 dias |
| 6 | Lançamento | Domínio, GBP, Search Console, conteúdo real, handoff | 1–2 dias |

---

## Fase 1 — Fundação e Documentação ✅ (esta entrega)

**Tarefas**
- [x] `docs/01–06` (PRD, TRD, App Flow, Design System, Schema SQL, Plano).
- [x] Estrutura App Router em `src/` com alias `@/*`.
- [x] `tailwind.config.ts` com paleta botânica, fontes, raios e sombras.
- [x] `layout.tsx` com Metadata API, `next/font`, JSON-LD `CafeOrCoffeeShop`, GA4 (Consent Mode v2 padrão *denied*).
- [x] `src/lib/site-config.ts` — fonte única de NAP (placeholders).
- [x] Camada de dados Supabase com cache por tag + `/api/revalidate`.
- [x] `sitemap.ts`, `robots.ts`, `not-found.tsx`.
- [ ] Criar projeto Supabase e rodar `supabase/migrations/0001_initial_schema.sql`.
- [ ] Criar propriedade GA4 e preencher `.env.local`.

**Aceite:** `npm run build` sem erros; `npm run typecheck` limpo; JSON-LD válido no [Rich Results Test](https://search.google.com/test/rich-results).

---

## Fase 2 — Design System em código 🟡 (em andamento)

**Tarefas**
- [x] `globals.css`: variáveis semânticas, base tipográfica, `:focus-visible`, `prefers-reduced-motion`.
- [x] `src/components/ui/`: `ButtonLink` + `TrackedLink` (variantes em `button-styles.ts`), `SectionHeading`, `Chip`, `RatingBadge`, `icons.tsx` (eyebrow e container ficaram como classes utilitárias, sem componente).
- [x] `GuidingQuote` (hero, footer, inline).
- [x] Página `/styleguide` — só existe em desenvolvimento (404 em produção), bloqueada no `robots` e fora do sitemap. (Pastas com `_` são privadas no App Router e não viram rota.)
- [x] `Header` com menu mobile acessível (`<dialog>` nativo), `Footer` com horários agrupados, `StickyActionBar`.
- [x] Seções: `Hero`, `Highlights`, `Amenities` (pet friendly, LGBTQ+, garden, celebrações), `ScheduleLocation` (horários + mapa embutido).
- [x] Dados reais do negócio em `site-config.ts` + JSON-LD (`amenityFeature`, `hasMap`, `petsAllowed`).
- [ ] Revisão do styleguide com o(a) cliente.
- [ ] Ícones de cardápio específicos (`wheat`, `cake`) para Vitrine/Presentes.

**Aceite:** todos os componentes navegáveis por teclado; contraste conferido; styleguide aprovado pelo(a) cliente.

---

## Fase 3 — Home "O Caminho"

**Tarefas**
1. `Hero` com imagem LCP (`priority`, `fetchPriority="high"`, `sizes`), frase-guia, CTAs.
2. `OpenStatus` (client island) consumindo horários serializados — testes unitários da lógica de horário (virada de dia, exceções, turnos duplos).
3. Seções: `EspacoPreview`, `CardapioPreview` (itens `is_featured`), `VitrineCarousel` (scroll-snap CSS, sem JS), `PresentesPreview`, `AgendaPreview` (até 3), `Producao`.
4. Seções condicionais (não renderizam sem dados).
5. Conectar `src/lib/data/*` ao Supabase real; testar webhook de revalidação em preview.

**Aceite:** LCP < 1s em Lighthouse mobile (Moto G Power, 4G lento simulado); CLS < 0.05; alteração no Supabase visível em < 60s.

---

## Fase 4 — Páginas internas e conversão

**Tarefas**
1. `/cardapio`: sub-nav sticky de categorias, `MenuItemRow`, filtros de dieta (client, estado na URL `?dieta=vegano`).
2. `/vitrine`: grid `ProductCard`, selo "Esgotado hoje".
3. `/presentes`: cards grandes, antecedência, CTA WhatsApp com mensagem contextual (`buildWhatsAppUrl`).
4. `/agenda`: `EventCard`, ordenação, link externo vs. WhatsApp, estados lotado/cancelado.
5. `/o-espaco`: galeria (Garden, Mesa Posta), Produção, como chegar (Maps + Waze).
6. `ConsentBanner` LGPD → `gtag('consent','update')`; preferência em `localStorage`.
7. Revisar todos os `placement` dos eventos GA4 e validar no **DebugView**.

**Aceite:** os 5 eventos aparecem no DebugView com parâmetros corretos; nenhum evento antes do consentimento grava cookie `_ga`.

---

## Fase 5 — SEO, performance e QA

**Tarefas**
1. JSON-LD por página: `Menu` (`/cardapio`), `Event` (`/agenda`), `BreadcrumbList`.
2. Metadata e Open Graph por rota; imagem OG gerada com `next/og` (`opengraph-image.tsx`) usando a paleta.
3. Lighthouse CI no GitHub Actions com *budgets* do TRD §7 (falha o PR se estourar).
4. Auditoria a11y: axe + navegação por teclado + leitor de tela (NVDA/VoiceOver).
5. Testes: Vitest para `lib/` (horários, URLs de WhatsApp/Maps, mapeamento de schema); Playwright smoke test das rotas e cliques de CTA.
6. Headers de segurança + CSP.

**Aceite:** Lighthouse ≥ 98/100/95/100 em todas as rotas; Rich Results sem erros; testes verdes no CI.

---

## Fase 6 — Lançamento

**Tarefas**
1. Confirmar com o café: endereço, coordenadas, `place_id`, telefone/WhatsApp, horários de temporada, Instagram.
2. Domínio na Vercel + redirecionamento `www` → apex (ou inverso), HTTPS.
3. Google Search Console: verificação, envio do sitemap.
4. Google Business Profile: site, horários e categorias idênticos ao site (consistência NAP).
5. GA4: Key Events, dimensões personalizadas, filtro de tráfego interno.
6. Popular Supabase com cardápio, vitrine, presentes e agenda reais (fotos exportadas conforme design system §7).
7. Handoff: guia curto (texto + vídeo) de como editar conteúdo no Supabase.

**Aceite:** site no ar no domínio final; "Amandia Café Garden" retorna o site + painel do GBP; primeira semana de dados no GA4.

---

## Backlog pós-lançamento (Fase 7+)

- Versão `es` (turistas argentinos/uruguaios) com `hreflang`.
- Blog/guia local ("roteiro de um dia em Capão da Canoa") para SEO de cauda longa.
- Painel de edição simplificado (Next.js `/admin` com Supabase Auth) se o painel do Supabase for difícil para a equipe.
- Integração do feed do Instagram (apenas se não prejudicar performance — via build/ISR, nunca embed client-side).
