import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'
import { ServiceCard } from '@/components/ServiceCard'
import { PostCard } from '@/components/PostCard'
import { TestimonialCarousel } from '@/components/TestimonialCarousel'
import { ClientLogos } from '@/components/ClientLogos'
import { Hero, type HeroSlide } from '@/components/Hero'
import { IntroCards } from '@/components/IntroCards'
import { NewsletterForm } from '@/components/NewsletterForm'
import { resolveImage } from '@/lib/resolveImage'
import {
  getClientLogos,
  getGallery,
  getHomePage,
  getPosts,
  getServices,
  getTestimonials,
} from '@/lib/data'

export default async function HomePage() {
  const [home, services, posts, testimonials, clientLogos] = await Promise.all([
    getHomePage(),
    getServices(),
    getPosts(),
    getTestimonials(),
    getClientLogos(),
    getGallery(),
  ])

  const empresasServices = services.filter((s) => s.audience === 'empresas').slice(0, 6)
  // "Para sua carreira" no site real mostra os 4 serviços de profissionais
  // e repete Programa de Aposentadoria e Assessments (que também aparecem
  // em "Para Empresas"), fechando 2 fileiras de 3.
  const carreiraExtras = services.filter((s) => ['programa-aposentadoria', 'assessments'].includes(s.slug))
  const profissionaisServices = [...services.filter((s) => s.audience === 'profissionais'), ...carreiraExtras]
  const latestPosts = posts.slice(0, 3)

  const heroSlides: HeroSlide[] =
    home?.heroSlides?.length > 0
      ? home.heroSlides
      : home?.heroHeadline
        ? [{ headline: home.heroHeadline, subtext: home.heroSubtext, ctaLabel: undefined, ctaHref: undefined }]
        : []

  const founderPhoto = resolveImage(home?.founderPhoto, { width: 1030, height: 636 })

  return (
    <>
      <Hero slides={heroSlides} />

      <IntroCards />

      {home?.founderIntro && (
        <section className="bg-navy pb-20" id="gilvan">
          <Container className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-white">Gilvan Silva</h2>
              <p className="mt-2 text-lg text-teal">Fundador da Valorizarte</p>
              <p className="mt-5 leading-relaxed text-white/80">{home.founderIntro}</p>
              <Link
                href="/quemsomos"
                className="mt-6 inline-block rounded-[5px] bg-gold px-[50px] py-3 text-sm font-medium text-white transition hover:brightness-95"
              >
                Saiba Mais
              </Link>
            </div>
            {founderPhoto && (
              <div className="overflow-hidden rounded-[3px]">
                <Image
                  src={founderPhoto}
                  alt="Gilvan Silva"
                  width={1030}
                  height={636}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </Container>
        </section>
      )}

      {home?.showClientLogos !== false && <ClientLogos logos={clientLogos} />}

      {empresasServices.length > 0 && (
        <section className="py-16">
          <Container>
            <h2 className="text-left text-[60px] font-bold leading-tight text-navy">Para empresas</h2>
            <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {empresasServices.map((service) => (
                <ServiceCard key={service._id} service={service} variant="plain" size="lg" />
              ))}
            </div>
          </Container>
        </section>
      )}

      {profissionaisServices.length > 0 && (
        <section className="bg-navy py-16">
          <Container>
            <h2 className="text-left text-[60px] font-bold leading-tight text-white">Para sua carreira</h2>
            <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {profissionaisServices.map((service) => (
                <ServiceCard key={service._id} service={service} variant="plain" dark size="lg" />
              ))}
            </div>
          </Container>
        </section>
      )}

      {home?.showTestimonials !== false && (
        <section className="py-20" id="depoimentos">
          <Container>
            <SectionHeading title="Relatos de clientes" />
            {testimonials.length > 0 ? (
              <div className="mt-12">
                <TestimonialCarousel testimonials={testimonials} />
              </div>
            ) : (
              <p className="mt-10 text-center text-sm text-slate-500">
                Os depoimentos de clientes vão aparecer aqui assim que forem cadastrados no Studio.
              </p>
            )}
          </Container>
        </section>
      )}

      {latestPosts.length > 0 && (
        <section className="bg-slate-50 py-16">
          <Container>
            <SectionHeading title="Blog" />
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/blog" className="text-sm font-medium text-teal hover:text-teal-dark">
                Ver todos os posts →
              </Link>
            </div>
          </Container>
        </section>
      )}

      <section className="py-16" id="newsletter">
        <Container className="max-w-2xl">
          <NewsletterForm source="home" />
        </Container>
      </section>
    </>
  )
}
