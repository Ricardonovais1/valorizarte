import type { Metadata } from 'next'
import { Container } from '@/components/Container'
import { PageHeader } from '@/components/PageHeader'
import { ServiceCard } from '@/components/ServiceCard'
import { NewsletterForm } from '@/components/NewsletterForm'
import { getServices } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Para Profissionais',
  description: 'Coaching, assessoria, mentoring, treinamentos abertos, programa de aposentadoria e assessments para profissionais.',
}

export default async function ProfissionaisPage() {
  const services = await getServices()
  // Programa de Aposentadoria e Assessments também aparecem em "Para
  // Empresas": o Gilvan presta os dois serviços tanto para PJ quanto PF.
  const carreiraExtras = services.filter((s) => ['programa-aposentadoria', 'assessments'].includes(s.slug))
  const profissionaisServices = [...services.filter((s) => s.audience === 'profissionais'), ...carreiraExtras]

  return (
    <>
      <PageHeader title="Para Profissionais" icon />
      <Container className="py-16">
        {profissionaisServices.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {profissionaisServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500">Nenhum serviço cadastrado ainda.</p>
        )}

        <div className="mx-auto mt-16 max-w-2xl">
          <NewsletterForm source="profissionais" />
        </div>
      </Container>
    </>
  )
}
