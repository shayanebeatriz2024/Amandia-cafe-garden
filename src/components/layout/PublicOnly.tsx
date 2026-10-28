'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Renderiza o conteúdo só nas páginas públicas: o painel /admin fica sem
 * cabeçalho, rodapé, barra fixa e GA (as visitas da equipe não entram nas métricas).
 */
export function PublicOnly({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname?.startsWith('/admin') ? null : children;
}
