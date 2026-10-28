import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/admin/session';

/**
 * Barreira do painel administrativo: /admin/* e /api/admin/* exigem sessão válida.
 * As páginas e a API conferem a sessão de novo no servidor (defesa em profundidade).
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === '/admin/login';
  const isAuthenticated = await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value);

  if (isLogin) {
    return isAuthenticated ? NextResponse.redirect(new URL('/admin', request.url)) : NextResponse.next();
  }

  if (isAuthenticated) return NextResponse.next();

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  return NextResponse.redirect(new URL('/admin/login', request.url));
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};
