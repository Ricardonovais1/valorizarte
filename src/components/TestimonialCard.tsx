import Image from 'next/image'
import { resolveImage } from '@/lib/resolveImage'

type Testimonial = {
  _id: string
  name: string
  roleAndCompany?: string
  photo?: unknown
  quote: string
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const imageUrl = resolveImage(testimonial.photo, { width: 96, height: 96 })

  return (
    <figure className="mx-auto flex max-w-3xl flex-col items-center text-center">
      <blockquote className="text-lg italic leading-relaxed text-slate-700">“{testimonial.quote}”</blockquote>
      <figcaption className="mt-6 flex flex-col items-center gap-2">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={testimonial.name}
            width={56}
            height={56}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal/15 text-lg font-semibold text-teal-dark">
            {testimonial.name.charAt(0)}
          </div>
        )}
        <p className="text-sm font-semibold text-navy">{testimonial.name}</p>
        {testimonial.roleAndCompany && <p className="text-xs text-slate-500">{testimonial.roleAndCompany}</p>}
      </figcaption>
    </figure>
  )
}
