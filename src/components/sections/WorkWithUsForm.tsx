'use client';

import { useState, type FormEvent } from 'react';
import { buildWhatsAppUrl } from '@/lib/links';
import { trackEvent } from '@/lib/analytics';
import { RESUME_MAX_BYTES, STRENGTHS, strengthLabel } from '@/lib/careers';
import { buttonClasses } from '@/components/ui/button-styles';
import { ChatIcon } from '@/components/ui/icons';

const RESUME_ACCEPT =
  '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

type Candidate = {
  name: string;
  email: string;
  phone: string;
  about: string;
  strengths: string[];
  resumeName: string | null;
};

/** Mensagem no mesmo formato das reservas: saudação + dados + 🌿. */
function applicationMessage({ name, email, phone, about, strengths, resumeName }: Candidate): string {
  return [
    'Olá! Gostaria de trabalhar no Amandia. 🌿',
    '',
    `*Nome:* ${name}`,
    `*E-mail:* ${email}`,
    `*Celular:* ${phone}`,
    strengths.length > 0 && `*Pontos fortes:* ${strengths.map(strengthLabel).join(', ')}`,
    `*Sobre mim:* ${about}`,
    resumeName && `*Currículo:* ${resumeName} (vou anexar nesta conversa)`,
  ]
    .filter((line): line is string => typeof line === 'string')
    .join('\n');
}

/**
 * Cadastro do "Faça parte da nossa equipe". A candidatura é arquivada na pastinha
 * do /admin (POST /api/candidaturas, com o currículo) e a conversa abre no WhatsApp
 * do café. O link wa.me só leva texto, então o candidato também anexa o arquivo lá.
 */
export function WorkWithUsForm() {
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const href = buildWhatsAppUrl(
      applicationMessage({
        name: String(data.get('name')).trim(),
        email: String(data.get('email')).trim(),
        phone: String(data.get('phone')).trim(),
        about: String(data.get('about')).trim(),
        strengths: data.getAll('strengths').map(String),
        resumeName,
      }),
    );

    // Arquiva sem esperar: o WhatsApp precisa abrir no mesmo clique (bloqueador de pop-up).
    fetch('/api/candidaturas', { method: 'POST', body: data }).catch((error: unknown) => console.error(error));

    trackEvent('click_whatsapp', { placement: 'careers', item_name: 'Faça parte da nossa equipe', link_url: href });
    window.open(href, '_blank', 'noopener,noreferrer');
    setSent(true);
  }

  function handleResumeChange(file: File | undefined) {
    if (file && file.size > RESUME_MAX_BYTES) {
      setResumeName(null);
      setResumeError('Arquivo muito grande. Envie um currículo de até 4 MB.');
      return;
    }
    setResumeError(null);
    setResumeName(file?.name ?? null);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-12 flex max-w-xl flex-col gap-4">
      <label className="sr-only" htmlFor="careers-name">
        Seu nome
      </label>
      <input
        id="careers-name"
        name="name"
        type="text"
        autoComplete="name"
        placeholder="Seu nome"
        required
        className="form-field"
      />

      <label className="sr-only" htmlFor="careers-email">
        Seu e-mail
      </label>
      <input
        id="careers-email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Seu e-mail"
        required
        className="form-field"
      />

      <label className="sr-only" htmlFor="careers-phone">
        Número de celular (WhatsApp)
      </label>
      <input
        id="careers-phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        placeholder="Número de celular (WhatsApp)"
        required
        className="form-field"
      />

      <label className="sr-only" htmlFor="careers-about">
        Fale um pouco sobre você
      </label>
      <textarea
        id="careers-about"
        name="about"
        rows={4}
        placeholder="Fale um pouco sobre você"
        required
        className="form-field resize-y rounded-3xl"
      />

      <fieldset className="rounded-3xl border border-linen-300 bg-surface px-6 py-5 shadow-hairline">
        <legend className="px-2 text-sm font-semibold text-heading">Seus pontos fortes</legend>
        <div className="mt-1 flex flex-wrap gap-2">
          {STRENGTHS.map((strength) => (
            <label key={strength.key} className="cursor-pointer">
              <input type="checkbox" name="strengths" value={strength.key} className="peer sr-only" />
              <span className="inline-flex min-h-9 items-center rounded-full border border-linen-300 bg-linen-100 px-4 text-sm text-ink transition-colors hover:border-amandia-orange peer-checked:border-amandia-green peer-checked:bg-amandia-green peer-checked:text-amandia-cream peer-focus-visible:ring-2 peer-focus-visible:ring-amandia-green/30">
                {strength.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label
        htmlFor="careers-resume"
        className="flex cursor-pointer flex-col items-center gap-1 rounded-3xl border-2 border-dashed border-ceramic-brown/40 bg-linen-200/60 px-6 py-6 text-center transition-colors focus-within:border-amandia-green hover:border-amandia-orange hover:bg-amandia-orange-tint/40"
      >
        <span className="inline-flex items-center gap-2 font-semibold text-heading">
          <UploadIcon />
          {resumeName ?? 'Adicione seu currículo aqui (PDF ou Word)'}
        </span>
        <span className={resumeError ? 'text-sm text-amandia-pink-ink' : 'text-sm text-muted'}>
          {resumeError ??
            (resumeName ? 'Clique para trocar o arquivo.' : 'Opcional. PDF ou Word de até 4 MB.')}
        </span>
        <input
          id="careers-resume"
          name="resume"
          type="file"
          accept={RESUME_ACCEPT}
          className="sr-only"
          onChange={(e) => {
            const file = e.currentTarget.files?.[0];
            handleResumeChange(file);
            if (file && file.size > RESUME_MAX_BYTES) e.currentTarget.value = '';
          }}
        />
      </label>

      {/* Campo-isca para robôs (invisível para pessoas e leitores de tela) */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <label className="flex items-start gap-3 px-2 text-sm leading-relaxed text-muted">
        <input type="checkbox" name="consent" required className="mt-1 size-4 shrink-0 accent-amandia-green" />
        Autorizo o Amandia Café Garden a guardar meus dados e meu currículo para processos seletivos.
      </label>

      <button type="submit" className={buttonClasses('primary', 'mt-2 w-full')}>
        <ChatIcon /> Enviar dados para o WhatsApp
      </button>

      <p className="text-center text-muted" aria-live="polite">
        {sent
          ? resumeName
            ? 'Pronto! Agora anexe seu currículo na conversa do WhatsApp e envie.'
            : 'Pronto! É só enviar a mensagem no WhatsApp.'
          : 'E entraremos em contato.'}
      </p>
    </form>
  );
}

function UploadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9a4 4 0 0 1-.5 8.97" />
      <path d="M12 12v8M9 15l3-3 3 3" />
    </svg>
  );
}
