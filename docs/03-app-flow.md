# 03 · App Flow — Experiência do Usuário

> A arquitetura de informação espelha os **destaques do Instagram** do Amandia, para que quem chega da rede social reconheça o caminho — e quem chega do Google encontre tudo sem precisar do Instagram.

---

## 1. Mapa do site

```
/                        Home — o caminho (resumo de tudo + CTAs)
├── /o-espaco            O Espaço — Garden · Mesa Posta · Produção
├── /cardapio            Cardápio — Focaccias · Cafés · (demais categorias)
├── /vitrine             Vitrine — Doces · Salgados (do dia / da semana)
├── /presentes           Presentes — Cestas · Boxes
├── /agenda              Agenda — eventos futuros
├── /sitemap.xml
└── /robots.txt
```

| Destaque no Instagram | Rota | Seção na Home | Conversão principal |
|-----------------------|------|---------------|---------------------|
| O Espaço (Garden, Mesa Posta) | `/o-espaco` | `#espaco` | Rota · Reserva de mesa posta |
| Cardápio (Focaccias, Cafés) | `/cardapio` | `#cardapio` | Rota |
| Vitrine (Doces, Salgados) | `/vitrine` | `#vitrine` | WhatsApp (encomenda) · Rota |
| Presentes (Cestas, Boxes) | `/presentes` | `#presentes` | WhatsApp (encomenda) |
| Agenda | `/agenda` | `#agenda` | Reserva (WhatsApp) |
| Produção | bloco em `/o-espaco` | `#producao` | — (confiança/marca) |
| Frase-Guia | hero + rodapé + 404 | hero | — (marca) |

---

## 2. Navegação global

- **Header** (fixo, translúcido off-white com `backdrop-blur`, 64px): logotipo à esquerda; à direita, links `Espaço · Cardápio · Vitrine · Presentes · Agenda`. Em mobile, menu em *sheet* simples (sem biblioteca), com os mesmos links + CTAs.
- **Barra de ação fixa (mobile, < 768px):** dois botões lado a lado — **Como chegar** (primário, musgo) e **WhatsApp** (secundário, contorno). Respeita `env(safe-area-inset-bottom)`. O `<main>` tem `padding-bottom` equivalente para não cobrir conteúdo.
- **Footer:** frase-guia em serifa itálica, endereço (NAP), horários agrupados ("Segunda a Domingo · 9h – 12h e 14h30 – 19h30"), telefone e Instagram.
- **Seção "Horários e como chegar"** (`ScheduleLocation`, na Home e em `/o-espaco`): endereço com ponto de referência e Plus Code, horários, contato, CTAs (Maps · Waze · WhatsApp) e mapa do Google embutido com carregamento preguiçoso.

---

## 3. Home — "O Caminho"

A home é uma caminhada vertical: cada seção é um passo do caminho até a mesa.

```
┌─────────────────────────────────────────┐
│ HERO                                     │
│  Foto do garden (LCP)                    │
│  "Quando no caminho existe amor,         │
│   o caminho é bom."                      │
│  ● Aberto agora · fecha às 19h           │  ← OpenStatus (client island)
│  [ Como chegar ]  [ WhatsApp ]           │  placement=hero
├─────────────────────────────────────────┤
│ #espaco   O Espaço                       │
│  Garden | Mesa Posta  (2 cards foto)     │
│  → Conhecer o espaço                     │
├─────────────────────────────────────────┤
│ #cardapio  Do forno e da xícara          │
│  Focaccias (3 destaques) · Cafés (3)     │
│  → Ver cardápio completo                 │
├─────────────────────────────────────────┤
│ #vitrine   Na vitrine hoje               │
│  Carrossel horizontal (scroll-snap, CSS) │
│  doces e salgados, selo "Esgotado"       │
├─────────────────────────────────────────┤
│ #presentes  Para presentear              │
│  Cestas e Boxes (2–3 cards)              │
│  [ Encomendar pelo WhatsApp ]            │  placement=gift_card
├─────────────────────────────────────────┤
│ #agenda   Próximos encontros             │
│  Até 3 eventos (data, título, vagas)     │
│  [ Reservar ]                            │  placement=event_card
├─────────────────────────────────────────┤
│ #producao  Feito à mão, devagar          │
│  Texto curto + 1 foto de bastidor        │
├─────────────────────────────────────────┤
│ FOOTER  (frase-guia · NAP · horários)    │
└─────────────────────────────────────────┘
```

**Regras:** seções sem dados (ex.: agenda vazia) não renderizam — nada de "Nenhum evento" na home. Nas páginas internas, o estado vazio tem texto acolhedor + CTA para Instagram.

---

## 4. Fluxos por objetivo

### 4.1 Fluxo "Como chego?" (C1 — Rota) — persona turista

```
Google Search/Maps "café capão da canoa"
   └─► Home (Hero)
         ├─ vê "Aberto agora · fecha às 19h"   (resolve "abre hoje?")
         └─ toca [Como chegar]
               └─► GA4 click_route {placement: hero, provider: google_maps}
               └─► Google Maps com destino (app nativo em mobile)
```
- Link: `https://www.google.com/maps/dir/?api=1&destination=<lat>,<lng>&destination_place_id=<place_id>`.
- Alternativa "Abrir no Waze" no footer e em `/o-espaco`: `https://waze.com/ul?ll=<lat>,<lng>&navigate=yes`.

### 4.2 Fluxo "Quero encomendar" (C2 — WhatsApp) — persona moradora

```
Instagram (destaque Presentes) ─► link na bio ─► /presentes
   └─ escolhe "Box Café da Tarde"
        └─ [Encomendar]  → GA4 click_whatsapp {placement: gift_card, item_name}
             └─► wa.me/55XXXXXXXXXXX?text=Olá! Gostaria de encomendar o Box Café da Tarde. 🌿
```

### 4.3 Fluxo "Reservar um evento" (C3 — Agendamento)

```
/agenda ─► card do evento (data, horário, vagas, preço)
   └─ [Reservar]  → GA4 click_booking {placement: event_card, item_name, event_id}
        └─► wa.me/...?text=Olá! Quero reservar para "Oficina de Focaccia" em 14/12, às 15h.
```
- Evento com `booking_url` próprio (ex.: Sympla) usa o link externo em vez do WhatsApp.
- Evento esgotado (`is_sold_out`) mostra "Lotado — entrar na lista de espera" (também WhatsApp).

### 4.4 Fluxo "O que tem pra comer?" — persona turista/gastronômica

```
Google "focaccia capão da canoa" ─► /cardapio#focaccias (rich result via JSON-LD Menu)
   ├─ filtra "Vegano" / "Sem glúten" (client, sem recarregar)
   └─ rodapé da página: [Como chegar] [WhatsApp]
```

### 4.5 Fluxo "Mesa Posta"

```
/o-espaco ─► seção Mesa Posta (galeria + como funciona + antecedência)
   └─ [Reservar uma mesa posta] → click_booking {placement: mesa_posta}
```

---

## 5. Páginas internas — estrutura comum

1. Cabeçalho da página: eyebrow (categoria), título serifado, 1 parágrafo.
2. Conteúdo (grid/lista).
3. **Bloco de fechamento:** frase-guia curta + CTAs (Rota · WhatsApp).

| Página | Conteúdo específico |
|--------|---------------------|
| `/o-espaco` | Galeria (Garden, Mesa Posta), Produção, como chegar + estacionamento, acessibilidade, pet-friendly (se aplicável). |
| `/cardapio` | Âncoras por categoria (`#focaccias`, `#cafes`…), sticky sub-nav horizontal, itens com nome, descrição, preço, tags de dieta. Sem imagens por item por padrão (performance); imagens só nos destaques. |
| `/vitrine` | Grid de cards com foto, nome, preço, selo "Esgotado hoje". Texto "a vitrine muda todo dia — chame no WhatsApp para reservar". |
| `/presentes` | Cards grandes com foto, o que vem na cesta/box, preço "a partir de", antecedência mínima, CTA de encomenda. |
| `/agenda` | Lista cronológica; cada evento com data destacada (dia grande serifado), horário, local (garden/salão), vagas, preço, CTA. |

---

## 6. Estados e microinterações

| Estado | Comportamento |
|--------|--------------|
| Carregando status de horário | Placeholder com mesma altura (skeleton suave, sem shimmer animado). |
| Aberto | Ponto verde musgo + "Aberto agora · fecha às HH:MM". |
| Fecha em ≤ 60 min | "Fecha em breve · às HH:MM" (tom terracota). |
| Fechado | "Fechado · abre {hoje/amanhã/sexta} às HH:MM". |
| Exceção (feriado/temporada) | Usa `special_hours`; mostra nota (ex.: "Horário de verão"). |
| Hover/foco em CTA | Leve escurecimento + anel de foco `moss-400`; nenhuma animação > 200ms. |
| `prefers-reduced-motion` | Desliga transições de scroll e *fade-ins*. |

## 7. Páginas de erro

- **404:** "Este caminho não levou a lugar nenhum — mas o nosso leva." + frase-guia + link para a Home.
- **500 / erro de dados:** a página continua servindo o último cache; se não houver, mostra contato direto (WhatsApp, endereço).
