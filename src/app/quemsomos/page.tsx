import type { Metadata } from 'next'
import Image from 'next/image'
import { Container } from '@/components/Container'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'
import { FounderSection } from '@/components/FounderSection'
import { ClientLogos } from '@/components/ClientLogos'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { getClientLogos, getHomePage, getPageBySlug, getTestimonials } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Quem Somos',
  description:
    'Conheça a Valorizarte: sobre a marca, o sócio fundador Gilvan Silva, os principais clientes e relatos de quem já viveu o processo.',
}

export default async function QuemSomosPage() {
  const [page, home, testimonials, clientLogos] = await Promise.all([
    getPageBySlug('quemsomos'),
    getHomePage(),
    getTestimonials(),
    getClientLogos(),
  ])

  return (
    <>
      <section id="a-valorizarte" className="scroll-mt-24">
        <div className="relative aspect-[64/15] w-full overflow-hidden bg-navy">
          <Image
            src="/images/pages/a-valorizarte-banner.png"
            alt="Valorizarte — desenvolvimento empresarial e profissional"
            fill
            priority
            className="object-cover"
          />
        </div>
        <Container className="max-w-3xl py-16">
          {page?.intro && <p className="text-lg text-slate-600">{page.intro}</p>}
          <div className="mt-8">
            <PortableTextRenderer value={page?.body} />
          </div>
        </Container>
      </section>

      <FounderSection founderIntro={home?.founderIntro} founderPhoto={home?.founderPhoto} id="socio-fundador" />

      <ClientLogos logos={clientLogos} id="principais-clientes" />

      <TestimonialsSection testimonials={testimonials} id="relatos-de-clientes" />
    </>
  )
}
