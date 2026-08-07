import type { Metadata } from 'next'
import Image from 'next/image'
import { Container } from '@/components/Container'
import { PageHeader } from '@/components/PageHeader'
import { resolveImage } from '@/lib/resolveImage'
import { getGallery } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Fotos',
  description: 'Registros de palestras, formações e encontros ao longo da trajetória da Valorizarte.',
}

export default async function FotosPage() {
  const gallery = await getGallery()

  return (
    <>
      <PageHeader title="Fotos" icon />
      <Container className="py-16">
        {gallery.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item) => {
              const src = resolveImage(item.image, { width: 900, height: 675 })
              if (!src) return null
              const year = item.eventDate ? new Date(item.eventDate).getUTCFullYear() : undefined

              return (
                <figure key={item._id}>
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100">
                    <Image
                      src={src}
                      alt={item.alt}
                      width={600}
                      height={450}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {(item.caption || year) && (
                    <figcaption className="pt-3">
                      {item.caption && <p className="text-sm font-medium text-navy">{item.caption}</p>}
                      {year && <p className="mt-0.5 text-sm text-slate-500">{year}</p>}
                    </figcaption>
                  )}
                </figure>
              )
            })}
          </div>
        ) : (
          <p className="text-center text-slate-500">Nenhuma foto cadastrada ainda.</p>
        )}
      </Container>
    </>
  )
}
