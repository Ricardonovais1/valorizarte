'use client'

import { useActionState, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import { subscribeAction, type NewsletterFormState } from '@/lib/actions/newsletter'
import { NewsletterSuccessModal } from './NewsletterSuccessModal'
import { marcarPopupComoResolvido, popupJaResolvido } from '@/lib/newsletterPopupSeen'

const DELAY_MS = 8000
const initialState: NewsletterFormState = { status: 'idle' }

export function NewsletterPopup() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [state, formAction, isPending] = useActionState(subscribeAction, initialState)
  const [statusAnterior, setStatusAnterior] = useState(state.status)

  useEffect(() => {
    if (pathname.startsWith('/studio')) return
    if (typeof window === 'undefined') return
    if (popupJaResolvido()) return

    // A checagem se repete DENTRO do timer, não só aqui: entre montar o
    // efeito e os 8s passarem, a pessoa pode ter se inscrito pelo
    // formulário da página — e aí o convite não deve mais aparecer.
    const timer = setTimeout(() => {
      if (popupJaResolvido()) return
      setOpen(true)
    }, DELAY_MS)
    return () => clearTimeout(timer)
  }, [pathname])

  const close = () => {
    setOpen(false)
    marcarPopupComoResolvido()
  }

  // Depois de um cadastro bem-sucedido, não perguntar de novo — mesmo que
  // a pessoa não clique no X para fechar.
  useEffect(() => {
    if (state.status === 'success') {
      marcarPopupComoResolvido()
    }
  }, [state.status])

  // Troca de diálogo na transição para "success": o popup sai de cena e o
  // modal de confirmação entra no lugar — dois empilhados seriam confusos.
  // Fica aqui, e não no efeito acima, porque é ajuste de estado; o efeito
  // guarda só o que é efeito de verdade (gravar no localStorage).
  if (state.status !== statusAnterior) {
    setStatusAnterior(state.status)
    if (state.status === 'success') {
      setOpen(false)
      setShowSuccess(true)
    }
  }

  if (pathname.startsWith('/studio')) return null

  return (
    <>
      <NewsletterSuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} />

      <AnimatePresence>
      {open && (
        <motion.div key="newsletter-popup">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-black/50"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label="Faça parte da lista VIP da Valorizarte"
            className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-sm sm:inset-x-auto sm:bottom-8 sm:right-8"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
              <button
                type="button"
                aria-label="Fechar"
                onClick={close}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-navy shadow-md transition hover:bg-white"
              >
                <X size={16} />
              </button>

              <div className="popup-arc-banner flex justify-center bg-navy pb-8 pt-8">
                <Image src="/images/logo-gold-icon.png" alt="" width={110} height={70} />
              </div>

              <div className="px-6 pb-6 pt-4">
                <h2 className="text-center text-xl font-bold leading-snug text-navy">
                  Faça parte da lista VIP da Valorizarte e tenha acesso antecipado a insights
                </h2>

                <form action={formAction} className="mt-5 flex flex-col gap-3">
                  <input type="hidden" name="source" value="popup-vip" />

                  {/* Campo-armadilha (honeypot): escondido de humanos. */}
                  <div className="absolute -left-[9999px]" aria-hidden="true">
                    <label htmlFor="company-popup">Não preencha este campo</label>
                    <input id="company-popup" type="text" name="company" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div>
                    <label htmlFor="email-popup" className="sr-only">
                      Endereço de e-mail
                    </label>
                    <input
                      id="email-popup"
                      type="email"
                      name="email"
                      required
                      placeholder="Endereço de e-mail *"
                      className="w-full rounded-lg bg-slate-100 px-4 py-3 text-sm text-navy placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-bright"
                    />
                  </div>

                  <div>
                    <label htmlFor="name-popup" className="sr-only">
                      Nome
                    </label>
                    <input
                      id="name-popup"
                      type="text"
                      name="name"
                      required
                      placeholder="Nome *"
                      className="w-full rounded-lg bg-slate-100 px-4 py-3 text-sm text-navy placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-bright"
                    />
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      id="consent-popup"
                      type="checkbox"
                      name="consent"
                      required
                      className="mt-0.5 h-4 w-4 shrink-0 rounded-[3px] accent-gold-bright focus:outline-none focus:ring-2 focus:ring-gold-bright"
                    />
                    <label htmlFor="consent-popup" className="text-xs leading-snug text-slate-600">
                      Li e aceito as{' '}
                      {/* Abre em nova aba de propósito: o popup cobre a página e
                          guarda o que já foi digitado — navegar aqui dentro faria a
                          pessoa perder o formulário preenchido. */}
                      <Link
                        href="/politicas-de-privacidade"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-deep underline underline-offset-2"
                      >
                        Políticas de Privacidade
                      </Link>
                      .
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="mt-1 rounded-xl bg-black py-3.5 text-sm font-bold text-gold-bright transition hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPending ? 'Enviando…' : 'Entrar para a lista VIP'}
                  </button>
                </form>

                {state.status !== 'idle' && state.message && (
                  <p
                    role="status"
                    className={`mt-3 text-center text-sm ${
                      state.status === 'success' ? 'text-emerald-700' : 'text-red-700'
                    }`}
                  >
                    {state.message}
                  </p>
                )}

                <p className="mt-4 text-center text-xs text-slate-500">
                  Não fazemos spam! Você pode cancelar o recebimento a qualquer momento.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  )
}
