'use client'

import { useEffect } from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import Image from 'next/image'
import { LINKEDIN_NEWSLETTER_URL, NEWSLETTER_HIGHLIGHTS } from '@/content/newsletterSuccess'

/**
 * Confirmação de inscrição, exibida no ato do cadastro.
 *
 * No site anterior isso era um passo a mais: o e-mail de boas-vindas levava
 * a uma página de confirmação, e só de lá a pessoa chegava à newsletter do
 * LinkedIn. Cada passo derruba a conversão, então aqui a confirmação
 * aparece na hora e já oferece o link do LinkedIn direto — sem tirar
 * ninguém da página em que estava.
 */
export function NewsletterSuccessModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Fechar com Esc é o que se espera de qualquer diálogo; sem isso, quem
  // navega por teclado fica preso.
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Trava a rolagem do fundo enquanto o modal está aberto.
  useEffect(() => {
    if (!open) return
    const anterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = anterior
    }
  }, [open])

  // Renderização condicional simples, sem AnimatePresence: com ele, o nó
  // continuava no DOM depois de fechar — invisível, mas `fixed inset-0`,
  // interceptando todos os cliques e travando o site até recarregar. Aqui,
  // fechado significa fora do DOM, ponto. O preço é não ter animação de
  // saída; a de entrada continua.
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-success-title"
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <button
          type="button"
          aria-label="Fechar"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-navy shadow-md transition hover:bg-white"
        >
          <X size={16} />
        </button>

        <div className="popup-arc-banner flex justify-center bg-navy pb-8 pt-8">
          <Image src="/images/logo-gold-icon.png" alt="" width={96} height={61} />
        </div>

        <div className="px-6 pb-6 pt-4 sm:px-8">
          <h2 id="newsletter-success-title" className="text-center text-xl font-bold leading-snug text-navy">
            Parabéns! Agora você faz parte da comunidade Valorizarte.
          </h2>

          <p className="mt-3 text-center text-sm leading-relaxed text-slate-600">
            A partir de agora, você receberá conteúdos preparados para quem deseja viver com mais propósito,
            clareza e ação — seja na vida pessoal, seja na jornada empreendedora.
          </p>

          <p className="mt-6 text-sm font-bold text-navy">O que você vai encontrar na nossa newsletter:</p>

          <ul className="mt-3 space-y-2">
            {NEWSLETTER_HIGHLIGHTS.map(({ emoji, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                <span aria-hidden="true">{emoji}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <a
            href={LINKEDIN_NEWSLETTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center rounded-[4px] bg-[#0A66C2] px-6 py-3.5 text-center text-sm font-semibold text-white shadow-md transition hover:brightness-110"
          >
            Assinar também a newsletter do LinkedIn
          </a>

          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full text-center text-xs text-slate-500 underline underline-offset-2 transition hover:text-navy"
          >
            Continuar navegando
          </button>
        </div>
      </motion.div>
    </div>
  )
}
