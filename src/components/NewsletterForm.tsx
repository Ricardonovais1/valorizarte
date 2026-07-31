'use client'

import { useActionState } from 'react'
import { subscribeAction, type NewsletterFormState } from '@/lib/actions/newsletter'

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

  return (
    <div className="rounded-[3px] bg-sage/60 p-6 sm:p-8">
      <h3 className="text-lg font-semibold text-navy">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{description}</p>

      <form action={formAction} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
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

        <button
          type="submit"
          disabled={isPending}
          className="rounded-[5px] bg-gold px-6 py-2.5 text-sm font-medium text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Enviando…' : 'Quero receber'}
        </button>
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
    </div>
  )
}
