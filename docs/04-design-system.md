# 04 · Design System — "Botânico Orgânico"

> Minimalismo orgânico: muito respiro, papel off-white, verde musgo profundo, tipografia serifada com alma editorial. A interface deve parecer um cardápio impresso num papel bom — nunca um app genérico.

Implementação: tokens em [`tailwind.config.ts`](../tailwind.config.ts) e variáveis em [`src/app/globals.css`](../src/app/globals.css).

> **v3 — Direção de arte "solar & lúdica" (out/2026)**, baseada nos flyers oficiais (Garden Bazar, Mini Festival de Focaccia):
> - **Fontes:** `font-handwriting` (Caveat — lettering, destaques `<em>` em títulos), `font-display-heavy` (Plus Jakarta Sans 800 — chamadas em caixa-alta, nomes dos pacotes, preços), `font-sans` (Plus Jakarta Sans — texto), `font-serif` (Lora — títulos).
> - **Cores `amandia-*`:** green `#2F5241` (contraste principal), orange `#F07D2B` e pink `#F3839F` (**só ornamento** — 2,6:1 e 2,3:1), butter `#FFF1B5`, cream `#FAF8F5`. Para texto colorido use `amandia-orange-ink` `#A84D0C` (5,3:1) e `amandia-pink-ink` `#B8335A` (5,4:1); fundos de badge em `*-tint`.
> - **Micro-ilustrações** (`components/ui/doodles.tsx`): `Sparkle` (4 pontas), `DoodleHeart`, `SunBurst`, `SunLeaf`, `Twinkles`. **Badges** (`SectionBadge`) no topo de cada capítulo: "Lugar de gente boa", "Celebrações", "Receita da casa", "Curadoria afetiva", "Vem pro Garden".

> **v2 — "Light & Refined" (out/2026).** Redesign claro e editorial: os valores abaixo substituem os da v1 nas tabelas seguintes (os nomes de token foram mantidos).
>
> | Papel | Hex | Token |
> |---|---|---|
> | Fundo global (linho natural) | `#FAF8F5` | `linen-100` / `bg` |
> | Cards | `#FFFFFF` + `border-[#EBE7DF]` + `shadow-hairline` (0 4px 20px rgba(0,0,0,.04)) | classe `.card` |
> | Títulos (verde nobre) | `#1F3728` | `moss-900` / `heading` · botão primário |
> | Corpo | `#3D4A41` | `bark-700` / `ink` |
> | Verde oliva (links, hover) | `#476A52` | `moss-600` |
> | Dourado terracota (ornamentos) | `#C28E58` — só elementos gráficos (2,7:1) | `clay-500` |
> | Dourado para texto | `#8E6033` (5,1:1) | `clay-700` |
> | Identidade (stories) | teal `#3C6A63`, laranja `#E0943F`, blush `#F6B9B2` | `brand-*` |
>
> Narrativa em capítulos (I–V) com `ChapterHeading` (numeral romano + fio dourado). Botões em pílula. Fotos reais em `public/images/` (recortes dos stories; originais em `assets/originais/`).

---

## 1. Princípios visuais

1. **Papel, não tela.** Fundo off-white quente (`linen`), nunca branco puro.
2. **Verde é estrutura, terracota é emoção.** O musgo carrega marca, textos e CTAs primários; a terracota aparece em ≤ 5% da tela (estados de atenção, detalhes).
3. **Tipografia faz o trabalho decorativo.** Sem ornamentos, gradientes ou sombras dramáticas — a serifa e o espaçamento dão sofisticação.
4. **Curvas orgânicas, com moderação.** Raios suaves em cards e imagens; uma forma de folha/arco por seção no máximo.
5. **Fotografia é protagonista.** Luz natural, tons quentes, verde abundante. A UI recua para a foto aparecer.

---

## 2. Paleta

### 2.1 Cores de marca

| Token | Hex | Uso |
|-------|-----|-----|
| `moss-50` | `#F3F5EE` | Fundos de destaque muito sutis |
| `moss-100` | `#E3E8D7` | Fundos de chips/tags |
| `moss-200` | `#C8D2B3` | Bordas suaves sobre linen |
| `moss-300` | `#A6B588` | Ilustrações, divisores |
| `moss-400` | `#839660` | Anel de foco, ícones secundários |
| `moss-500` | `#647A45` | Ícones, links em hover |
| `moss-600` | `#4E6136` | **Primária** — CTAs, links |
| `moss-700` | `#3D4C2B` | CTA hover, títulos |
| `moss-800` | `#303B23` | Texto de títulos sobre linen |
| `moss-900` | `#262F1D` | Fundo de seções escuras (footer) |
| `moss-950` | `#141A0F` | Overlay de fotos |

| Token | Hex | Uso |
|-------|-----|-----|
| `linen-50` | `#FDFCF8` | Cartões sobre fundo linen |
| `linen-100` | `#F8F5EC` | **Fundo base da página** |
| `linen-200` | `#F0EBDD` | Seções alternadas |
| `linen-300` | `#E4DCC7` | Bordas, divisores |
| `linen-400` | `#D2C6A8` | Placeholder de imagem |

| Token | Hex | Uso |
|-------|-----|-----|
| `bark-500` | `#7A6E5D` | Texto auxiliar (legendas) |
| `bark-700` | `#4A4237` | Texto corrido |
| `bark-900` | `#2A251F` | Texto de alto contraste |

| Token | Hex | Uso |
|-------|-----|-----|
| `clay-300` | `#E2B49A` | Detalhes, ilustração |
| `clay-500` | `#C27A56` | **Acento** — "fecha em breve", selos |
| `clay-700` | `#8F5236` | Texto de acento sobre linen (contraste AA) |

| Token | Hex | Uso |
|-------|-----|-----|
| `sage-200` | `#D9E0D2` | Fundos alternativos frescos |
| `sage-400` | `#A9B89E` | Folhagens em ilustração |

### 2.2 Tokens semânticos (CSS variables)

| Variável | Valor | Papel |
|----------|-------|-------|
| `--color-bg` | `linen-100` | fundo da página |
| `--color-surface` | `linen-50` | cards |
| `--color-text` | `bark-700` | texto corrido |
| `--color-heading` | `moss-800` | títulos |
| `--color-muted` | `bark-500` | legendas, metadados |
| `--color-primary` | `moss-600` | CTA, links |
| `--color-primary-hover` | `moss-700` | hover |
| `--color-accent` | `clay-500` | atenção |
| `--color-border` | `linen-300` | divisores |
| `--color-focus` | `moss-400` | anel de foco |

### 2.3 Contraste (WCAG 2.2)

| Combinação | Razão | Resultado |
|-----------|--------------|-----------|
| `bark-700` sobre `linen-100` | 9.1:1 | AAA |
| `moss-800` sobre `linen-100` | 10.9:1 | AAA |
| `moss-600` sobre `linen-100` (links) | 6.2:1 | AA |
| `linen-50` sobre `moss-600` (botão) | 6.6:1 | AA |
| `bark-500` sobre `linen-100` (legenda) | 4.6:1 | AA (só texto ≥ 14px) |
| `clay-700` sobre `linen-100` | 5.6:1 | AA |
| `clay-500` sobre `linen-100` | 3.1:1 | **Apenas** ícones/elementos gráficos, nunca texto |

> Valide qualquer nova combinação no WebAIM Contrast Checker antes de usar.

---

## 3. Tipografia

| Papel | Família | Pesos | Fonte | Variável |
|-------|---------|-------|-------|----------|
| Display / títulos | **Cormorant Garamond** | 500, 600 + itálico 500 | Google Fonts via `next/font` | `--font-serif` |
| Texto / UI | **Inter** | variável (400–600) | Google Fonts via `next/font` | `--font-sans` |

Por quê: Cormorant tem contraste alto e itálico caligráfico — perfeito para a frase-guia e nomes de pratos; Inter garante legibilidade em telas pequenas para preços, horários e botões.

### Escala (mobile → desktop, fluida com `clamp`)

| Token | Tamanho | Line-height | Família | Uso |
|-------|---------|-------------|---------|-----|
| `text-display` | `clamp(2.5rem, 6vw + 1rem, 4.5rem)` | 1.05 | serif 500 | Frase-guia no hero |
| `text-h1` | `clamp(2.25rem, 4vw + 1rem, 3.5rem)` | 1.1 | serif 500 | Título de página |
| `text-h2` | `clamp(1.75rem, 2.5vw + 1rem, 2.5rem)` | 1.15 | serif 500 | Título de seção |
| `text-h3` | `1.5rem` | 1.25 | serif 600 | Nome de item/card |
| `text-body` | `1rem` (16px) | 1.65 | sans 400 | Texto corrido |
| `text-small` | `0.875rem` | 1.5 | sans 400 | Descrição de item |
| `text-eyebrow` | `0.75rem`, `tracking-[0.18em]`, uppercase | 1.4 | sans 500 | Rótulo acima de títulos |
| `text-price` | `1rem`, `tabular-nums` | 1 | sans 500 | Preços, horários |

**Regras**
- Títulos em `moss-800`; itálico serifado reservado para frase-guia, citações e um destaque por título (ex.: "Do forno *e da xícara*").
- Medida de linha: 60–72 caracteres (`max-w-prose`).
- Nunca usar a serifa abaixo de 18px.

---

## 4. Espaçamento, grid e forma

- **Base 4px** (escala Tailwind padrão).
- **Ritmo de seção:** `py-20` mobile / `py-32` desktop (`section` token = `clamp(5rem, 8vw, 8rem)`).
- **Container:** `max-w-6xl` (72rem) com `px-5` mobile / `px-8` desktop; texto longo em `max-w-prose`.
- **Grid:** 4 colunas mobile, 12 desktop; cards de cardápio em 1 → 2 → 3 colunas.

| Token de raio | Valor | Uso |
|---------------|-------|-----|
| `rounded-sm` | 4px | chips, inputs |
| `rounded-xl` | 12px | botões |
| `rounded-2xl` | 20px | cards |
| `rounded-leaf` | `2rem 0.5rem` | imagem de destaque (forma de folha) |
| `rounded-arch` | `999px 999px 1rem 1rem` | foto do hero/espaço (arco de jardim) |

| Token de sombra | Valor | Uso |
|-----------------|-------|-----|
| `shadow-soft` | `0 1px 2px rgb(42 37 31 / .04), 0 8px 24px -12px rgb(42 37 31 / .12)` | cards |
| `shadow-lift` | `0 2px 4px rgb(42 37 31 / .05), 0 16px 40px -16px rgb(42 37 31 / .2)` | hover de card |

---

## 5. Iconografia

- **Estilo:** traço (line), `stroke-width: 1.5`, cantos e terminações arredondados, grid 24×24, sem preenchimento.
- **Cor:** `currentColor` (herda do texto).
- **Implementação:** SVG inline em `src/components/ui/icons.tsx` — sem biblioteca de ícones no bundle. Referência de desenho: Lucide/Phosphor *Light* (copiar apenas os paths necessários, respeitando a licença MIT/ISC).
- **Conjunto inicial:** `leaf`, `coffee`, `wheat` (focaccia), `cake` (doces), `gift` (presentes), `calendar` (agenda), `map-pin` (rota), `whatsapp`, `instagram`, `clock` (horário), `sun` (garden), `utensils` (mesa posta), `heart` (frase-guia), `arrow-right`.
- Ícones decorativos com `aria-hidden="true"`; ícones-botão sempre com `aria-label`.

---

## 6. Componentes base

| Componente | Variantes | Notas |
|-----------|-----------|-------|
| `Button` / `TrackedLink` | `primary` (musgo cheio), `secondary` (contorno musgo), `ghost` | Altura mínima 48px; ícone opcional à esquerda; nunca mais de 2 CTAs lado a lado. |
| `Eyebrow` | — | Uppercase, tracking largo, `moss-600`. |
| `SectionHeading` | `left`, `center` | Eyebrow + h2 + parágrafo opcional. |
| `MenuItemRow` | `compact`, `featured` | Nome (serif) · linha pontilhada · preço; descrição abaixo; tags de dieta como chips `moss-100`. |
| `ProductCard` | `vitrine`, `gift` | Foto 4:5 `rounded-2xl`, selo "Esgotado" em `clay-700`. |
| `EventCard` | — | Dia grande serifado à esquerda, mês em eyebrow; título, horário, vagas; CTA. |
| `OpenStatus` | `inline`, `pill` | Ponto 8px + texto; cores conforme estado (§ App Flow 6). |
| `StickyActionBar` | — | Só mobile; `bg-linen-50/90 backdrop-blur`, borda superior `linen-300`. |
| `GuidingQuote` | `hero`, `footer`, `inline` | Frase-guia em serif itálico, com ícone `heart` ou folha. |

### Estados interativos
- Foco: `outline-2 outline-offset-2 outline-moss-400` (sempre visível com `:focus-visible`).
- Hover: mudança de cor apenas (150ms ease-out). Nada de *scale*.
- Desabilitado: opacidade 50% + `cursor-not-allowed`.

---

## 7. Imagem e movimento

- **Fotos:** proporções 4:5 (cards), 3:2 (galeria), 16:9 ou arco (hero). Exportar a 2× da maior largura exibida, JPEG qualidade 80 — o `next/image` gera AVIF/WebP.
- Toda imagem tem `alt` descritivo ("Mesa posta com louça floral no jardim do Amandia") — é SEO de imagem local também.
- `placeholder="blur"` com `blurDataURL` de 10px em tons linen.
- **Movimento:** transições ≤ 200ms; *fade-in* de seção opcional via CSS `@starting-style`/`animation-timeline: view()` com fallback estático. Tudo desativado em `prefers-reduced-motion`.

---

## 8. Voz e microcopy

- Português do Brasil, segunda pessoa informal ("você"), frases curtas, acolhedoras.
- Verbos de convite, não de venda: "Venha", "Reserve seu momento", "Chame a gente".
- Evitar: superlativos vazios ("o melhor café"), exclamações em excesso, jargão.
- A frase-guia é sagrada: sempre exatamente *"Quando no caminho existe amor, o caminho é bom."* — sem variações.
