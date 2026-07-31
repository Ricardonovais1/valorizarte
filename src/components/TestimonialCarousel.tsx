'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Testimonial } from '@/lib/data'
import { TestimonialCard } from './TestimonialCard'

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 8000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ])
  const [selected, setSelected] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelected(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    emblaApi.on('init', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('init', onSelect)
    }
  }, [emblaApi, onSelect])

  if (testimonials.length === 0) return null

  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((t) => (
            <div key={t._id} className="min-w-0 shrink-0 basis-full px-4 sm:px-12">
              <TestimonialCard testimonial={t} />
            </div>
          ))}
        </div>
      </div>

      {testimonials.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Depoimento anterior"
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-0 top-1/2 hidden -translate-y-1/2 text-slate-400 transition hover:text-navy sm:block"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            type="button"
            aria-label="Próximo depoimento"
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-0 top-1/2 hidden -translate-y-1/2 text-slate-400 transition hover:text-navy sm:block"
          >
            <ChevronRight size={28} />
          </button>

          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t._id}
                type="button"
                aria-label={`Ir para depoimento ${i + 1}`}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`h-2 w-2 rounded-full transition ${i === selected ? 'bg-teal' : 'bg-slate-300'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
