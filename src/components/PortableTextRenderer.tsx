import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'

/**
 * As imagens do corpo do texto vêm de duas origens: do Sanity (objeto com
 * asset._ref) ou do conteúdo importado do WordPress (caminho em
 * public/images/blog/). Aceitamos as duas para que as páginas não precisem
 * saber de onde veio o conteúdo.
 */
function bodyImageUrl(value: { url?: string }): string | undefined {
  const fromSanity = urlForImage(value as never)
  if (fromSanity) return fromSanity.width(1200).url()
  return value.url
}

const components: PortableTextComponents = {
  types: {
    richImage: ({ value }) => {
      const url = bodyImageUrl(value)
      if (!url) return null
      return (
        <figure className="mx-auto my-8 max-w-xl">
          <Image
            src={url}
            alt={value.alt || ''}
            width={1200}
            height={800}
            className="h-auto w-full rounded-xl"
            sizes="(max-width: 640px) 100vw, 576px"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-slate-500">{value.caption}</figcaption>
          )}
        </figure>
      )
    },
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.openInNewTab ? '_blank' : undefined}
        rel={value?.openInNewTab ? 'noopener noreferrer' : undefined}
        className="text-teal underline underline-offset-2 hover:text-teal-dark"
      >
        {children}
      </a>
    ),
    underline: ({ children }) => <span className="underline underline-offset-2">{children}</span>,
  },
  block: {
    h2: ({ children }) => <h2 className="mt-10 mb-4 text-2xl font-semibold text-navy">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 mb-3 text-xl font-semibold text-navy">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-teal pl-4 italic text-slate-700">{children}</blockquote>
    ),
    normal: ({ children }) => <p className="mb-4 leading-relaxed text-slate-700">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="mb-6 ml-1 space-y-2">{children}</ul>,
    number: ({ children }) => <ol className="mb-6 ml-1 list-decimal space-y-2 pl-5">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-6 leading-relaxed text-slate-700 before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-teal">
        {children}
      </li>
    ),
    number: ({ children }) => <li className="pl-1 leading-relaxed text-slate-700">{children}</li>,
  },
}

export function PortableTextRenderer({ value }: { value: unknown }) {
  if (!value) return null
  return (
    <div className="prose-content">
      <PortableText value={value as never} components={components} />
    </div>
  )
}
