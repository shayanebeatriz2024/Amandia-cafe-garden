import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Cliente Supabase com a service role — ignora RLS. Só para rotas do servidor que
 * lidam com dados pessoais (currículos). Nunca importar em componentes de cliente.
 * Sem cache: cada leitura reflete o banco no momento.
 *
 * Retorna null quando SUPABASE_SERVICE_ROLE_KEY não está configurada.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }) },
  });
}

export const RESUME_BUCKET = 'curriculos';
