-- Cardápio fiel ao impresso "cardápio atualizado 2026" (PDF).
-- Gerado por scripts/sync-cardapio-pdf.ts a partir de src/data/menu.ts. Não apaga itens:
-- o que não está no PDF nessas categorias fica despublicado (is_published = false).
begin;

insert into public.menu_categories (slug, name, description, section, icon, sort_order, is_published)
values ('bebidas', 'Bebidas', null, 'cardapio', 'coffee', 10, true)
on conflict (slug) do update set name = excluded.name, description = excluded.description,
  section = excluded.section, icon = excluded.icon, sort_order = excluded.sort_order, is_published = true;

insert into public.menu_categories (slug, name, description, section, icon, sort_order, is_published)
values ('cafes-especiais', 'Cafés', '“simples_mente” um convite para desacelerar.', 'cardapio', 'coffee', 20, true)
on conflict (slug) do update set name = excluded.name, description = excluded.description,
  section = excluded.section, icon = excluded.icon, sort_order = excluded.sort_order, is_published = true;

insert into public.menu_categories (slug, name, description, section, icon, sort_order, is_published)
values ('sanduiches-focaccias', 'Salgados', null, 'cardapio', 'wheat', 30, true)
on conflict (slug) do update set name = excluded.name, description = excluded.description,
  section = excluded.section, icon = excluded.icon, sort_order = excluded.sort_order, is_published = true;

insert into public.menu_categories (slug, name, description, section, icon, sort_order, is_published)
values ('doces', 'Doces', 'Pra ser feliz.', 'vitrine', 'cake', 10, true)
on conflict (slug) do update set name = excluded.name, description = excluded.description,
  section = excluded.section, icon = excluded.icon, sort_order = excluded.sort_order, is_published = true;

insert into public.menu_categories (slug, name, description, section, icon, sort_order, is_published)
values ('graos-para-levar', 'Grãos para levar', 'Cafés especiais da Guria Coffee Roasters, à venda no balcão.', 'vitrine', 'coffee', 20, true)
on conflict (slug) do update set name = excluded.name, description = excluded.description,
  section = excluded.section, icon = excluded.icon, sort_order = excluded.sort_order, is_published = true;

-- Bebidas
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'agua-mineral', 'Água mineral', 'Com gás ou sem gás.', 600, null, array[]::public.dietary_tag[], 10, true
from public.menu_categories where slug = 'bebidas'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'suco-natural', 'Suco natural', 'Laranja ou abacaxi com hortelã.', 1600, null, array[]::public.dietary_tag[], 20, true
from public.menu_categories where slug = 'bebidas'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'soda-italiana', 'Soda italiana', 'Maçã verde ou morango.', 1600, null, array[]::public.dietary_tag[], 30, true
from public.menu_categories where slug = 'bebidas'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'caipirinha-vodka', 'Caipirinha Amandia · vodka', 'Limão, abacaxi ou morango.', 2600, null, array[]::public.dietary_tag[], 40, true
from public.menu_categories where slug = 'bebidas'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'caipirinha-velho-barreiro', 'Caipirinha Amandia · Velho Barreiro', 'Limão, abacaxi ou morango.', 2200, null, array[]::public.dietary_tag[], 50, true
from public.menu_categories where slug = 'bebidas'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'mojito-coffee', 'Mojito Coffee', 'Espresso, uma dose de rum, limão, açúcar, água com gás e hortelã frescas.', 2700, null, array[]::public.dietary_tag[], 60, true
from public.menu_categories where slug = 'bebidas'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'carajillo', 'Carajillo', 'Espresso + licor 43.', 2990, null, array[]::public.dietary_tag[], 70, true
from public.menu_categories where slug = 'bebidas'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'espumante-moscatel', 'Garrafa de espumante · Moscatel', null, 7800, null, array[]::public.dietary_tag[], 80, true
from public.menu_categories where slug = 'bebidas'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'espumante-brut', 'Garrafa de espumante · Brut', null, 9800, null, array[]::public.dietary_tag[], 90, true
from public.menu_categories where slug = 'bebidas'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'longneck-corona', 'Longneck Corona', null, 1500, null, array[]::public.dietary_tag[], 100, true
from public.menu_categories where slug = 'bebidas'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'longneck-heineken', 'Longneck Heineken', null, 1500, null, array[]::public.dietary_tag[], 110, true
from public.menu_categories where slug = 'bebidas'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
update public.menu_items set is_published = false
where category_id = (select id from public.menu_categories where slug = 'bebidas')
  and slug not in ('agua-mineral', 'suco-natural', 'soda-italiana', 'caipirinha-vodka', 'caipirinha-velho-barreiro', 'mojito-coffee', 'carajillo', 'espumante-moscatel', 'espumante-brut', 'longneck-corona', 'longneck-heineken');

-- Cafés
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'cafe-passado-calma', 'Café passado com cALMA', null, 1290, null, array[]::public.dietary_tag[], 10, true
from public.menu_categories where slug = 'cafes-especiais'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'golden-cafe', 'Golden', 'Café passado com especiarias.', 1400, null, array[]::public.dietary_tag[], 20, true
from public.menu_categories where slug = 'cafes-especiais'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'prensa-francesa', 'Prensa Francesa 350 ml', 'Ideal para compartilhar.', 2600, null, array[]::public.dietary_tag[], 30, true
from public.menu_categories where slug = 'cafes-especiais'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'cafe-com-leite', 'Café com leite', 'Simples e essencial.', 1290, null, array[]::public.dietary_tag[], 40, true
from public.menu_categories where slug = 'cafes-especiais'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'capuccino-canela', 'Capuccino com canela “Confort Coffee”', null, 1290, null, array[]::public.dietary_tag[], 50, true
from public.menu_categories where slug = 'cafes-especiais'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'capuccino-tradicional', 'Capuccino tradicional “Confort Coffee”', null, 1290, null, array[]::public.dietary_tag[], 60, true
from public.menu_categories where slug = 'cafes-especiais'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'capuccino-italiano', 'Capuccino Italiano', null, 1290, null, array[]::public.dietary_tag[], 70, true
from public.menu_categories where slug = 'cafes-especiais'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'mocamandia', 'Mocamandia', 'Camada de chocolate ou caramelo salgado, café espresso e leite vaporizado.', 1890, null, array[]::public.dietary_tag[], 80, true
from public.menu_categories where slug = 'cafes-especiais'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'cafes-gelados', 'Cafés gelados', 'Consulte sabor.', 1990, null, array[]::public.dietary_tag[], 90, true
from public.menu_categories where slug = 'cafes-especiais'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'chocolate-quente', 'Chocolate quente', 'Sabor de infância.', 1990, null, array[]::public.dietary_tag[], 100, true
from public.menu_categories where slug = 'cafes-especiais'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'espressinho', 'Espressinho ou carioquinha', null, 890, null, array[]::public.dietary_tag[], 110, true
from public.menu_categories where slug = 'cafes-especiais'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'pingadinho', 'Pingadinho', null, 990, null, array[]::public.dietary_tag[], 120, true
from public.menu_categories where slug = 'cafes-especiais'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'duplo-espresso', 'Duplo espresso ou carioca', null, 1000, null, array[]::public.dietary_tag[], 130, true
from public.menu_categories where slug = 'cafes-especiais'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'cha', 'Chá', 'Consulte sabor.', 600, null, array[]::public.dietary_tag[], 140, true
from public.menu_categories where slug = 'cafes-especiais'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
update public.menu_items set is_published = false
where category_id = (select id from public.menu_categories where slug = 'cafes-especiais')
  and slug not in ('cafe-passado-calma', 'golden-cafe', 'prensa-francesa', 'cafe-com-leite', 'capuccino-canela', 'capuccino-tradicional', 'capuccino-italiano', 'mocamandia', 'cafes-gelados', 'chocolate-quente', 'espressinho', 'pingadinho', 'duplo-espresso', 'cha');

-- Salgados
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'italianinho', 'Italianinho', 'Pão focaccia, requeijão, duplo queijo maçaricado e salame.', 2190, null, array[]::public.dietary_tag[], 10, true
from public.menu_categories where slug = 'sanduiches-focaccias'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'italianissimo', 'Italianíssimo', 'Pão focaccia, requeijão, duplo queijo maçaricado, salame, salada de alface e tomate.', 2690, null, array[]::public.dietary_tag[], 20, true
from public.menu_categories where slug = 'sanduiches-focaccias'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'caprese', 'Caprese', 'Pão focaccia, requeijão, tomate, manjericão e queijo de búfala.', 2990, null, array['vegetariano']::public.dietary_tag[], 30, true
from public.menu_categories where slug = 'sanduiches-focaccias'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'pampas', 'Pampas', 'Pão focaccia, carne de panela, queijo maçaricado, tomate, alface e requeijão. Acompanha geleia de abacaxi com pimenta.', 3290, null, array[]::public.dietary_tag[], 40, true
from public.menu_categories where slug = 'sanduiches-focaccias'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'pizza-de-sardinha', 'Pizza de sardinha artesanal da Vó Amandia', 'Sabor de infância que é tradição por aqui.', 1290, null, array[]::public.dietary_tag[], 50, true
from public.menu_categories where slug = 'sanduiches-focaccias'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'pao-de-queijo', 'Pão de queijo', 'Porção com 5 mini.', 1290, null, array[]::public.dietary_tag[], 60, true
from public.menu_categories where slug = 'sanduiches-focaccias'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'mini-croissant', 'Mini croissant sem recheio', null, 700, null, array[]::public.dietary_tag[], 70, true
from public.menu_categories where slug = 'sanduiches-focaccias'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'ovos-mexidos', 'Ovos mexidos', '3 ovos, uma pitada de sal e carinho.', 1600, null, array[]::public.dietary_tag[], 80, true
from public.menu_categories where slug = 'sanduiches-focaccias'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'pao-na-chapa', 'Pão na chapa', 'Com pão focaccia, acompanha mel ou requeijão.', 1290, null, array[]::public.dietary_tag[], 90, true
from public.menu_categories where slug = 'sanduiches-focaccias'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'farroupilha', 'Farroupilha com pão focaccia', 'Pão prensado com duplo queijo e presunto.', 1490, null, array[]::public.dietary_tag[], 100, true
from public.menu_categories where slug = 'sanduiches-focaccias'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'torrada-colonial', 'Torrada colonial', 'Pão focaccia com salame e duplo queijo.', 2090, null, array[]::public.dietary_tag[], 110, true
from public.menu_categories where slug = 'sanduiches-focaccias'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
update public.menu_items set is_published = false
where category_id = (select id from public.menu_categories where slug = 'sanduiches-focaccias')
  and slug not in ('italianinho', 'italianissimo', 'caprese', 'pampas', 'pizza-de-sardinha', 'pao-de-queijo', 'mini-croissant', 'ovos-mexidos', 'pao-na-chapa', 'farroupilha', 'torrada-colonial');

-- Doces
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'bolos-amandia', 'Bolos Amandia', 'Uma porção de carinho e nostalgia em cada pedaço, feita com amor e ingredientes selecionados para aquecer a cALMA e seu coração. Consulte os sabores do dia.', 1290, null, array[]::public.dietary_tag[], 10, true
from public.menu_categories where slug = 'doces'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'brownie-ao-leite', 'Brownie artesanal · ao leite', 'Especialidade da casa!', 1600, null, array[]::public.dietary_tag[], 20, true
from public.menu_categories where slug = 'doces'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'brownie-meio-amargo', 'Brownie artesanal · meio amargo', 'Especialidade da casa!', 1790, null, array[]::public.dietary_tag[], 30, true
from public.menu_categories where slug = 'doces'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'sobremesa-garden', 'Sobremesa Garden', 'Caramelo salgado, mousse capuccino, terra comestível de brownie meio amargo e um ramo de hortelã, servida em um delicado vaso de cerâmica.', 2000, null, array[]::public.dietary_tag[], 40, true
from public.menu_categories where slug = 'doces'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'quindim', 'Quindim', 'O melhor do litoral.', 1000, null, array[]::public.dietary_tag[], 50, true
from public.menu_categories where slug = 'doces'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'brigadeiro', 'Brigadeiro artesanal', null, 800, null, array[]::public.dietary_tag[], 60, true
from public.menu_categories where slug = 'doces'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'taca-iemanja', 'Taça Iemanjá', 'Sorvete de creme e cocada cremosa com doce de leite.', 2000, null, array[]::public.dietary_tag[], 70, true
from public.menu_categories where slug = 'doces'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'torta-amandia', 'Torta Amandia', 'Camada de brownie meio amargo, brigadeiro de café, nozes tostadas e mousse capuccino.', 2200, null, array['contem_nozes']::public.dietary_tag[], 80, true
from public.menu_categories where slug = 'doces'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'torta-banoffe', 'Torta Banoffe', 'Base amanteigada de biscoito crocante, camada de doce de leite, banana, nata batida e canela polvilhada.', 2000, null, array[]::public.dietary_tag[], 90, true
from public.menu_categories where slug = 'doces'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'mil-folhas', 'Mil folhas', 'Massa folhada crocante, recheada com doce de leite, creme ou os dois (Duo).', 1600, null, array[]::public.dietary_tag[], 100, true
from public.menu_categories where slug = 'doces'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
update public.menu_items set is_published = false
where category_id = (select id from public.menu_categories where slug = 'doces')
  and slug not in ('bolos-amandia', 'brownie-ao-leite', 'brownie-meio-amargo', 'sobremesa-garden', 'quindim', 'brigadeiro', 'taca-iemanja', 'torta-amandia', 'torta-banoffe', 'mil-folhas');

-- Grãos para levar
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'guria-classico-g1', 'Guria Clássico G1 (250 g)', 'Torra clara, notas de caramelo. Catuaí Vermelho do produtor Augusto Borges.', 5250, 'pacote', array[]::public.dietary_tag[], 10, true
from public.menu_categories where slug = 'graos-para-levar'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)
select id, 'guria-classico-g2', 'Guria Clássico G2 (250 g)', 'Torra média, notas de chocolate. Catuaí Vermelho, processo natural, da Mantiqueira de Minas. Produtor Augusto Borges.', 5250, 'pacote', array[]::public.dietary_tag[], 20, true
from public.menu_categories where slug = 'graos-para-levar'
on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,
  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,
  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;
update public.menu_items set is_published = false
where category_id = (select id from public.menu_categories where slug = 'graos-para-levar')
  and slug not in ('guria-classico-g1', 'guria-classico-g2');

commit;
