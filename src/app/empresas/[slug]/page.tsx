import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { Container } from '@/components/Container'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'
import { BoldText } from '@/components/BoldText'
import { ServiceTabs } from '@/components/ServiceTabs'
import { NewsletterForm } from '@/components/NewsletterForm'
import { resolveImage } from '@/lib/resolveImage'
import { getServiceBySlug, getServices } from '@/lib/data'

export async function generateStaticParams() {
  const services = await getServices()
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return {}
  return {
    title: (service.seo as { title?: string })?.title || service.title,
    description: (service.seo as { description?: string })?.description || service.summary,
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) notFound()

  const imageUrl = resolveImage(service.image, { width: 420, height: 470 })
  const headerImageUrl = resolveImage(service.headerImage, { width: 1600, height: 300 })
  const tabSections = service.tabSections ?? []
  const hasContent = Boolean(
    service.body || (service.highlights && service.highlights.length > 0) || tabSections.length > 0,
  )

  const textBlock = (
    <div className="font-roboto text-[17px] leading-relaxed text-slate-700">
      {Boolean(service.body) && <PortableTextRenderer value={service.body} />}

      {service.highlights && service.highlights.length > 0 && (
        <ul className="mt-2 space-y-3">
          {service.highlights.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <Check size={18} className="mt-0.5 shrink-0 text-teal-deep" />
              <span>
                <BoldText text={item} />
              </span>
            </li>
          ))}
        </ul>
      )}

      {service.closingText && <p className="mt-6">{service.closingText}</p>}
    </div>
  )

  const content = (
    <div className="space-y-12">
      {headerImageUrl ? (
        <h1 className="sr-only">{service.title}</h1>
      ) : (
        <div className="flex items-center justify-center gap-3">
          <Image src="/images/logo-gold-icon.png" alt="" width={40} height={26} />
          <h1 className="text-3xl font-bold text-navy sm:text-4xl">{service.title}</h1>
        </div>
      )}

      {service.summary && (
        <p className="mx-auto max-w-3xl text-center text-[30px] font-semibold leading-tight text-navy">
          {service.summary}
        </p>
      )}

      <div className="space-y-16">
        {tabSections.length > 0 &&
          tabSections.map((section, i) => {
            const sectionImageUrl = resolveImage(section.image ?? service.image, { width: 420, height: 470 })
            return (
              <div key={i}>
                <div className="grid gap-6 lg:grid-cols-[30%_1fr] lg:items-start">
                  {sectionImageUrl && (
                    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[3px] lg:mx-0 lg:max-w-none">
                      <Image
                        src={sectionImageUrl}
                        alt={section.title || service.title}
                        width={420}
                        height={470}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    {section.title && <h2 className="mb-4 text-2xl font-bold text-navy">{section.title}</h2>}
                    <div className="font-roboto text-[17px] leading-relaxed text-slate-700">
                      <ServiceTabs tabs={section.tabs} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

        {tabSections.length === 0 && hasContent && (
          <>
            {imageUrl ? (
              <div className="grid gap-6 lg:grid-cols-[30%_1fr] lg:items-start">
                <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[3px] lg:mx-0 lg:max-w-none">
                  <Image
                    src={imageUrl}
                    alt={service.title}
                    width={420}
                    height={470}
                    className="h-full w-full object-cover"
                  />
                </div>
                {textBlock}
              </div>
            ) : (
              <div className="mx-auto max-w-3xl">{textBlock}</div>
            )}
          </>
        )}

        {!hasContent && (
          <p className="rounded-[3px] border border-dashed border-slate-300 p-6 text-sm text-slate-500">
            A descrição completa deste serviço ainda não foi cadastrada no Studio.
          </p>
        )}

        <div className="mx-auto max-w-2xl">
          <NewsletterForm source={`service-${slug}`} />
        </div>
      </div>
    </div>
  )

  if (!headerImageUrl) {
    return <Container className="space-y-12 pb-12 pt-14">{content}</Container>
  }

  return (
    <Container className="py-10">
      <div className="bg-white p-8 sm:p-10">
        <div className="relative aspect-[16/3] w-full overflow-hidden rounded-[3px] bg-navy">
          <Image
            src={headerImageUrl}
            alt={service.title}
            fill
            priority
            sizes="(min-width: 1280px) 1152px, 90vw"
            className="object-cover"
          />
        </div>
        <div className="mt-10">{content}</div>
      </div>
    </Container>
  )
}
