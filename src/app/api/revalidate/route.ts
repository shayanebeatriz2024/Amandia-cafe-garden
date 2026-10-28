import { timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { TABLE_TO_TAG } from '@/lib/supabase/server';

/**
 * Revalidação sob demanda disparada pelos Database Webhooks do Supabase
 * (docs/02-trd.md §3.3). Payload: { type, table, record, old_record, schema }.
 */
export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  const received = request.headers.get('x-revalidate-secret');

  if (!expected || !received || !safeEqual(received, expected)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let table: unknown;
  try {
    ({ table } = (await request.json()) as { table?: unknown });
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const tag = typeof table === 'string' ? TABLE_TO_TAG[table] : undefined;
  if (!tag) {
    return NextResponse.json({ ok: false, error: 'unknown_table' }, { status: 400 });
  }

  revalidateTag(tag);
  return NextResponse.json({ ok: true, tag, revalidatedAt: new Date().toISOString() });
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}
