import { formatPrice, type MenuCategory } from '@/lib/data/menu';

type MenuSectionListProps = {
  categories: MenuCategory[];
  emptyMessage: string;
};

/**
 * Lista indexável de categorias e itens (HTML puro, sem JS).
 * Fase 4 substitui por MenuItemRow / ProductCard com imagens e filtros.
 */
export function MenuSectionList({ categories, emptyMessage }: MenuSectionListProps) {
  if (categories.length === 0) {
    return <p className="container pb-section text-muted">{emptyMessage}</p>;
  }

  return (
    <div className="container space-y-16 pb-section">
      {categories.map((category) => (
        <section key={category.id} id={category.slug} aria-labelledby={`${category.slug}-titulo`}>
          <h2 id={`${category.slug}-titulo`} className="text-h2">
            {category.name}
          </h2>
          {category.description && <p className="mt-2 max-w-prose text-muted">{category.description}</p>}
          {category.items.length === 0 && (
            <p className="mt-6 text-sm text-muted">
              Itens sendo atualizados. Pergunte pelo WhatsApp o que temos hoje.
            </p>
          )}
          <ul className="mt-8 divide-y divide-border">
            {category.items.map((item) => (
              <li key={item.id} className="flex items-baseline justify-between gap-6 py-4">
                <div>
                  <h3 className="text-h3">
                    {item.name}
                    {!item.is_available && (
                      <span className="ml-3 align-middle font-sans text-xs font-medium uppercase tracking-wider text-amandia-pink-ink">
                        Esgotado hoje
                      </span>
                    )}
                  </h3>
                  {item.description && <p className="mt-1 text-sm">{item.description}</p>}
                </div>
                {item.price_cents !== null && (
                  <p className="shrink-0 font-medium tabular-nums text-heading">
                    {item.price_label && (
                      <span className="mr-1 text-xs font-normal text-muted">{item.price_label}</span>
                    )}
                    {formatPrice(item.price_cents)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
