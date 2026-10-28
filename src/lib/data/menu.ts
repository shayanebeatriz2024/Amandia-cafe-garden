import 'server-only';
import { getSupabase } from '@/lib/supabase/server';
import { getStaticSection } from '@/data/menu';
import type { MenuPublicRow, MenuSection } from '@/types/database';

export type MenuItem = Omit<
  MenuPublicRow,
  | 'category_id'
  | 'category_slug'
  | 'category_name'
  | 'category_description'
  | 'section'
  | 'category_icon'
  | 'category_order'
>;

export interface MenuCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  items: MenuItem[];
}

function groupByCategory(rows: MenuPublicRow[]): MenuCategory[] {
  const categories = new Map<string, MenuCategory>();
  for (const row of rows) {
    const {
      category_id,
      category_slug,
      category_name,
      category_description,
      category_icon,
      section: _section,
      category_order: _order,
      ...item
    } = row;
    let category = categories.get(category_id);
    if (!category) {
      category = {
        id: category_id,
        slug: category_slug,
        name: category_name,
        description: category_description,
        icon: category_icon,
        items: [],
      };
      categories.set(category_id, category);
    }
    category.items.push(item);
  }
  return [...categories.values()];
}

/**
 * Categorias + itens de uma seção do site (cardapio | vitrine | presentes | mesa_posta).
 * Sem Supabase (ou seção vazia), usa o catálogo estático de src/data/menu.ts.
 */
export async function getMenuSection(section: MenuSection): Promise<MenuCategory[]> {
  const supabase = getSupabase('menu');
  if (!supabase) return getStaticSection(section);

  const { data, error } = await supabase
    .from('menu_public')
    .select('*')
    .eq('section', section)
    .order('category_order')
    .order('sort_order');

  if (error) {
    console.error(`[data/menu] ${section}:`, error.message);
    return getStaticSection(section);
  }
  const categories = groupByCategory(data ?? []);
  return categories.length > 0 ? categories : getStaticSection(section);
}

/** Itens em destaque para a Home. */
export async function getFeaturedItems(section: MenuSection, limit = 6): Promise<MenuItem[]> {
  const categories = await getMenuSection(section);
  return categories
    .flatMap((c) => c.items)
    .filter((item) => item.is_featured)
    .slice(0, limit);
}

export { formatPrice } from '@/lib/format';
