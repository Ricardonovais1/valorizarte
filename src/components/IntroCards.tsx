import Image from 'next/image'
import { Container } from './Container'

const cards = [
  {
    title: 'Empresas',
    icon: '/images/icons/empresas.png',
    description:
      'Mostre o valor da sua empresa. Com um posicionamento estratégico, sua autoridade se destaca e novas oportunidades de crescimento se abrem.',
  },
  {
    title: 'Líderes',
    icon: '/images/icons/lideres.png',
    description:
      'Se você já lidera um time ou quer se tornar referência no seu mercado, oferecemos as melhores estratégias para fortalecer sua autoridade e impulsionar seus ganhos.',
  },
  {
    title: 'Empreendedores',
    icon: '/images/icons/empreendedores.png',
    description:
      'Já tem um negócio, mas sente que pode ir além? Supere desafios, otimize processos e escale sua empresa com estratégia e eficiência.',
  },
]

export function IntroCards() {
  return (
    <section className="bg-wave-navy pb-16 pt-24">
      <Container>
        <div className="relative z-10 -mt-32 grid gap-6 sm:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col items-center rounded-[3px] bg-navy px-8 py-10 text-center shadow-xl"
            >
              <Image src={card.icon} alt="" width={64} height={64} />
              <h3 className="mt-4 text-lg font-semibold text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{card.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
