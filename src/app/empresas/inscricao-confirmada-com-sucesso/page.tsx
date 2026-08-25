import type { Metadata } from 'next'
import Image from 'next/image'
import { Container } from '@/components/Container'
import { LINKEDIN_NEWSLETTER_URL, NEWSLETTER_HIGHLIGHTS } from '@/content/newsletterSuccess'

export const metadata: Metadata = {
  title: 'Inscrição Confirmada com Sucesso!',
  robots: { index: false, follow: false },
}

/**
 * Esta página era o passo do meio no fluxo antigo: o e-mail levava até
 * aqui e só daqui a pessoa ia para o LinkedIn. Hoje a confirmação acontece
 * num modal, no ato do cadastro, e o e-mail leva direto ao LinkedIn — mas a
 * página continua no ar porque os e-mails já enviados apontam para ela.
 */

export default function InscricaoConfirmadaPage() {
  return (
    <Container className="py-10">
      <div className="bg-white p-8 sm:p-10">
        <div className="relative aspect-[16/3] w-full overflow-hidden rounded-[3px] bg-navy">
          <Image
            src="/images/services/inscricao-confirmada-header.webp"
            alt="Inscrição Confirmada com Sucesso!"
            fill
            priority
            sizes="(min-width: 1280px) 1152px, 90vw"
            className="object-cover"
          />
        </div>

        <div className="mt-10 space-y-12">
          <div className="flex justify-center">
            <a
              href={LINKEDIN_NEWSLETTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[4px] bg-[#0A66C2] px-10 py-4 text-lg font-semibold text-white shadow-md transition hover:brightness-110"
            >
              Newsletter LinkedIn
            </a>
          </div>

          <div className="grid gap-6 lg:grid-cols-[30%_1fr] lg:items-start">
            <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[3px] lg:mx-0 lg:max-w-none">
              <Image
                src="/images/services/inscricao-confirmada-esquerda.webp"
                alt="Alvo de dardo atingido no centro"
                width={420}
                height={470}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="font-roboto text-[17px] leading-relaxed text-slate-700">
              <p className="font-bold text-navy">Parabéns! Agora você faz parte da comunidade Valorizarte.</p>

              <p className="mt-4">
                A partir de agora, você receberá conteúdos cuidadosamente preparados para quem deseja viver com mais
                propósito, clareza e ação — seja na vida pessoal, seja na jornada empreendedora.
              </p>

              <p className="mt-6 font-bold text-navy">O que você vai encontrar na nossa newsletter:</p>

              <ul className="mt-3 space-y-2">
                {NEWSLETTER_HIGHLIGHTS.map(({ emoji, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <span aria-hidden="true">{emoji}</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
