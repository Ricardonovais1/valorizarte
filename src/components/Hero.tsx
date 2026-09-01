'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { resolveImage } from '@/lib/resolveImage'
import { Container } from './Container'
import { CtaLink } from './CtaLink'

export type HeroSlide = {
  image?: unknown
  headline?: string
  subtext?: string
  ctaLabel?: string
  ctaHref?: string
}

const AUTOPLAY_MS = 5000

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0)
  const count = slides.length

  // Reinicia a contagem a cada troca de slide (manual ou automática), como
  // num carrossel real — clicar numa seta não deixa o autoplay "atropelar"
  // logo em seguida. Sem pausa no hover: o hero ocupa quase a tela toda,
  // então pausar ao passar o mouse fazia o carrossel parecer travado.
  useEffect(() => {
    if (count <= 1) return
    const id = setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS)
    return () => clearTimeout(id)
  }, [index, count])

  if (count === 0) return null

  const slide = slides[index]
  const imageUrl = resolveImage(slide.image, { width: 1920, height: 800 })

  return (
    <section className="relative isolate flex min-h-[var(--hero-h)] items-center overflow-hidden bg-navy pb-[var(--hero-pb)] pt-10">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* `object-top` + `origin-top`: o Hero é bem mais largo do que alto,
              então sobra altura de imagem para descartar. Ancorando no topo, o
              corte sai todo pela parte de baixo — inclusive durante o zoom, que
              sem `origin-top` cresceria a partir do centro e voltaria a comer o
              topo. */}
          {imageUrl && (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.1 }}
              transition={{ duration: AUTOPLAY_MS / 1000 + 1.5, ease: 'linear' }}
              className="absolute inset-0 origin-top"
            >
              <Image src={imageUrl} alt="" fill priority className="object-cover object-top" />
            </motion.div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/50 to-navy-deep/30" />
        </motion.div>
      </AnimatePresence>

      <Container className="relative z-10 text-center">
        <div key={index}>
          {slide.headline && (
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15, ease: 'easeOut' }}
              className="mx-auto max-w-3xl text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl lg:text-4xl"
            >
              {slide.headline}
            </motion.h1>
          )}
          {slide.subtext && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.35, ease: 'easeOut' }}
              className="mx-auto mt-5 max-w-2xl text-lg text-white/90"
            >
              {slide.subtext}
            </motion.p>
          )}
          {slide.ctaLabel && slide.ctaHref && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.55, ease: 'easeOut' }}
            >
              <CtaLink href={slide.ctaHref} className="mt-8 inline-block px-[50px] py-3 text-sm">
                {slide.ctaLabel}
              </CtaLink>
            </motion.div>
          )}
        </div>
      </Container>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Slide anterior"
            onClick={() => setIndex((i) => (i - 1 + count) % count)}
            className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            aria-label="Próximo slide"
            onClick={() => setIndex((i) => (i + 1) % count)}
            className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronRight size={22} />
          </button>

          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir para o slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-6 bg-gold' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
