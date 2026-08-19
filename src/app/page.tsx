import Link from 'next/link'
import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { ServiceCard } from '@/components/ServiceCard'
import { PostCard } from '@/components/PostCard'
import { ClientLogos } from '@/components/ClientLogos'
import { FounderSection } from '@/components/FounderSection'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { Hero, type HeroSlide } from '@/components/Hero'
import { IntroCards } from '@/components/IntroCards'
import { HowWeHelp } from '@/components/HowWeHelp'
import { NewsletterForm } from '@/components/NewsletterForm'
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

  return (
    <>
      <Hero slides={heroSlides} />

      <IntroCards />

      <FounderSection founderIntro={home?.founderIntro} founderPhoto={home?.founderPhoto} id="gilvan" />

      {home?.howWeHelpTitle && <HowWeHelp title={home.howWeHelpTitle} tagline={home.howWeHelpTagline} />}

      {home?.showClientLogos !== false && <ClientLogos logos={clientLogos} id="principais-clientes" />}

      {empresasServices.length > 0 && (
        <section className="py-16">
          <Container>
            <Reveal>
              <h2 className="text-left text-4xl font-bold leading-tight text-navy sm:text-5xl lg:text-[60px]">Para empresas</h2>
              <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {empresasServices.map((service) => (
                  <ServiceCard key={service._id} service={service} variant="plain" size="lg" />
                ))}
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      {profissionaisServices.length > 0 && (
        <section className="bg-navy py-16">
          <Container>
            <Reveal>
              <h2 className="text-left text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-[60px]">Para sua carreira</h2>
              <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {profissionaisServices.map((service) => (
                  <ServiceCard key={service._id} service={service} variant="plain" dark size="lg" />
                ))}
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      {home?.showTestimonials !== false && (
        <TestimonialsSection testimonials={testimonials} id="relatos-de-clientes" />
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
              <Link href="/blog" className="text-sm font-medium text-teal-deep hover:text-teal-dark">
                Ver todos os posts →
              </Link>
            </div>
          </Container>
        </section>
      )}

      <section className="bg-dots py-16" id="newsletter">
        <Container className="max-w-2xl">
          <Reveal>
            <NewsletterForm source="home" />
          </Reveal>
        </Container>
      </section>
    </>
  )
}
