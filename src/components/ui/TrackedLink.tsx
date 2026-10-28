'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { trackEvent, type OutboundEventName, type OutboundEventParams } from '@/lib/analytics';
import { buttonClasses, type ButtonVariant } from './button-styles';

type TrackedLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  event: OutboundEventName;
  tracking: Omit<OutboundEventParams, 'link_url'>;
  variant?: ButtonVariant;
  children: ReactNode;
};

/**
 * Link de saída (WhatsApp, Maps, Instagram, telefone) que dispara um evento
 * GA4 antes de navegar. O evento usa transport "beacon", então não há
 * preventDefault nem atraso artificial na navegação.
 */
export function TrackedLink({
  href,
  event,
  tracking,
  variant = 'primary',
  className,
  children,
  onClick,
  ...rest
}: TrackedLinkProps) {
  const isWeb = href.startsWith('http');

  return (
    <a
      href={href}
      {...(isWeb && { target: '_blank', rel: 'noopener noreferrer' })}
      onClick={(e) => {
        trackEvent(event, { ...tracking, link_url: href });
        onClick?.(e);
      }}
      className={buttonClasses(variant, className)}
      {...rest}
    >
      {children}
    </a>
  );
}
