import { Compass, GraduationCap, Lightbulb, TreeDeciduous } from 'lucide-react'
import { Container } from './Container'
import { CtaLink } from './CtaLink'
import { Reveal } from './Reveal'

const PILLARS = [
  {
    title: 'Conselho Consultivo',
    icon: Compass,
    description: 'Análise especializada para decisões mais seguras e rotas estratégicas claras.',
  },
  {
    title: 'Coaching e Mentoring',
    icon: Lightbulb,
    description: 'Acompanhamento próximo para acelerar o desenvolvimento de líderes e equipes.',
  },
  {
    title: 'Cursos e Palestras',
    icon: GraduationCap,
    description: 'Capacitações práticas que fortalecem equipes e impulsionam a performance.',
  },
  {
    title: 'Programa de Aposentadoria',
    icon: TreeDeciduous,
    description: 'Planejamento estruturado para uma transição de carreira equilibrada e ativa.',
  },
]

export function HowWeHelp({ title, tagline }: { title: string; tagline?: string }) {
  return (
    <section className="py-16">
      <Container className="max-w-3xl text-center">
        <Reveal>
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">{title}</h2>
          {tagline && <p className="mt-3 text-lg font-medium text-teal-deep">{tagline}</p>}
        </Reveal>
      </Container>

      <Container>
        <Reveal delay={0.1} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ title: cardTitle, icon: Icon, description }) => (
            <div
              key={cardTitle}
              className="card-lift flex flex-col items-center rounded-[6px] border border-slate-200 bg-white px-6 py-9 text-center shadow-sm"
            >
              <Icon size={44} strokeWidth={1.5} className="shrink-0 text-navy" />
              <h3 className="mt-5 text-lg font-bold text-navy">{cardTitle}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.15} className="mt-10 text-center">
          <CtaLink href="/empresas" className="inline-block px-10 py-3 text-sm">
            Saiba Mais
          </CtaLink>
        </Reveal>
      </Container>
    </section>
  )
}
