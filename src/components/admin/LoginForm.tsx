'use client';

import { useActionState } from 'react';
import { LockKeyhole, LogIn } from 'lucide-react';
import { login, type LoginState } from '@/app/admin/actions';

const INITIAL_STATE: LoginState = { error: null };

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, formAction, pending] = useActionState(login, INITIAL_STATE);

  return (
    <form
      action={formAction}
      className="w-full max-w-sm rounded-lg border border-stone-200/80 bg-white p-8 shadow-sm"
    >
      <span className="inline-flex size-10 items-center justify-center rounded-md bg-stone-100 text-amandia-green">
        <LockKeyhole className="size-5" aria-hidden="true" />
      </span>
      <h1 className="mt-5 font-serif text-xl font-medium text-stone-900">Painel do Amandia</h1>
      <p className="mt-1 text-sm text-stone-500">Acesso restrito. Digite a senha de administração.</p>

      {!configured && (
        <p role="alert" className="mt-5 rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-600">
          O painel ainda não está configurado: defina ADMIN_PASSWORD nas variáveis de ambiente.
        </p>
      )}

      <label htmlFor="password" className="mt-6 block text-sm font-medium text-stone-700">
        Senha
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        disabled={!configured || pending}
        aria-invalid={state.error ? true : undefined}
        aria-describedby={state.error ? 'login-error' : undefined}
        className="mt-2 block h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-base text-stone-900 shadow-sm outline-none transition-colors focus:border-amandia-green focus:ring-2 focus:ring-amandia-green/15 disabled:opacity-60"
      />

      {state.error && (
        <p id="login-error" role="alert" className="mt-2 text-sm font-medium text-amandia-pink-ink">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={!configured || pending}
        className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-amandia-green px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-moss-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogIn className="size-4" aria-hidden="true" />
        {pending ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
