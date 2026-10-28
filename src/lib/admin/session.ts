/**
 * Sessão do painel /admin — cookie assinado (HMAC-SHA256), sem banco de dados.
 *
 * Formato do token: `<expiraEmMs>.<assinaturaBase64url>`.
 * A chave HMAC é derivada de ADMIN_PASSWORD: trocar a senha invalida todas as sessões abertas.
 * Usa apenas Web Crypto, então roda tanto no middleware (Edge) quanto em rotas Node.
 */

export const ADMIN_COOKIE = 'amandia_admin';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 dias

const encoder = new TextEncoder();

function getPassword(): string | undefined {
  const password = process.env.ADMIN_PASSWORD;
  return password && password.length > 0 ? password : undefined;
}

export function isAdminConfigured(): boolean {
  return getPassword() !== undefined;
}

function toBase64Url(bytes: ArrayBuffer): string {
  let binary = '';
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function sha256(value: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest('SHA-256', encoder.encode(value));
}

/** Comparação em tempo constante (entradas de mesmo tamanho: digests SHA-256). */
function bytesEqual(bufA: ArrayBuffer, bufB: ArrayBuffer): boolean {
  const a = new Uint8Array(bufA);
  const b = new Uint8Array(bufB);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}

async function hmacKey(password: string): Promise<CryptoKey> {
  const keyMaterial = await sha256(`amandia-admin-session:${password}`);
  return crypto.subtle.importKey('raw', keyMaterial, { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ]);
}

async function sign(payload: string, password: string): Promise<string> {
  const key = await hmacKey(password);
  return toBase64Url(await crypto.subtle.sign('HMAC', key, encoder.encode(payload)));
}

/** Confere a senha digitada contra ADMIN_PASSWORD sem vazar tempo de comparação. */
export async function verifyPassword(candidate: string): Promise<boolean> {
  const password = getPassword();
  if (!password) return false;
  const [a, b] = await Promise.all([sha256(candidate), sha256(password)]);
  return bytesEqual(a, b);
}

export async function createSessionToken(): Promise<string> {
  const password = getPassword();
  if (!password) throw new Error('ADMIN_PASSWORD não configurada');
  const expiresAt = String(Date.now() + SESSION_TTL_SECONDS * 1000);
  return `${expiresAt}.${await sign(expiresAt, password)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  const password = getPassword();
  if (!password || !token) return false;

  const [expiresAt, signature, ...rest] = token.split('.');
  if (!expiresAt || !signature || rest.length > 0) return false;
  if (!/^\d+$/.test(expiresAt) || Number(expiresAt) < Date.now()) return false;

  const expected = await sign(expiresAt, password);
  const [a, b] = await Promise.all([sha256(signature), sha256(expected)]);
  return bytesEqual(a, b);
}
