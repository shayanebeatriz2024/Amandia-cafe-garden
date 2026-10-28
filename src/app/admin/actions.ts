'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  ADMIN_COOKIE,
  SESSION_TTL_SECONDS,
  createSessionToken,
  isAdminConfigured,
  verifyPassword,
} from '@/lib/admin/session';

export type LoginState = { error: string | null };

const FAILED_LOGIN_DELAY_MS = 1000; // freia tentativas de força bruta

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return { error: 'O acesso ao painel ainda não foi configurado (ADMIN_PASSWORD).' };
  }

  const password = formData.get('password');
  if (typeof password !== 'string' || !(await verifyPassword(password))) {
    await new Promise((resolve) => setTimeout(resolve, FAILED_LOGIN_DELAY_MS));
    return { error: 'Senha incorreta. Tente novamente.' };
  }

  (await cookies()).set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
  redirect('/admin');
}

export async function logout(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect('/admin/login');
}
