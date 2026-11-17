'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  ADMIN_COOKIE,
  SESSION_TTL_SECONDS,
  createSessionToken,
  isAdminConfigured,
  verifyCredentials,
} from '@/lib/admin/session';
import { clearLoginFailures, loginRetryAfter, registerLoginFailure } from '@/lib/admin/rate-limit';

export type LoginState = { error: string | null };

const FAILED_LOGIN_DELAY_MS = 1000; // freia tentativas de força bruta

/** IP do cliente (a Vercel preenche x-forwarded-for / x-real-ip). */
async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip')?.trim() || 'unknown';
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return { error: 'O acesso ao painel ainda não foi configurado (ADMIN_EMAIL e ADMIN_PASSWORD).' };
  }

  const ip = await clientIp();
  const retryAfter = loginRetryAfter(ip);
  if (retryAfter > 0) {
    return { error: `Muitas tentativas. Tente de novo em ${Math.ceil(retryAfter / 60)} min.` };
  }

  const email = formData.get('email');
  const password = formData.get('password');
  const valid =
    typeof email === 'string' &&
    typeof password === 'string' &&
    email.length <= 254 &&
    password.length <= 256 &&
    (await verifyCredentials(email, password));

  if (!valid) {
    registerLoginFailure(ip);
    await new Promise((resolve) => setTimeout(resolve, FAILED_LOGIN_DELAY_MS));
    return { error: 'E-mail ou senha incorretos. Tente novamente.' };
  }

  clearLoginFailures(ip);
  (await cookies()).set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
  redirect('/admin');
}

export async function logout(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect('/admin/login');
}
