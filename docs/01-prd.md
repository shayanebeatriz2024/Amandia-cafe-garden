# 01 · PRD — Product Requirements Document

> **Projeto:** Amandia Café Garden — site institucional e vitrine digital
> **Local:** Capão da Canoa, RS — Litoral Norte Gaúcho
> **Frase-guia:** *"Quando no caminho existe amor, o caminho é bom."*
> **Status:** Fase 1 — Fundação e Documentação

---

## 1. Visão do produto

O Amandia Café Garden é um café-jardim: um lugar onde a experiência começa no caminho até a mesa. O site precisa transmitir essa sensação **antes** da visita — calma, natureza, mesa posta, cheiro de focaccia — e converter essa vontade em **ação concreta**: traçar a rota, chamar no WhatsApp ou reservar um momento.

O site **não** é um e-commerce nem um app. É uma vitrine leve, extremamente rápida e encontrável no Google por quem está em Capão da Canoa procurando "café", "brunch", "café da manhã" ou "cesta de presente".

### Princípios

1. **Rápido como abrir uma porta** — LCP < 1s em 4G, sem *layout shift*.
2. **Encontrável localmente** — Schema.org `LocalBusiness`/`CafeOrCoffeeShop`, Google Business Profile coerente, conteúdo indexável (nada de cardápio em imagem/PDF).
3. **Uma ação por tela** — cada seção leva naturalmente a um dos três CTAs.
4. **O Instagram continua sendo a vitrine viva** — o site organiza e dá permanência ao que hoje está espalhado nos destaques.

---

## 2. Público-alvo

### Persona primária — "A turista de temporada"
- **Quem:** famílias e casais da Grande Porto Alegre, Serra Gaúcha e interior, além de turistas argentinos e uruguaios, que passam de dias a semanas no litoral entre dezembro e março (e em feriados prolongados).
- **Contexto de uso:** **celular**, frequentemente em 4G instável na praia, buscando no Google Maps/Search ou chegando pelo Instagram.
- **Intenção:** "Onde tomar um café bonito/brunch hoje?", "Abre agora?", "Como chego?", "Aceita reserva?".
- **Dor:** informação desatualizada de horário (muda na temporada), cardápio inacessível, falta de rota clara.

### Persona secundária — "O morador que presenteia"
- **Quem:** moradores de Capão da Canoa e cidades vizinhas (Xangri-lá, Atlântida, Arroio do Sal, Tramandaí).
- **Intenção:** encomendar cestas, boxes e doces para datas comemorativas; acompanhar a agenda de eventos.
- **Canal preferido:** WhatsApp.

### Persona terciária — "O visitante botânico/gastronômico"
- Busca experiências estéticas e fotografáveis (garden, mesa posta). Chega via Instagram/Pinterest e compartilha.

---

## 3. Metas de conversão

| # | Conversão | Gatilho no site | Evento GA4 | Meta inicial (temporada) |
|---|-----------|-----------------|-----------|---------------------------|
| C1 | **Rota** | Botão "Como chegar" (Google Maps / Waze) | `click_route` | ≥ 8% das sessões |
| C2 | **Contato via WhatsApp** | Botão "Falar no WhatsApp" (geral, encomendas, presentes) | `click_whatsapp` | ≥ 6% das sessões |
| C3 | **Agendamento** | "Reservar" (eventos da agenda, mesa posta, encomendas) via WhatsApp com mensagem pré-preenchida | `click_booking` | ≥ 2% das sessões |
| C4 | Engajamento social | "Ver no Instagram" | `click_instagram` | métrica de apoio |
| C5 | Ligação | `tel:` | `click_phone` | métrica de apoio |

> Todas as conversões são **cliques de saída** (WhatsApp, Maps, Instagram, telefone). A medição é feita via GA4 com eventos customizados marcados como *Key Events* (ver `02-trd.md §5`).

### Metas de produto (não-conversão)

- **Core Web Vitals** (p75, mobile, CrUX): LCP < 1,0s · INP < 100ms · CLS < 0,05.
- **Lighthouse:** Performance ≥ 98, SEO = 100, Acessibilidade ≥ 95, Best Practices = 100.
- **SEO local:** top 3 no *Local Pack* para "café Capão da Canoa" e "brunch Capão da Canoa" em até 6 meses após lançamento.
- **Atualização sem dev:** dono(a) consegue alterar horário, cardápio e agenda pelo painel do Supabase em < 2 min, refletido no site em < 60s.

---

## 4. Escopo

### 4.1 Dentro do escopo (MVP)

| Módulo | Descrição |
|--------|-----------|
| **Home** | Hero com frase-guia, status "Aberto agora / Fecha às…", CTAs primários, resumo de cada seção. |
| **O Espaço** | Garden e Mesa Posta — galeria otimizada, texto sobre a experiência. |
| **Cardápio** | Focaccias, cafés e demais categorias, em HTML indexável, com preço, descrição e tags (vegano, sem glúten, etc.). |
| **Vitrine** | Doces e salgados do dia/da semana, com destaque de disponibilidade. |
| **Presentes** | Cestas e boxes, com CTA de encomenda via WhatsApp (mensagem pré-preenchida com o nome do item). |
| **Agenda** | Eventos futuros (oficinas, música, datas especiais) com `Event` Schema.org e CTA de reserva. |
| **Produção** | Bastidores — o feito à mão, fornecedores locais (bloco narrativo na home / O Espaço). |
| **Frase-Guia** | Pilar de marca presente no hero, rodapé e páginas de erro. |
| **Horários** | Horário regular + exceções de temporada/feriados, consumidos pelo status "aberto agora" e pelo JSON-LD. |
| **SEO técnico** | Metadata por rota, `sitemap.xml`, `robots.txt`, Open Graph, JSON-LD `CafeOrCoffeeShop`, `Menu`, `Event`. |
| **Analytics** | GA4 com eventos de cliques externos. |

### 4.2 Fora do escopo (MVP)

- Pagamento online / carrinho / checkout.
- Sistema de reservas com calendário próprio (a reserva é conduzida no WhatsApp).
- Login de clientes, programa de fidelidade.
- Blog (avaliar na Fase 2 para SEO de cauda longa).
- Multi-idioma completo (avaliar `es-AR` na Fase 2 por conta dos turistas argentinos/uruguaios).

---

## 5. Requisitos funcionais

| ID | Requisito | Prioridade |
|----|-----------|-----------|
| RF-01 | Exibir status em tempo real "Aberto agora / Fechado — abre às X" baseado em `opening_hours` + `special_hours`, no fuso `America/Sao_Paulo`. | Must |
| RF-02 | Todos os links para WhatsApp devem conter mensagem pré-preenchida contextual (ex.: "Olá! Gostaria de encomendar a Cesta Café da Manhã"). | Must |
| RF-03 | Botão "Como chegar" abre Google Maps (Android/desktop) com destino exato; oferecer Waze como alternativa. | Must |
| RF-04 | Cardápio renderizado no servidor, indexável, agrupado por categoria, com filtros de dieta opcionais no cliente. | Must |
| RF-05 | Itens com `is_available = false` aparecem como "Esgotado hoje" na Vitrine, ou ficam ocultos no Cardápio (configurável). | Should |
| RF-06 | Agenda lista somente eventos futuros publicados, ordenados por data; eventos passados saem do sitemap. | Must |
| RF-07 | Alterações no Supabase refletem no site em até 60s (revalidação sob demanda via webhook). | Must |
| RF-08 | Barra de CTA fixa no rodapé em mobile (Rota · WhatsApp), sem cobrir conteúdo. | Must |
| RF-09 | Cada clique externo dispara evento GA4 com `link_url`, `link_domain` e `placement`. | Must |
| RF-10 | Banner de consentimento de cookies (LGPD) com Consent Mode v2 — GA4 só grava cookies após aceite. | Must |

## 6. Requisitos não funcionais

- **Performance:** ver metas §3. Zero JS bloqueante no caminho crítico; imagens AVIF/WebP com `sizes` corretos; hero com `priority`.
- **Acessibilidade:** WCAG 2.2 AA — contraste ≥ 4.5:1, foco visível, alvos de toque ≥ 44px, `prefers-reduced-motion` respeitado.
- **LGPD:** nenhum dado pessoal coletado no site; GA4 com IP anonimizado (padrão GA4) e consentimento.
- **Manutenibilidade:** conteúdo 100% no Supabase; código tipado de ponta a ponta (TypeScript `strict`).
- **Disponibilidade:** site servido estaticamente pela Vercel Edge; queda do Supabase não derruba o site (última versão em cache continua servida).

---

## 7. Métricas de sucesso e acompanhamento

- **Semanal (temporada):** sessões, taxa de conversão C1–C3, origem (Google orgânico / Maps / Instagram / direto).
- **Mensal:** posição média no Search Console para termos locais, CWV no CrUX, cliques "Rota" no Google Business Profile vs. site.
- **Qualitativo:** perguntas recorrentes no WhatsApp ("abre hoje?", "tem sem glúten?") devem cair — sinal de que o site responde antes.

## 8. Riscos e premissas

| Risco | Mitigação |
|-------|-----------|
| Horário desatualizado na temporada | Tabela `special_hours` + checklist de atualização antes de dez/jan/carnaval. |
| Fotos pesadas vindas do Instagram | Pipeline `next/image` + limite de upload no Storage + guia de exportação no design system. |
| Dados de NAP (nome, endereço, telefone) divergentes entre site, Google e Instagram | Fonte única em `src/lib/site-config.ts` + revisão no Google Business Profile. |
| Dono(a) sem familiaridade com Supabase | Fase 2: painel simplificado ou guia em vídeo. |

> **Dados do negócio (out/2026):** NAP, coordenadas, Plus Code, Instagram, faixa de preço e atributos estão consolidados em `src/lib/site-config.ts`. Ainda pendentes: **Place ID** do Google (formato `ChIJ…`), confirmação dos **dias de funcionamento** (horário oficial confirmado no Instagram: 9h–12h e 14h30–19h30) e a **foto de Open Graph** (`public/images/og-default.jpg`).
