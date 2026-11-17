import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseAdmin, RESUME_BUCKET } from '@/lib/supabase/admin';
import { isStrengthKey, RESUME_MAX_BYTES, RESUME_MIME_TYPES } from '@/lib/careers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Result = { ok: true } | { ok: false; error: string };

/**
 * Texto do formulário saneado: só strings (nunca File), sem caracteres de controle
 * (mantém quebras de linha só onde `multiline`), espaços colapsados e tamanho limitado.
 * O conteúdo é exibido pelo React (escapado), então não há HTML a interpretar.
 */
const text = (data: FormData, key: string, max: number, multiline = false) => {
  const raw = data.get(key);
  if (typeof raw !== 'string') return '';
  const clean = multiline
    ? raw.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000B-\u001F\u007F\u200B-\u200F\u2028-\u202E]/g, '')
    : raw.replace(/[\u0000-\u001F\u007F\u200B-\u200F\u2028-\u202E]/g, ' ').replace(/\s+/g, ' ');
  return clean.trim().slice(0, max);
};

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
const PHONE_RE = /^[\d\s()+.-]{8,30}$/;

/** Assinatura real do arquivo (o MIME enviado pelo navegador pode ser forjado). */
const MAGIC_BYTES: Record<string, number[]> = {
  'application/pdf': [0x25, 0x50, 0x44, 0x46, 0x2d], // %PDF-
};

async function hasValidSignature(file: File, mime: string): Promise<boolean> {
  const magic = MAGIC_BYTES[mime];
  if (!magic) return false;
  const head = new Uint8Array(await file.slice(0, magic.length).arrayBuffer());
  return magic.every((byte, i) => head[i] === byte);
}

// Freio simples por IP (memória da instância): 5 envios a cada 10 min.
const SUBMIT_LIMIT = 5;
const SUBMIT_WINDOW_MS = 10 * 60 * 1000;
const submissions = new Map<string, { count: number; resetAt: number }>();

function tooManySubmissions(ip: string, now = Date.now()): boolean {
  for (const [key, entry] of submissions) if (entry.resetAt <= now) submissions.delete(key);
  const entry = submissions.get(ip);
  if (!entry) {
    submissions.set(ip, { count: 1, resetAt: now + SUBMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > SUBMIT_LIMIT;
}

const EXTENSIONS: Record<string, string> = {
  'application/pdf': 'pdf',
};

/**
 * POST /api/candidaturas — guarda a candidatura do "Faça parte da nossa equipe"
 * (e o currículo, se houver) para a pastinha do /admin. O WhatsApp continua sendo
 * aberto pelo formulário; esta rota só arquiva.
 */
export async function POST(request: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json<Result>({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  if (tooManySubmissions(ip)) {
    return NextResponse.json<Result>({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  // Rejeita corpos acima do limite antes de ler (currículo + campos de texto).
  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > RESUME_MAX_BYTES + 64 * 1024) {
    return NextResponse.json<Result>({ ok: false, error: 'invalid_resume' }, { status: 413 });
  }

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return NextResponse.json<Result>({ ok: false, error: 'invalid_body' }, { status: 400 });
  }

  // Campo-isca invisível: robôs preenchem, pessoas não.
  if (text(data, 'website', 200)) return NextResponse.json<Result>({ ok: true });

  const name = text(data, 'name', 120);
  const email = text(data, 'email', 160);
  const phone = text(data, 'phone', 30);
  const about = text(data, 'about', 2000, true);
  const strengths = [...new Set(data.getAll('strengths').filter((v): v is string => typeof v === 'string').filter(isStrengthKey))];

  if (
    name.length < 2 ||
    email.length < 5 ||
    !EMAIL_RE.test(email) ||
    !PHONE_RE.test(phone) ||
    phone.replace(/\D/g, '').length < 8 ||
    !about
  ) {
    return NextResponse.json<Result>({ ok: false, error: 'invalid_fields' }, { status: 400 });
  }
  if (data.get('consent') !== 'on') {
    return NextResponse.json<Result>({ ok: false, error: 'consent_required' }, { status: 400 });
  }

  let resumePath: string | null = null;
  const resume = data.get('resume');
  if (resume instanceof File && resume.size > 0) {
    const extension = EXTENSIONS[resume.type];
    if (
      !extension ||
      !/\.pdf$/i.test(resume.name) ||
      !(RESUME_MIME_TYPES as readonly string[]).includes(resume.type) ||
      resume.size > RESUME_MAX_BYTES ||
      !(await hasValidSignature(resume, resume.type))
    ) {
      return NextResponse.json<Result>({ ok: false, error: 'invalid_resume' }, { status: 400 });
    }
    resumePath = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage
      .from(RESUME_BUCKET)
      .upload(resumePath, resume, { contentType: resume.type, upsert: false });
    if (error) {
      console.error('[candidaturas] upload', error.message);
      return NextResponse.json<Result>({ ok: false, error: 'upload_failed' }, { status: 502 });
    }
  }

  const { error } = await supabase
    .from('job_applications')
    .insert({ name, email, phone, about, strengths, resume_path: resumePath });
  if (error) {
    console.error('[candidaturas] insert', error.message);
    if (resumePath) await supabase.storage.from(RESUME_BUCKET).remove([resumePath]);
    return NextResponse.json<Result>({ ok: false, error: 'insert_failed' }, { status: 502 });
  }

  return NextResponse.json<Result>({ ok: true }, { status: 201 });
}
