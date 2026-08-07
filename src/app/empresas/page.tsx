import type { Metadata } from 'next'
import { Container } from '@/components/Container'
import { PageHeader } from '@/components/PageHeader'
import { ServiceCard } from '@/components/ServiceCard'
import { NewsletterForm } from '@/components/NewsletterForm'
import { getServices } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Para Empresas',
  description:
    'Conselho consultivo, palestras e treinamentos, consultoria empresarial, coaching e mentoring, programa de aposentadoria e assessments para empresas.',
}

export default async function EmpresasPage() {
  const services = await getServices()
  const empresasServices = services.filter((s) => s.audience === 'empresas')

  return (
    <>
      <PageHeader title="Para Empresas" icon />
      <Container className="py-16">
        {empresasServices.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {empresasServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500">Nenhum serviço cadastrado ainda.</p>
        )}

        <div className="mx-auto mt-16 max-w-2xl">
          <NewsletterForm source="empresas" />
        </div>
      </Container>
    </>
  )
}
