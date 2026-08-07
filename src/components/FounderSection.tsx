import Image from 'next/image'
import Link from 'next/link'
import { resolveImage } from '@/lib/resolveImage'
import { Container } from './Container'

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
    <section className="scroll-mt-24 bg-navy py-20" id={id}>
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold text-white">Gilvan Silva</h2>
          <p className="mt-2 text-lg text-teal">Fundador da Valorizarte</p>
          <p className="mt-5 leading-relaxed text-white/80">{founderIntro}</p>
          <Link
            href="/quemsomos"
            className="mt-6 inline-block rounded-[5px] bg-gold px-[50px] py-3 text-sm font-medium text-white transition hover:brightness-95"
          >
            Saiba Mais
          </Link>
        </div>
        {photo && (
          <div className="overflow-hidden rounded-[3px]">
            <Image
              src={photo}
              alt="Gilvan Silva"
              width={1030}
              height={636}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </Container>
    </section>
  )
}
