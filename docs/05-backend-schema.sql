-- =============================================================================
-- 05 · Backend Schema — Amandia Café Garden (Supabase / Postgres 15+)
-- =============================================================================
-- Conteúdo editorial do site: cardápio, vitrine, presentes, agenda e horários.
-- Leitura pública (anon) apenas de linhas publicadas, via RLS.
-- Escrita: usuários autenticados (equipe do café) pelo painel do Supabase.
--
-- Uma cópia deste arquivo vive em supabase/migrations/ para uso com a CLI:
--   supabase db push
-- =============================================================================

create extension if not exists "pgcrypto";   -- gen_random_uuid()

-- -----------------------------------------------------------------------------
-- Tipos
-- -----------------------------------------------------------------------------

-- Em que seção do site a categoria aparece (espelha os destaques do Instagram)
create type public.menu_section as enum (
  'cardapio',   -- Focaccias, Cafés, Bebidas, Brunch...
  'vitrine',    -- Doces, Salgados
  'presentes',  -- Cestas & Boxs
  'mesa_posta'  -- Pacotes Mesa Posta & Celebrações (Mar, Terra, Sol, Lua)
);

create type public.dietary_tag as enum (
  'vegano',
  'vegetariano',
  'sem_gluten',
  'sem_lactose',
  'contem_nozes'
);

create type public.event_status as enum (
  'rascunho',
  'publicado',
  'cancelado'
);

-- -----------------------------------------------------------------------------
-- Utilitário: updated_at automático
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- 1. Categorias do cardápio / vitrine / presentes
-- -----------------------------------------------------------------------------
create table public.menu_categories (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique
                  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),          -- âncora: /cardapio#focaccias
  name          text not null check (char_length(name) between 2 and 60),
  description   text check (char_length(description) <= 280),
  section       public.menu_section not null default 'cardapio',
  icon          text,                                               -- nome do ícone em icons.tsx (ex.: 'wheat')
  sort_order    smallint not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index menu_categories_section_order_idx
  on public.menu_categories (section, sort_order)
  where is_published;

create trigger menu_categories_updated_at
  before update on public.menu_categories
  for each row execute function public.set_updated_at();

comment on table public.menu_categories is
  'Agrupadores de itens. section define a página: cardapio | vitrine | presentes.';

-- -----------------------------------------------------------------------------
-- 2. Itens individuais
-- -----------------------------------------------------------------------------
create table public.menu_items (
  id              uuid primary key default gen_random_uuid(),
  category_id     uuid not null references public.menu_categories (id) on delete restrict,
  slug            text not null unique
                    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name            text not null check (char_length(name) between 2 and 80),
  description     text check (char_length(description) <= 400),
  -- Preço em centavos (evita erro de ponto flutuante). Nulo = "sob consulta".
  price_cents     integer check (price_cents is null or price_cents >= 0),
  price_label     text check (char_length(price_label) <= 40),        -- ex.: 'a partir de', 'fatia', '500g'
  image_path      text,                                               -- caminho no bucket 'media'
  image_alt       text check (char_length(image_alt) <= 160),
  dietary_tags    public.dietary_tag[] not null default '{}',
  is_featured     boolean not null default false,                     -- aparece na Home
  is_available    boolean not null default true,                      -- false = "Esgotado hoje"
  lead_time_hours smallint check (lead_time_hours is null or lead_time_hours >= 0), -- antecedência p/ encomendas
  includes        text[] not null default '{}',                       -- o que vem no pacote/cesta (lista exibida no card)
  sort_order      smallint not null default 0,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint menu_items_image_alt_required
    check (image_path is null or image_alt is not null)              -- toda foto precisa de alt (a11y + SEO)
);

create index menu_items_category_order_idx
  on public.menu_items (category_id, sort_order)
  where is_published;

create index menu_items_featured_idx
  on public.menu_items (is_featured)
  where is_published and is_featured;

create trigger menu_items_updated_at
  before update on public.menu_items
  for each row execute function public.set_updated_at();

comment on column public.menu_items.price_cents is 'Preço em centavos de BRL. 4200 = R$ 42,00.';
comment on column public.menu_items.lead_time_hours is 'Antecedência mínima para encomenda (cestas/boxes).';

-- -----------------------------------------------------------------------------
-- 3. Agenda de eventos
-- -----------------------------------------------------------------------------
create table public.events (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique
                    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title           text not null check (char_length(title) between 3 and 100),
  summary         text check (char_length(summary) <= 280),            -- usado no card e em meta description
  description     text,
  starts_at       timestamptz not null,
  ends_at         timestamptz,
  location_label  text default 'Garden',                               -- 'Garden', 'Salão', 'Mesa Posta'
  image_path      text,
  image_alt       text,
  price_cents     integer check (price_cents is null or price_cents >= 0), -- nulo = gratuito/consultar
  capacity        smallint check (capacity is null or capacity > 0),
  is_sold_out     boolean not null default false,
  booking_url     text check (booking_url is null or booking_url ~ '^https://'), -- externo (Sympla etc.); nulo = WhatsApp
  status          public.event_status not null default 'rascunho',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint events_dates_valid check (ends_at is null or ends_at > starts_at),
  constraint events_image_alt_required check (image_path is null or image_alt is not null)
);

create index events_upcoming_idx
  on public.events (starts_at)
  where status = 'publicado';

create trigger events_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 4. Horários regulares (um registro por dia/turno)
-- -----------------------------------------------------------------------------
-- weekday segue ISO-8601: 1 = segunda ... 7 = domingo.
-- Dois turnos no mesmo dia = duas linhas. Dia sem linha = fechado.
create table public.opening_hours (
  id          uuid primary key default gen_random_uuid(),
  weekday     smallint not null check (weekday between 1 and 7),
  opens_at    time not null,
  closes_at   time not null,
  -- Temporada: permite conjuntos de horário distintos (ex.: verão x inverno).
  valid_from  date,
  valid_until date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint opening_hours_range check (closes_at > opens_at),
  constraint opening_hours_validity check (
    valid_from is null or valid_until is null or valid_until >= valid_from
  )
);

create index opening_hours_weekday_idx on public.opening_hours (weekday, opens_at);

create trigger opening_hours_updated_at
  before update on public.opening_hours
  for each row execute function public.set_updated_at();

comment on table public.opening_hours is
  'Horário semanal. Fuso de referência: America/Sao_Paulo. valid_from/valid_until permitem horário de temporada.';

-- -----------------------------------------------------------------------------
-- 5. Exceções de horário (feriados, eventos fechados, férias coletivas)
-- -----------------------------------------------------------------------------
create table public.special_hours (
  id          uuid primary key default gen_random_uuid(),
  date        date not null,
  is_closed   boolean not null default false,
  opens_at    time,
  closes_at   time,
  note        text check (char_length(note) <= 120),   -- ex.: 'Natal', 'Evento privado'
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint special_hours_shape check (
    (is_closed and opens_at is null and closes_at is null)
    or (not is_closed and opens_at is not null and closes_at is not null and closes_at > opens_at)
  )
);

create unique index special_hours_date_open_idx
  on public.special_hours (date, opens_at) nulls not distinct;   -- impede dois "fechado" no mesmo dia

create trigger special_hours_updated_at
  before update on public.special_hours
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.menu_categories enable row level security;
alter table public.menu_items      enable row level security;
alter table public.events          enable row level security;
alter table public.opening_hours   enable row level security;
alter table public.special_hours   enable row level security;

-- Leitura pública: somente conteúdo publicado
create policy "Public read published categories"
  on public.menu_categories for select
  to anon, authenticated
  using (is_published);

create policy "Public read published items"
  on public.menu_items for select
  to anon, authenticated
  using (
    is_published
    and exists (
      select 1 from public.menu_categories c
      where c.id = menu_items.category_id and c.is_published
    )
  );

create policy "Public read published events"
  on public.events for select
  to anon, authenticated
  using (status = 'publicado');

create policy "Public read opening hours"
  on public.opening_hours for select
  to anon, authenticated
  using (true);

create policy "Public read special hours"
  on public.special_hours for select
  to anon, authenticated
  using (true);

-- Escrita: equipe autenticada. Restrinja ainda mais (ex.: tabela de staff ou
-- claim customizada) se houver usuários autenticados que não sejam da equipe.
create policy "Staff manage categories" on public.menu_categories
  for all to authenticated using (true) with check (true);
create policy "Staff manage items" on public.menu_items
  for all to authenticated using (true) with check (true);
create policy "Staff manage events" on public.events
  for all to authenticated using (true) with check (true);
create policy "Staff manage opening hours" on public.opening_hours
  for all to authenticated using (true) with check (true);
create policy "Staff manage special hours" on public.special_hours
  for all to authenticated using (true) with check (true);

-- -----------------------------------------------------------------------------
-- View de leitura otimizada (1 requisição para a página de cardápio)
-- -----------------------------------------------------------------------------
-- security_invoker = true → a view respeita o RLS de quem consulta (anon).
create or replace view public.menu_public
with (security_invoker = true) as
select
  c.id            as category_id,
  c.slug          as category_slug,
  c.name          as category_name,
  c.description   as category_description,
  c.section,
  c.icon          as category_icon,
  c.sort_order    as category_order,
  i.id,
  i.slug,
  i.name,
  i.description,
  i.price_cents,
  i.price_label,
  i.image_path,
  i.image_alt,
  i.dietary_tags,
  i.is_featured,
  i.is_available,
  i.lead_time_hours,
  i.includes,
  i.sort_order
from public.menu_categories c
join public.menu_items i on i.category_id = c.id;

-- -----------------------------------------------------------------------------
-- Storage: bucket público para fotos
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 2097152, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

create policy "Public read media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

create policy "Staff upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

create policy "Staff update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media');

create policy "Staff delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');

-- -----------------------------------------------------------------------------
-- Seed — catálogo comercial (out/2026), transcrito dos cardápios oficiais
-- -----------------------------------------------------------------------------
insert into public.menu_categories (slug, name, description, section, icon, sort_order) values
  ('mesa-posta',           'Mesa Posta & Celebrações', 'Mesas preparadas no Garden para celebrar quem você ama.', 'mesa_posta', 'utensils', 10),
  ('sanduiches-focaccias', 'Focaccias Feitas Aqui',    'Massa de focaccia preparada na casa, para sanduíches e lanches de forno.', 'cardapio', 'wheat', 10),
  ('cafes-especiais',      'Cafés Especiais',          'Grãos especiais da Guria Coffee Roasters, passados com calma e também à venda para levar.', 'cardapio', 'coffee', 20),
  ('bebidas',              'Bebidas para Aconchegar',  'Para acompanhar o café, a sua Mesa Posta e as celebrações.', 'cardapio', 'coffee', 30),
  ('doces',                'Brownies & Doces Finos',   'Feitos à mão, para adoçar o caminho.', 'vitrine', 'cake', 10),
  ('cestas-boxs',          'Cestas & Boxs',            'Cada cesta e box Amandia é preparada de forma artesanal, com ingredientes frescos e muita calma.', 'presentes', 'gift', 10)
on conflict (slug) do nothing;

-- Pacotes da Mesa Posta (preço por pessoa; agendamento com 48 h de antecedência)
insert into public.menu_items (category_id, slug, name, price_cents, price_label, lead_time_hours, includes, sort_order, is_featured)
select c.id, v.slug, v.name, v.price_cents, 'por pessoa', 48, v.includes, v.sort_order, true
from public.menu_categories c
cross join (values
  ('mesa-posta-mar', 'Mar', 4790, 10, array[
    'Pães de queijo', 'Bolo artesanal de cenoura com cobertura de chocolate', 'Frutas da estação']),
  ('mesa-posta-terra', 'Terra', 6290, 20, array[
    'Sanduíches no pão focaccia (requeijão cremoso, salame, tomate e alface)', 'Pães de queijo',
    'Pizza de sardinha (um clássico da casa)', 'Bolo artesanal de cenoura com cobertura de chocolate',
    'Brownies artesanais decorados', 'Frutas da estação']),
  ('mesa-posta-sol', 'Sol', 7590, 30, array[
    'Sanduíches no pão focaccia (requeijão cremoso, salame, tomate e alface)', 'Pães de queijo',
    'Croissants caprese (tomate cereja, mussarela de búfala maçaricada, rúcula e pesto)',
    'Bolo artesanal de cenoura com cobertura de chocolate', 'Brownies artesanais decorados',
    'Mini banoffees', 'Frutas da estação']),
  ('mesa-posta-lua', 'Lua', 11990, 40, array[
    'Estilo tábua de frios', 'Queijos especiais', 'Seleção de frios nobres', 'Frutas da estação',
    'Mix de grãos', 'Sanduíches no pão focaccia (requeijão cremoso, salame, tomate e alface)',
    'Pastas artesanais', 'Geleia de abacaxi com pimenta', 'Brownies artesanais decorados', 'Mini banoffees'])
) as v(slug, name, price_cents, sort_order, includes)
where c.slug = 'mesa-posta'
on conflict (slug) do nothing;

-- Demais itens (preço nulo = ainda não informado)
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, sort_order)
select c.id, v.slug, v.name, v.description, v.price_cents, v.price_label, v.sort_order
from (values
  ('sanduiches-focaccias', 'sanduiche-focaccia', 'Sanduíche no pão focaccia', 'Requeijão cremoso, salame, tomate e alface.', null::int, null, 10),
  ('sanduiches-focaccias', 'croissant-caprese', 'Croissant caprese', 'Tomate cereja, mussarela de búfala maçaricada, rúcula e pesto.', null, null, 20),
  ('sanduiches-focaccias', 'pizza-de-sardinha', 'Pizza de sardinha', 'Um clássico da casa, feita com a receita da Vó Amandia.', null, null, 30),
  ('sanduiches-focaccias', 'pao-de-queijo', 'Pão de queijo', null, null, null, 40),
  ('cafes-especiais', 'guria-classico-g1', 'Guria Clássico G1 (250 g)', 'Torra clara, notas de caramelo. Catuaí Vermelho do produtor Augusto Borges.', 5250, 'pacote', 10),
  ('cafes-especiais', 'guria-classico-g2', 'Guria Clássico G2 (250 g)', 'Torra média, notas de chocolate. Catuaí Vermelho, processo natural, da Mantiqueira de Minas. Produtor Augusto Borges.', 5250, 'pacote', 20),
  ('bebidas', 'suco-de-laranja', 'Suco de laranja', 'Espremido na hora.', null, null, 5),
  ('bebidas', 'suco-natural', 'Suco natural (200 ml)', null, 800, 'por pessoa', 10),
  ('bebidas', 'agua-saborizada', 'Água saborizada (4 L)', null, 4000, null, 20),
  ('bebidas', 'cha-frutas-vermelhas', 'Chá de frutas vermelhas (térmica 1 L)', null, 4000, null, 30),
  ('bebidas', 'cafe-passado-termica', 'Café passado na hora (térmica 1,5 L)', null, 6000, null, 40),
  ('doces', 'brownie-decorado', 'Brownie artesanal decorado', null, null, null, 10),
  ('doces', 'mini-banoffee', 'Mini banoffee', null, null, null, 20),
  ('doces', 'bolo-de-cenoura', 'Bolo artesanal de cenoura', 'Com cobertura de chocolate.', null, null, 30),
  ('doces', 'torta-amandia', 'Torta Amandia', 'A torta que leva o nome da casa.', null, null, 40)
) as v(category_slug, slug, name, description, price_cents, price_label, sort_order)
join public.menu_categories c on c.slug = v.category_slug
on conflict (slug) do nothing;

-- Horário oficial: dois turnos — até 12h e das 14h30 às 19h30.
-- Fonte: post oficial do Instagram (30/09/2026): 9h às 12h e 14h30 às 19h30. Dias: confirmar.
insert into public.opening_hours (weekday, opens_at, closes_at)
select d, t.opens_at, t.closes_at
from generate_series(1, 7) as d
cross join (values ('09:00'::time, '12:00'::time), ('14:30'::time, '19:30'::time)) as t(opens_at, closes_at)
where not exists (select 1 from public.opening_hours);

-- -----------------------------------------------------------------------------
-- Revalidação do site (Database Webhooks)
-- -----------------------------------------------------------------------------
-- Configurar pelo painel: Database → Webhooks → Create a new hook
--   Tabelas: menu_categories, menu_items, events, opening_hours, special_hours
--   Eventos: INSERT, UPDATE, DELETE
--   Tipo:    HTTP Request · POST
--   URL:     https://<dominio>/api/revalidate
--   Header:  x-revalidate-secret: <REVALIDATE_SECRET>
-- O endpoint mapeia a tabela para a tag de cache (menu | events | hours).
