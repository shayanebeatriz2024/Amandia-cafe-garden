'use client';

import { useState, type FormEvent } from 'react';
import { buildWhatsAppUrl } from '@/lib/links';
import { trackEvent } from '@/lib/analytics';
import { buttonClasses } from '@/components/ui/button-styles';
import { ChatIcon } from '@/components/ui/icons';

const RESUME_ACCEPT =
  '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

type Candidate = {
  name: string;
  email: string;
  phone: string;
  about: string;
  resumeName: string | null;
};

/** Mensagem no mesmo formato das reservas: saudação + dados + 🌿. */
function applicationMessage({ name, email, phone, about, resumeName }: Candidate): string {
  return [
    'Olá! Gostaria de trabalhar no Amandia. 🌿',
    '',
    `*Nome:* ${name}`,
    `*E-mail:* ${email}`,
    `*Celular:* ${phone}`,
    `*Sobre mim:* ${about}`,
    resumeName && `*Currículo:* ${resumeName} (vou anexar nesta conversa)`,
  ]
    .filter((line) => line !== null)
    .join('\n');
}

/**
 * Cadastro do Trabalhe Conosco. O link wa.me só leva texto, então o currículo
 * escolhido aparece na mensagem e o candidato o anexa na própria conversa.
 */
export function WorkWithUsForm() {
  const [resumeName, setResumeName] = useState<string | null>(null);
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
        resumeName,
      }),
    );

    trackEvent('click_whatsapp', { placement: 'careers', item_name: 'Trabalhe Conosco', link_url: href });
    window.open(href, '_blank', 'noopener,noreferrer');
    setSent(true);
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
        placeholder="Fale um pouco sobre você (seus pontos fortes)"
        required
        className="form-field resize-y rounded-3xl"
      />

      <label
        htmlFor="careers-resume"
        className="flex cursor-pointer flex-col items-center gap-1 rounded-3xl border-2 border-dashed border-ceramic-brown/40 bg-linen-200/60 px-6 py-6 text-center transition-colors focus-within:border-amandia-green hover:border-amandia-orange hover:bg-amandia-orange-tint/40"
      >
        <span className="inline-flex items-center gap-2 font-semibold text-heading">
          <UploadIcon />
          {resumeName ?? 'Adicione seu currículo aqui (PDF ou Word)'}
        </span>
        <span className="text-sm text-muted">
          {resumeName
            ? 'Clique para trocar o arquivo.'
            : 'Opcional. Você anexa o arquivo na conversa do WhatsApp.'}
        </span>
        <input
          id="careers-resume"
          name="resume"
          type="file"
          accept={RESUME_ACCEPT}
          className="sr-only"
          onChange={(e) => setResumeName(e.currentTarget.files?.[0]?.name ?? null)}
        />
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
