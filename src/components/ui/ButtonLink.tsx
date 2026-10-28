import Link from 'next/link';
import type { ComponentProps } from 'react';
import { buttonClasses, type ButtonVariant } from './button-styles';

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
};

/** Navegação interna com aparência de botão (Server Component, zero JS extra). */
export function ButtonLink({ variant = 'primary', className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}
