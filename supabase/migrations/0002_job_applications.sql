-- =============================================================================
-- 0002 · Currículos do "Faça parte da nossa equipe"
-- =============================================================================
-- Dados pessoais (LGPD): a tabela e o bucket NÃO têm políticas para anon/authenticated.
-- Só o servidor do site acessa, com a SUPABASE_SERVICE_ROLE_KEY (que ignora RLS):
--   • POST /api/candidaturas  → grava a candidatura e o arquivo
--   • /admin?aba=curriculos   → lista, filtra e gera links temporários do currículo
-- =============================================================================

create table public.job_applications (
  id           uuid primary key default gen_random_uuid(),
  name         text not null check (char_length(name) between 2 and 120),
  email        text not null check (char_length(email) between 5 and 160),
  phone        text not null check (char_length(phone) between 8 and 30),
  about        text not null check (char_length(about) between 1 and 2000),
  strengths    text[] not null default '{}',                      -- chaves de src/lib/careers.ts
  resume_path  text,                                              -- caminho no bucket privado "curriculos"
  consent_at   timestamptz not null default now(),                -- aceite do aviso de privacidade
  created_at   timestamptz not null default now()
);

create index job_applications_created_idx on public.job_applications (created_at desc);
create index job_applications_strengths_idx on public.job_applications using gin (strengths);

alter table public.job_applications enable row level security;

comment on table public.job_applications is
  'Candidaturas do site. Acesso só pela service role (rota /api/candidaturas e painel /admin).';

-- Bucket privado para os arquivos (PDF/Word, até 4 MB)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'curriculos',
  'curriculos',
  false,
  4194304,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do nothing;
