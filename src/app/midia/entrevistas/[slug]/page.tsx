import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Container } from '@/components/Container'
import { PageHeader } from '@/components/PageHeader'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'
import { NewsletterForm } from '@/components/NewsletterForm'
import { resolveImage } from '@/lib/resolveImage'
import { formatInterviewDate } from '@/lib/formatDate'
import { getInterviewBySlug, getInterviews } from '@/lib/data'

export async function generateStaticParams() {
  const interviews = await getInterviews()
  return interviews.map((interview) => ({ slug: interview.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const interview = await getInterviewBySlug(slug)
  if (!interview) return {}
  return {
    title: (interview.seo as { title?: string })?.title || interview.title,
    description:
      (interview.seo as { description?: string })?.description ||
      `Entrevista de Gilvan Silva${interview.outlet ? ` na ${interview.outlet}` : ''}.`,
  }
}

// O ID do vídeo pode vir como youtube.com/watch?v=, youtu.be/ ou youtube.com/live/.
function youtubeEmbedUrl(url?: string): string | undefined {
  if (!url) return undefined
  const match = url.match(/(?:youtu\.be\/|\/live\/|\/embed\/|[?&]v=)([A-Za-z0-9_-]{11})/)
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : undefined
}

export default async function EntrevistaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const interview = await getInterviewBySlug(slug)
  if (!interview) notFound()

  const coverUrl = resolveImage(interview.coverImage, { width: 1200, height: 600 })
  const date = formatInterviewDate(interview.publishedAt)
  const videoEmbed = youtubeEmbedUrl(interview.videoUrl)
  const tracks = interview.audioTracks ?? []

  return (
    <>
      <PageHeader title={interview.title} />
      <Container className="space-y-12 py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
            {interview.outlet && (
              <span className="font-semibold uppercase tracking-wide text-teal">{interview.outlet}</span>
            )}
            {date && <span>{date}</span>}
          </div>

          {coverUrl && (
            <Image
              src={coverUrl}
              alt={(interview.coverImage as { alt?: string })?.alt || interview.title}
              width={1200}
              height={600}
              className="w-full rounded-[3px] object-cover"
            />
          )}

          {videoEmbed && (
            <div className="aspect-video w-full overflow-hidden rounded-[3px] bg-navy">
              <iframe
                src={videoEmbed}
                title={interview.title}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          )}

          {tracks.length > 0 && (
            <div className="space-y-4">
              {tracks.map((track, i) => (
                <div key={track.url} className="rounded-[3px] bg-white p-4 shadow-sm ring-1 ring-slate-200/70">
                  {tracks.length > 1 && (
                    <p className="mb-2 text-sm font-semibold text-navy">{track.label || `Bloco ${i + 1}`}</p>
                  )}
                  <audio controls preload="none" src={track.url} className="w-full">
                    <a href={track.url}>Baixar o áudio da entrevista</a>
                  </audio>
                </div>
              ))}
            </div>
          )}

          {!videoEmbed && tracks.length === 0 && (
            <p className="rounded-[3px] border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              O áudio desta entrevista ainda não foi cadastrado no Studio.
            </p>
          )}

          {Boolean(interview.body) && (
            <div className="font-roboto text-[17px] leading-relaxed text-slate-700">
              <PortableTextRenderer value={interview.body} />
            </div>
          )}

          <Link
            href="/midia/entrevistas"
            className="inline-flex items-center gap-2 text-sm font-medium text-teal hover:text-teal-dark"
          >
            <ArrowLeft size={16} />
            Todas as entrevistas
          </Link>
        </div>

        <div className="mx-auto max-w-2xl">
          <NewsletterForm source={`entrevista-${slug}`} />
        </div>
      </Container>
    </>
  )
}
