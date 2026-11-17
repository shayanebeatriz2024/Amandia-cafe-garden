-- Cardápio somente leitura para clientes do site.
--
-- O painel /admin não edita mais o cardápio nem preços, e o cadastro público do Supabase Auth
-- está aberto: com as políticas "Staff manage …" qualquer conta `authenticated` podia alterar
-- categorias, itens e preços usando a chave pública do site.
--
-- Depois desta migração, só a leitura pública (itens publicados) continua liberada. Alterações
-- no cardápio passam a ser feitas pelo dashboard do Supabase ou por
-- `node scripts/sync-cardapio-pdf.ts --apply` (service role, que ignora RLS).

drop policy if exists "Staff manage categories" on public.menu_categories;
drop policy if exists "Staff manage items" on public.menu_items;

-- Garantia extra: sem privilégios de escrita para os papéis expostos à API pública.
revoke insert, update, delete on public.menu_categories from anon, authenticated;
revoke insert, update, delete on public.menu_items from anon, authenticated;
