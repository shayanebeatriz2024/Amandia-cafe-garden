/**
 * Sincroniza o cardápio do Supabase com o catálogo estático transcrito do
 * "cardápio atualizado 2026" (PDF) em src/data/menu.ts.
 *
 *   node scripts/sync-cardapio-pdf.ts --sql      → imprime a migração SQL equivalente
 *   node scripts/sync-cardapio-pdf.ts --apply    → aplica via REST (usa .env.local, service role)
 *
 * Não apaga nada: itens dessas categorias que não estão no PDF ficam is_published = false.
 */
import { readFileSync } from 'node:fs';
import { getStaticSection } from '../src/data/menu.ts';

// Ordem e seção como no impresso (bebidas → cafés → salgados | doces), + grãos para levar.
const CATEGORIES = [
  { slug: 'bebidas', section: 'cardapio', sort_order: 10 },
  { slug: 'cafes-especiais', section: 'cardapio', sort_order: 20 },
  { slug: 'sanduiches-focaccias', section: 'cardapio', sort_order: 30 },
  { slug: 'doces', section: 'vitrine', sort_order: 10 },
  { slug: 'graos-para-levar', section: 'vitrine', sort_order: 20 },
] as const;

const catalog = [...getStaticSection('cardapio'), ...getStaticSection('vitrine')];
const plan = CATEGORIES.map((c) => {
  const cat = catalog.find((x) => x.slug === c.slug);
  if (!cat) throw new Error(`categoria ${c.slug} não está no catálogo estático`);
  return { ...c, name: cat.name, description: cat.description, icon: cat.icon, items: cat.items };
});

const q = (v: unknown) =>
  v === null || v === undefined ? 'null' : typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`;

function toSql(): string {
  const out: string[] = [
    '-- Cardápio fiel ao impresso "cardápio atualizado 2026" (PDF).',
    '-- Gerado por scripts/sync-cardapio-pdf.ts a partir de src/data/menu.ts. Não apaga itens:',
    '-- o que não está no PDF nessas categorias fica despublicado (is_published = false).',
    'begin;',
    '',
  ];
  for (const c of plan) {
    out.push(
      `insert into public.menu_categories (slug, name, description, section, icon, sort_order, is_published)`,
      `values (${q(c.slug)}, ${q(c.name)}, ${q(c.description)}, ${q(c.section)}, ${q(c.icon)}, ${c.sort_order}, true)`,
      `on conflict (slug) do update set name = excluded.name, description = excluded.description,`,
      `  section = excluded.section, icon = excluded.icon, sort_order = excluded.sort_order, is_published = true;`,
      '',
    );
  }
  for (const c of plan) {
    out.push(`-- ${c.name}`);
    for (const i of c.items) {
      const tags = `array[${i.dietary_tags.map(q).join(', ')}]::public.dietary_tag[]`;
      out.push(
        `insert into public.menu_items (category_id, slug, name, description, price_cents, price_label, dietary_tags, sort_order, is_published)`,
        `select id, ${q(i.slug)}, ${q(i.name)}, ${q(i.description)}, ${q(i.price_cents)}, ${q(i.price_label)}, ${tags}, ${i.sort_order}, true`,
        `from public.menu_categories where slug = ${q(c.slug)}`,
        `on conflict (slug) do update set category_id = excluded.category_id, name = excluded.name,`,
        `  description = excluded.description, price_cents = excluded.price_cents, price_label = excluded.price_label,`,
        `  dietary_tags = excluded.dietary_tags, sort_order = excluded.sort_order, is_published = true;`,
      );
    }
    out.push(
      `update public.menu_items set is_published = false`,
      `where category_id = (select id from public.menu_categories where slug = ${q(c.slug)})`,
      `  and slug not in (${c.items.map((i) => q(i.slug)).join(', ')});`,
      '',
    );
  }
  out.push('commit;', '');
  return out.join('\n');
}

async function apply() {
  const env = Object.fromEntries(
    readFileSync('.env.local', 'utf8')
      .split(/\r?\n/)
      .filter((l) => /^[A-Z_]+=/.test(l))
      .map((l) => {
        const i = l.indexOf('=');
        let v = l.slice(i + 1).trim();
        if (/^["'].*["']$/.test(v)) v = v.slice(1, -1);
        return [l.slice(0, i), v];
      }),
  );
  const base = `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1`;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY ausentes');
  const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
  const call = async (path: string, init: RequestInit) => {
    const res = await fetch(`${base}${path}`, { ...init, headers: { ...headers, ...(init.headers ?? {}) } });
    const text = await res.text();
    if (!res.ok) throw new Error(`${init.method} ${path} → ${res.status}: ${text}`);
    return text ? JSON.parse(text) : null;
  };
  const upsert = { Prefer: 'resolution=merge-duplicates,return=representation' };

  const cats = await call('/menu_categories?on_conflict=slug', {
    method: 'POST',
    headers: upsert,
    body: JSON.stringify(
      plan.map(({ slug, name, description, section, icon, sort_order }) => ({
        slug, name, description, section, icon, sort_order, is_published: true,
      })),
    ),
  });
  const idBySlug = new Map<string, string>(cats.map((c: { slug: string; id: string }) => [c.slug, c.id]));
  console.log(`categorias: ${cats.length} sincronizadas`);

  for (const c of plan) {
    const categoryId = idBySlug.get(c.slug)!;
    const rows = c.items.map((i) => ({
      category_id: categoryId, slug: i.slug, name: i.name, description: i.description,
      price_cents: i.price_cents, price_label: i.price_label, dietary_tags: i.dietary_tags,
      sort_order: i.sort_order, is_published: true,
    }));
    await call('/menu_items?on_conflict=slug', { method: 'POST', headers: upsert, body: JSON.stringify(rows) });
    const keep = c.items.map((i) => `"${i.slug}"`).join(',');
    const hidden = await call(
      `/menu_items?category_id=eq.${categoryId}&slug=not.in.(${encodeURIComponent(keep)})&is_published=eq.true`,
      { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ is_published: false }) },
    );
    console.log(`${c.name}: ${rows.length} itens do PDF; despublicados: ${hidden.map((h: { slug: string }) => h.slug).join(', ') || '—'}`);
  }
}

if (process.argv.includes('--apply')) await apply();
else process.stdout.write(toSql());
