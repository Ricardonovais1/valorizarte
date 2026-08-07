import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Camera, Link2, Mic, Play } from 'lucide-react'
import { Container } from '@/components/Container'
import { PageHeader } from '@/components/PageHeader'
import { NewsletterForm } from '@/components/NewsletterForm'
import { resolveImage } from '@/lib/resolveImage'
import { getGallery, getInterviews } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Mídia',
  description: 'Entrevistas de rádio e TV, fotos de eventos, dicas de carreira e links da Valorizarte.',
}

const sections = [
  {
    href: '/midia/entrevistas',
    title: 'Entrevistas',
    description: 'Participações do Gilvan Silva em rádio e TV falando sobre coaching, carreira e gestão.',
    Icon: Mic,
  },
  {
    href: '/midia/fotos',
    title: 'Fotos',
    description: 'Registros de palestras, formações e encontros ao longo da trajetória da Valorizarte.',
    Icon: Camera,
  },
  {
    href: '/links-uteis',
    title: 'Links Importantes',
    description: 'Podcast, redes sociais, newsletter e os demais canais em um só lugar.',
    Icon: Link2,
  },
  {
    href: '/dicas-de-carreira',
    title: 'Dicas de Carreira',
    description: 'Vídeos curtos com orientações práticas sobre propósito, transição e desenvolvimento.',
    Icon: Play,
  },
]

export default async function MidiaPage() {
  const [interviews, gallery] = await Promise.all([getInterviews(), getGallery()])
  const photoStrip = gallery.slice(0, 4)

  return (
    <>
      <PageHeader title="Mídia" icon />
      <Container className="space-y-16 py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {sections.map(({ href, title, description, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex gap-5 rounded-[3px] bg-white p-6 shadow-sm ring-1 ring-slate-200/70 transition hover:shadow-md hover:ring-teal/40"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal/15 text-teal transition group-hover:bg-teal group-hover:text-white">
                <Icon size={22} />
              </span>
              <span className="flex flex-col">
                <span className="text-lg font-semibold text-navy group-hover:text-teal-dark">{title}</span>
                <span className="mt-1 text-sm leading-relaxed text-slate-600">{description}</span>
              </span>
            </Link>
          ))}
        </div>

        {interviews.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-navy">Últimas entrevistas</h2>
            <ul className="mt-6 divide-y divide-slate-200 border-t border-slate-200">
              {interviews.slice(0, 3).map((interview) => (
                <li key={interview._id}>
                  <Link
                    href={`/midia/entrevistas/${interview.slug}`}
                    className="group flex items-center justify-between gap-4 py-4"
                  >
                    <span>
                      <span className="block font-medium text-navy group-hover:text-teal-dark">
                        {interview.title}
                      </span>
                      {interview.outlet && (
                        <span className="mt-0.5 block text-sm text-slate-500">{interview.outlet}</span>
                      )}
                    </span>
                    <span className="shrink-0 text-sm font-medium text-teal">Ouvir →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {photoStrip.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-2xl font-bold text-navy">Galeria de fotos</h2>
              <Link href="/midia/fotos" className="text-sm font-medium text-teal hover:text-teal-dark">
                Ver todas →
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {photoStrip.map((photo) => {
                const src = resolveImage(photo.image, { width: 400, height: 300 })
                if (!src) return null
                return (
                  <div key={photo._id} className="aspect-[4/3] overflow-hidden rounded-[3px] bg-slate-100">
                    <Image
                      src={src}
                      alt={photo.alt}
                      width={400}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )
              })}
            </div>
          </section>
        )}

        <div className="mx-auto max-w-2xl">
          <NewsletterForm source="midia" />
        </div>
      </Container>
    </>
  )
}
