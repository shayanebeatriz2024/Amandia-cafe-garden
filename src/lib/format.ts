/** Formatação pura (sem server-only) — usável em Server e Client Components. */
const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatPrice(cents: number | null): string | null {
  return cents === null ? null : BRL.format(cents / 100);
}
