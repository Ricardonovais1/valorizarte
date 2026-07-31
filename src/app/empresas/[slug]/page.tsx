import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { Container } from '@/components/Container'
import { PageHeader } from '@/components/PageHeader'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'
import { BoldText } from '@/components/BoldText'
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

function ServiceImage({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[3px] lg:mx-0 lg:max-w-none">
      {src ? (
        <Image src={src} alt={alt} width={420} height={470} className="h-full w-full object-cover" />
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-navy">
          <Image src="/images/logo-gold-icon.png" alt="" width={63} height={40} />
        </div>
      )}
    </div>
  )
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) notFound()

  const imageUrl = resolveImage(service.image, { width: 420, height: 470 })
  const hasContent = Boolean(service.body || (service.highlights && service.highlights.length > 0))

  return (
    <>
      <PageHeader title={service.title} icon />
      <Container className="space-y-12 py-12">
        {service.summary && (
          <p className="mx-auto max-w-3xl text-center text-[30px] font-semibold leading-tight text-navy">
            {service.summary}
          </p>
        )}

        <div className="space-y-16">
          {hasContent && (
            <div className="grid gap-6 lg:grid-cols-[30%_1fr] lg:items-start">
              <ServiceImage src={imageUrl} alt={service.title} />
              <div className="font-roboto text-[17px] leading-relaxed text-slate-700">
                {Boolean(service.body) && <PortableTextRenderer value={service.body} />}

                {service.highlights && service.highlights.length > 0 && (
                  <ul className="mt-2 space-y-3">
                    {service.highlights.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check size={18} className="mt-0.5 shrink-0 text-teal" />
                        <span>
                          <BoldText text={item} />
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
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
      </Container>
    </>
  )
}
