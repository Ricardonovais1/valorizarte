import Image from 'next/image'
import { resolveImage } from '@/lib/resolveImage'
import type { ClientLogo } from '@/lib/data'
import { Container } from './Container'
import { SectionHeading } from './SectionHeading'

const SECONDS_PER_LOGO = 4

export function ClientLogos({ logos, id }: { logos: ClientLogo[]; id?: string }) {
  if (logos.length === 0) return null

  // Duplicamos a lista para o loop infinito: a track anima de 0 a -50%
  // (a largura de uma cópia) e reinicia sem salto perceptível.
  const track = [...logos, ...logos]

  return (
    <section className="scroll-mt-24 bg-sage py-16" id={id}>
      <Container>
        <SectionHeading title="Principais Clientes" />
        <div className="mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          <div
            className="animate-marquee flex w-max hover:[animation-play-state:paused]"
            style={{ animationDuration: `${logos.length * SECONDS_PER_LOGO}s` }}
          >
            {track.map((logo, i) => (
              <div key={`${logo._id}-${i}`} className="flex w-40 shrink-0 items-center justify-center px-8 sm:w-48">
                <Image
                  src={resolveImage(logo.logo) || ''}
                  alt={logo.name}
                  width={150}
                  height={75}
                  className="h-12 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
