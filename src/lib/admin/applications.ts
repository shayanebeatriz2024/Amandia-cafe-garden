import 'server-only';
import { getSupabaseAdmin, RESUME_BUCKET } from '@/lib/supabase/admin';

/** Candidatura pronta para a pastinha do /admin (link do currículo já assinado). */
export interface ApplicationView {
  id: string;
  name: string;
  email: string;
  phone: string;
  about: string;
  strengths: string[];
  createdAt: string;
  resumeUrl: string | null;
}

export type ApplicationsResult =
  | { mode: 'live'; items: ApplicationView[] }
  | { mode: 'demo'; items: ApplicationView[] }
  | { mode: 'error'; message: string };

const SIGNED_URL_TTL_SECONDS = 60 * 60; // o link do arquivo expira em 1 hora
const MAX_ROWS = 500;

export async function getApplications(): Promise<ApplicationsResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { mode: 'demo', items: buildDemoApplications() };

  const { data, error } = await supabase
    .from('job_applications')
    .select('id, name, email, phone, about, strengths, resume_path, created_at')
    .order('created_at', { ascending: false })
    .limit(MAX_ROWS);

  if (error) {
    console.error('[admin] currículos', error.message);
    return { mode: 'error', message: 'Não foi possível carregar os currículos do banco de dados.' };
  }

  const paths = data.flatMap((row) => (row.resume_path ? [row.resume_path] : []));
  const signed = new Map<string, string>();
  if (paths.length > 0) {
    const { data: urls } = await supabase.storage.from(RESUME_BUCKET).createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);
    for (const entry of urls ?? []) {
      if (entry.path && entry.signedUrl) signed.set(entry.path, entry.signedUrl);
    }
  }

  return {
    mode: 'live',
    items: data.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      about: row.about,
      strengths: row.strengths,
      createdAt: row.created_at,
      resumeUrl: row.resume_path ? (signed.get(row.resume_path) ?? null) : null,
    })),
  };
}

/** Exemplos fictícios enquanto a SUPABASE_SERVICE_ROLE_KEY não está configurada. */
function buildDemoApplications(): ApplicationView[] {
  const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
  return [
    {
      id: 'demo-1',
      name: 'Exemplo: Júlia Andrade',
      email: 'julia@exemplo.com',
      phone: '(51) 90000-0001',
      about: 'Trabalhei dois anos como barista em cafeteria de especialidade. Adoro atender com calma.',
      strengths: ['barista', 'atendimento'],
      createdAt: daysAgo(2),
      resumeUrl: null,
    },
    {
      id: 'demo-2',
      name: 'Exemplo: Rafael Souza',
      email: 'rafael@exemplo.com',
      phone: '(51) 90000-0002',
      about: 'Formado em gastronomia, com experiência em confeitaria e produção de bolos.',
      strengths: ['confeitaria', 'cozinha'],
      createdAt: daysAgo(12),
      resumeUrl: null,
    },
    {
      id: 'demo-3',
      name: 'Exemplo: Bianca Lima',
      email: 'bianca@exemplo.com',
      phone: '(51) 90000-0003',
      about: 'Organizada, gosto de eventos e de montar mesas. Disponível aos finais de semana.',
      strengths: ['eventos', 'organizacao', 'redes-sociais'],
      createdAt: daysAgo(40),
      resumeUrl: null,
    },
  ];
}
