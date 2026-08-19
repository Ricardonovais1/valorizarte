import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Link de chamada primária (CTA) — centraliza o estilo `.btn-cta` (gradiente
 * de bronze + brilho deslizante + elevação) para os botões de ação do site.
 */
export function CtaLink({
  href,
  onClick,
  className = '',
  children,
}: {
  href: string
  onClick?: () => void
  className?: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`btn-cta rounded-[6px] font-medium text-white ${className}`}
    >
      {children}
    </Link>
  )
}
