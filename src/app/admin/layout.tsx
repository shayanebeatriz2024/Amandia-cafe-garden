import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Painel · Amandia Café Garden' },
  robots: { index: false, follow: false },
};

/** Área interna: sem cabeçalho/rodapé do site (ver PublicOnly no layout raiz). */
export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-svh bg-stone-50 text-stone-700">{children}</div>;
}
