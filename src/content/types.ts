/**
 * Formato dos posts importados do WordPress (ver scripts/import-blog.ts).
 *
 * O corpo já vem em Portable Text, igual ao que o Sanity devolve — a única
 * diferença é a imagem, que aqui aponta para um arquivo em public/images/blog/
 * em vez de um asset do CDN. O `resolveImage`/`PortableTextRenderer` aceitam
 * as duas formas, então as páginas não precisam saber a origem do conteúdo.
 */
export type PortableSpan = { _type: 'span'; _key: string; text: string; marks: string[] }

export type PortableLink = { _key: string; _type: 'link'; href: string; openInNewTab: boolean }

export type PortableTextBlock = {
  _type: 'block'
  _key: string
  style: string
  markDefs: PortableLink[]
  children: PortableSpan[]
  listItem?: 'bullet' | 'number'
  level?: number
}

export type PortableImageBlock = {
  _type: 'richImage'
  _key: string
  url: string
  alt: string
  caption?: string
}

export type PortableBlock = PortableTextBlock | PortableImageBlock

export type BlogPost = {
  _id: string
  title: string
  slug: string
  excerpt: string
  publishedAt: string
  coverImage?: string
  coverAlt?: string
  categoryTitle?: string
  categorySlug?: string
  seo?: { title?: string; description?: string }
  body: PortableBlock[]
}
