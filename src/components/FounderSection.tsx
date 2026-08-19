import Image from 'next/image'
import { resolveImage } from '@/lib/resolveImage'
import { Container } from './Container'
import { CtaLink } from './CtaLink'

export function FounderSection({
  founderIntro,
  founderPhoto,
  id = 'gilvan',
}: {
  founderIntro?: string
  founderPhoto?: unknown
  id?: string
}) {
  if (!founderIntro) return null
  const photo = resolveImage(founderPhoto, { width: 1030, height: 636 })

  return (
    <section className="relative scroll-mt-24 overflow-hidden bg-navy py-20" id={id}>
      <div className="texture-grain pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay" aria-hidden="true" />
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold text-white">Gilvan Silva</h2>
          <p className="mt-2 text-lg text-teal">Fundador da Valorizarte</p>
          <p className="mt-5 leading-relaxed text-white/80">{founderIntro}</p>
          <CtaLink href="/quemsomos" className="mt-6 inline-block px-[50px] py-3 text-sm">
            Saiba Mais
          </CtaLink>
        </div>
        {photo && (
          <div className="group overflow-hidden rounded-[3px]">
            <Image
              src={photo}
              alt="Gilvan Silva"
              width={1030}
              height={636}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
      </Container>
    </section>
  )
}
