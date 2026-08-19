import type { ButtonHTMLAttributes, ReactNode } from 'react'

/**
 * Botão de chamada primária (CTA) — mesma linguagem do `CtaLink`, mas para
 * `<button>` (ex.: submit de formulário). Centraliza o estilo `.btn-cta`.
 */
export function CtaButton({
  type = 'button',
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button type={type} {...props} className={`btn-cta rounded-[6px] font-medium text-white ${className}`}>
      {children}
    </button>
  )
}
