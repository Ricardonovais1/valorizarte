import Image from 'next/image'
import { Container } from './Container'

export function PageHeader({ title, icon = false }: { title: string; icon?: boolean }) {
  return (
    <div className="bg-wave-navy py-16 sm:py-20">
      <Container className="text-center">
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
      </Container>
    </div>
  )
}
