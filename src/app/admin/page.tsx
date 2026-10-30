import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { ComponentType, ReactNode } from 'react';
import { BarChart3, FolderOpen, LogOut } from 'lucide-react';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/admin/session';
import { isDemoMode } from '@/lib/admin/ga-metrics';
import { getApplications } from '@/lib/admin/applications';
import { cn } from '@/lib/cn';
import { Dashboard } from '@/components/admin/Dashboard';
import { ResumeFolder } from '@/components/admin/ResumeFolder';
import { logout } from './actions';

export const dynamic = 'force-dynamic';

function TabLink({
  href,
  active,
  icon: Icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        '-mb-px inline-flex h-10 items-center gap-2 border-b-2 px-3 text-sm font-medium transition-colors',
        active ? 'border-amandia-green text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-900',
      )}
    >
      <Icon className={cn('size-4', active ? 'text-amandia-green' : 'text-stone-400')} />
      {children}
    </Link>
  );
}

type Tab = 'metricas' | 'curriculos';

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ aba?: string }> }) {
  // Conferência no servidor além do middleware (defesa em profundidade).
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!(await verifySessionToken(token))) redirect('/admin/login');

  const tab: Tab = (await searchParams).aba === 'curriculos' ? 'curriculos' : 'metricas';
  const demo = isDemoMode();
  const applications = tab === 'curriculos' ? await getApplications() : null;

  return (
    <>
      <header className="border-b border-stone-200/80 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-stone-400">
              Amandia Café Garden
            </p>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="font-serif text-xl font-medium text-stone-900">Painel do site</h1>
              {demo && tab === 'metricas' && (
                <span
                  title="Os números exibidos são simulados até as credenciais do Google Analytics serem configuradas."
                  className="inline-flex items-center gap-1.5 rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs font-medium text-stone-500"
                >
                  <span className="size-1.5 rounded-full bg-amandia-orange" aria-hidden="true" />
                  Modo demonstração
                </span>
              )}
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200/80 bg-white px-3 text-sm font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50 hover:text-stone-900"
            >
              <LogOut className="size-4 text-stone-400" aria-hidden="true" />
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <nav aria-label="Seções do painel" className="mb-6 flex gap-1 border-b border-stone-200/80">
          <TabLink href="/admin" active={tab === 'metricas'} icon={BarChart3}>
            Métricas
          </TabLink>
          <TabLink href="/admin?aba=curriculos" active={tab === 'curriculos'} icon={FolderOpen}>
            Currículos
          </TabLink>
        </nav>

        {tab === 'metricas' && <Dashboard />}
        {applications?.mode === 'error' && (
          <p role="alert" className="rounded-lg border border-stone-200/80 bg-white p-6 text-sm text-stone-600 shadow-sm">
            {applications.message}
          </p>
        )}
        {applications && applications.mode !== 'error' && (
          <ResumeFolder items={applications.items} demo={applications.mode === 'demo'} />
        )}
      </main>
    </>
  );
}
