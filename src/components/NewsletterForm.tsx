'use client'

import { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import { subscribeAction, type NewsletterFormState } from '@/lib/actions/newsletter'
import { CtaButton } from './CtaButton'
import { NewsletterSuccessModal } from './NewsletterSuccessModal'
import { marcarPopupComoResolvido } from '@/lib/newsletterPopupSeen'

const initialState: NewsletterFormState = { status: 'idle' }

export function NewsletterForm({
  source,
  title = 'Receba nossos conteúdos',
  description = 'Artigos sobre liderança, estratégia e desenvolvimento profissional, direto no seu e-mail.',
}: {
  source: string
  title?: string
  description?: string
}) {
  const [state, formAction, isPending] = useActionState(subscribeAction, initialState)
  const [showSuccess, setShowSuccess] = useState(false)
  const [statusAnterior, setStatusAnterior] = useState(state.status)

  // A confirmação vira modal em vez de só a mensagem verde: é onde o link
  // da newsletter do LinkedIn aparece, no momento de maior interesse.
  //
  // O modal não pode ser derivado direto de `state.status`, porque a pessoa
  // precisa poder fechá-lo. Então detectamos a TRANSIÇÃO para "success"
  // comparando com o status anterior — ajuste de estado durante a
  // renderização, que é o padrão do React para isto. Em efeito, além de
  // proibido pelo lint, causaria um segundo render desnecessário.
  if (state.status !== statusAnterior) {
    setStatusAnterior(state.status)
    if (state.status === 'success') setShowSuccess(true)
  }

  // Silencia o popup da lista VIP: quem acabou de se inscrever aqui não pode
  // receber, segundos depois, um convite para se inscrever. Vai em efeito, e
  // não no ajuste de estado acima, porque gravar no localStorage é efeito
  // colateral e a renderização precisa continuar pura.
  useEffect(() => {
    if (state.status === 'success') marcarPopupComoResolvido()
  }, [state.status])

  return (
    <div className="rounded-[3px] bg-sage/60 p-6 sm:p-8">
      <h3 className="text-lg font-semibold text-navy">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{description}</p>

      <form action={formAction} className="mt-4 flex flex-col gap-3">
        <input type="hidden" name="source" value={source} />

        {/* Campo-armadilha (honeypot): escondido de humanos, visível para robôs simples. */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor={`company-${source}`}>Não preencha este campo</label>
          <input
            id={`company-${source}`}
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex-1">
            <label htmlFor={`email-${source}`} className="sr-only">
              Seu e-mail
            </label>
            <input
              id={`email-${source}`}
              type="email"
              name="email"
              required
              placeholder="seu@email.com"
              className="w-full rounded-[5px] border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy placeholder:text-slate-400 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>

          <CtaButton
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? 'Enviando…' : 'Quero receber'}
          </CtaButton>
        </div>

        <div className="flex items-start gap-2">
          <input
            id={`consent-${source}`}
            type="checkbox"
            name="consent"
            required
            className="mt-0.5 h-4 w-4 shrink-0 rounded-[3px] border-navy/30 accent-teal focus:outline-none focus:ring-1 focus:ring-teal"
          />
          <label htmlFor={`consent-${source}`} className="text-xs leading-snug text-slate-600">
            Li e aceito as{' '}
            <Link
              href="/politicas-de-privacidade"
              className="font-medium text-teal-deep underline underline-offset-2 transition hover:text-navy"
            >
              Políticas de Privacidade
            </Link>
            .
          </label>
        </div>
      </form>

      {state.status !== 'idle' && state.message && (
        <p
          role="status"
          className={`mt-3 text-sm ${state.status === 'success' ? 'text-emerald-700' : 'text-red-700'}`}
        >
          {state.message}
        </p>
      )}

      <p className="mt-3 text-xs text-slate-500">
        Você pode cancelar o recebimento a qualquer momento. Não fazemos spam nem compartilhamos seu e-mail.
      </p>

      <NewsletterSuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  )
}
