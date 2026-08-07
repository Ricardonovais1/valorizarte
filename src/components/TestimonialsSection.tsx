import type { Testimonial } from '@/lib/data'
import { Container } from './Container'
import { SectionHeading } from './SectionHeading'
import { TestimonialCarousel } from './TestimonialCarousel'

export function TestimonialsSection({
  testimonials,
  id = 'depoimentos',
}: {
  testimonials: Testimonial[]
  id?: string
}) {
  return (
    <section className="scroll-mt-24 py-20" id={id}>
      <Container>
        <SectionHeading title="Relatos de clientes" />
        {testimonials.length > 0 ? (
          <div className="mt-12">
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        ) : (
          <p className="mt-10 text-center text-sm text-slate-500">
            Os depoimentos de clientes vão aparecer aqui assim que forem cadastrados no Studio.
          </p>
        )}
      </Container>
    </section>
  )
}
