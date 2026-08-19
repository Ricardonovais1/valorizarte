import Image from 'next/image'
import { Container } from './Container'
import { Reveal } from './Reveal'

export function PageHeader({ title, icon = false }: { title: string; icon?: boolean }) {
  return (
    <div className="bg-wave-navy py-16 sm:py-20">
      <Container className="text-center">
        <Reveal>
          {icon && (
            <Image
              src="/images/logo-gold-icon.png"
              alt=""
              width={88}
              height={56}
              className="mx-auto mb-4"
            />
          )}
          <h1 className="text-4xl font-bold text-white sm:text-6xl">{title}</h1>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-teal to-gold" />
        </Reveal>
      </Container>
    </div>
  )
}
