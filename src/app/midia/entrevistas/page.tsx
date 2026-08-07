import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Mic } from 'lucide-react'
import { Container } from '@/components/Container'
import { PageHeader } from '@/components/PageHeader'
import { resolveImage } from '@/lib/resolveImage'
import { formatInterviewDate } from '@/lib/formatDate'
import { getInterviews } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Entrevistas',
  description: 'Participações de Gilvan Silva em rádio e TV falando sobre coaching, carreira e gestão.',
}

export default async function EntrevistasPage() {
  const interviews = await getInterviews()

  return (
    <>
      <PageHeader title="Entrevistas" icon />
      <Container className="py-16">
        {interviews.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {interviews.map((interview) => {
              const coverUrl = resolveImage(interview.coverImage, { width: 600, height: 375 })
              const date = formatInterviewDate(interview.publishedAt)

              return (
                <Link
                  key={interview._id}
                  href={`/midia/entrevistas/${interview.slug}`}
                  className="group flex flex-col"
                >
                  <div className="flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-2xl bg-navy">
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={(interview.coverImage as { alt?: string })?.alt || interview.title}
                        width={600}
                        height={375}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <Mic size={40} className="text-teal" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col pt-4">
                    {interview.outlet && (
                      <span className="text-xs font-semibold uppercase tracking-wide text-teal">
                        {interview.outlet}
                      </span>
                    )}
                    <h2 className="mt-2 text-lg font-semibold text-navy group-hover:text-teal-dark">
                      {interview.title}
                    </h2>
                    {date && <p className="mt-2 text-sm text-slate-500">{date}</p>}
                    <span className="mt-3 text-sm font-medium text-teal">Ouvir a entrevista</span>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="text-center text-slate-500">Nenhuma entrevista cadastrada ainda.</p>
        )}
      </Container>
    </>
  )
}
