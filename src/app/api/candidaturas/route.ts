import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseAdmin, RESUME_BUCKET } from '@/lib/supabase/admin';
import { isStrengthKey, RESUME_MAX_BYTES, RESUME_MIME_TYPES } from '@/lib/careers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Result = { ok: true } | { ok: false; error: string };

const text = (data: FormData, key: string, max: number) => String(data.get(key) ?? '').trim().slice(0, max);

const EXTENSIONS: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
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
  const about = text(data, 'about', 2000);
  const strengths = [...new Set(data.getAll('strengths').map(String).filter(isStrengthKey))];

  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || phone.replace(/\D/g, '').length < 8 || !about) {
    return NextResponse.json<Result>({ ok: false, error: 'invalid_fields' }, { status: 400 });
  }
  if (data.get('consent') !== 'on') {
    return NextResponse.json<Result>({ ok: false, error: 'consent_required' }, { status: 400 });
  }

  let resumePath: string | null = null;
  const resume = data.get('resume');
  if (resume instanceof File && resume.size > 0) {
    const extension = EXTENSIONS[resume.type];
    if (!extension || !(RESUME_MIME_TYPES as readonly string[]).includes(resume.type) || resume.size > RESUME_MAX_BYTES) {
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
