import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'

const components: PortableTextComponents = {
  types: {
    richImage: ({ value }) => {
      const url = urlForImage(value)
      if (!url) return null
      return (
        <figure className="my-8">
          <Image
            src={url.width(1200).url()}
            alt={value.alt || ''}
            width={1200}
            height={800}
            className="rounded-xl"
            sizes="(max-width: 768px) 100vw, 768px"
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
  },
  block: {
    h2: ({ children }) => <h2 className="mt-10 mb-4 text-2xl font-semibold text-navy">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 mb-3 text-xl font-semibold text-navy">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-teal pl-4 italic text-slate-700">{children}</blockquote>
    ),
    normal: ({ children }) => <p className="mb-4 leading-relaxed text-slate-700">{children}</p>,
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
