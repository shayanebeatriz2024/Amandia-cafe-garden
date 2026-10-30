/**
 * Pontos fortes que o candidato marca no "Faça parte da nossa equipe".
 * As chaves vão para job_applications.strengths e viram filtro na pastinha do /admin.
 */
export const STRENGTHS = [
  { key: 'atendimento', label: 'Atendimento' },
  { key: 'barista', label: 'Barista / cafés' },
  { key: 'cozinha', label: 'Cozinha' },
  { key: 'confeitaria', label: 'Confeitaria' },
  { key: 'caixa', label: 'Caixa' },
  { key: 'organizacao', label: 'Organização e limpeza' },
  { key: 'eventos', label: 'Eventos e mesa posta' },
  { key: 'redes-sociais', label: 'Redes sociais' },
] as const;

export type StrengthKey = (typeof STRENGTHS)[number]['key'];

const STRENGTH_KEYS = new Set<string>(STRENGTHS.map((s) => s.key));

export function isStrengthKey(value: string): value is StrengthKey {
  return STRENGTH_KEYS.has(value);
}

export function strengthLabel(key: string): string {
  return STRENGTHS.find((s) => s.key === key)?.label ?? key;
}

export const RESUME_MAX_BYTES = 4 * 1024 * 1024; // abaixo do limite de 4,5 MB do corpo na Vercel

export const RESUME_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

/** Celular brasileiro → dígitos com DDI 55, pronto para wa.me. */
export function toWhatsAppDigits(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.length <= 11 ? `55${digits}` : digits;
}
