import { client } from '@/sanity/lib/client'
import { isSanityConfigured } from '@/sanity/env'
import {
  allPageSlugsQuery,
  clientLogosQuery,
  galleryQuery,
  homePageQuery,
  navigationQuery,
  pageBySlugQuery,
  postBySlugQuery,
  postsQuery,
  serviceBySlugQuery,
  servicesQuery,
  siteSettingsQuery,
  testimonialsQuery,
} from '@/lib/queries'
import {
  seedClientLogos,
  seedHomePage,
  seedNavigation,
  seedPages,
  seedPosts,
  seedServices,
  seedSiteSettings,
  seedTestimonials,
  type SeedClientLogo,
  type SeedPage,
  type SeedPost,
  type SeedService,
  type SeedTestimonial,
} from '@/content/seed'

/**
 * Camada de dados única para todo o site. Cada função tenta o Sanity
 * primeiro; se o projeto ainda não estiver configurado (ou a consulta
 * vier vazia num primeiro deploy sem conteúdo ainda cadastrado), cai de
 * volta para o conteúdo semente. Isso é o que permite o site funcionar
 * antes, durante e depois da migração — nunca com a tela em branco.
 */

const REVALIDATE_TAGS = {
  posts: 'posts',
  services: 'services',
  pages: 'pages',
  testimonials: 'testimonials',
  clientLogos: 'clientLogos',
  gallery: 'gallery',
  siteSettings: 'siteSettings',
  navigation: 'navigation',
  homePage: 'homePage',
} as const

export type Post = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  coverImage?: unknown
  body?: unknown
  categoryTitle?: string
  categorySlug?: string
  publishedAt: string
  seo?: { title?: string; description?: string }
}

function seedPostToPost(p: SeedPost): Post {
  return {
    _id: p._id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    categoryTitle: p.categoryTitle,
    categorySlug: p.categorySlug,
    publishedAt: p.publishedAt,
    body: p.body.map((paragraph) => ({
      _type: 'block',
      style: 'normal',
      children: [{ _type: 'span', text: paragraph }],
    })),
  }
}

export async function getPosts(): Promise<Post[]> {
  if (isSanityConfigured && client) {
    const posts = await client.fetch(postsQuery, {}, { next: { tags: [REVALIDATE_TAGS.posts] } })
    if (posts?.length) return posts
  }
  return seedPosts.map(seedPostToPost)
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (isSanityConfigured && client) {
    const post = await client.fetch(postBySlugQuery, { slug }, { next: { tags: [REVALIDATE_TAGS.posts] } })
    if (post) return post
  }
  const seedPost = seedPosts.find((p) => p.slug === slug)
  return seedPost ? seedPostToPost(seedPost) : null
}

export type Service = Omit<SeedService, 'image' | 'body'> & {
  image?: unknown
  highlights?: string[]
  body?: unknown
  seo?: unknown
}

// Suporte simples a **negrito** dentro dos parágrafos do conteúdo semente,
// convertendo para spans do Portable Text com a marca "strong".
function parseInlineBold(text: string) {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) => {
      const bold = part.match(/^\*\*(.+)\*\*$/)
      return bold ? { _type: 'span', text: bold[1], marks: ['strong'] } : { _type: 'span', text: part }
    })
}

// Convenção leve no conteúdo semente: parágrafos começando com "## " viram
// subtítulo (h2); o restante vira parágrafo normal, com suporte a
// **negrito** via parseInlineBold. Usado tanto por serviços quanto páginas.
function paragraphsToBlocks(paragraphs: string[]) {
  return paragraphs.map((paragraph) => {
    const heading = paragraph.match(/^##\s+(.+)$/)
    return {
      _type: 'block',
      style: heading ? 'h2' : 'normal',
      children: parseInlineBold(heading ? heading[1] : paragraph),
    }
  })
}

function seedServiceToService(s: SeedService): Service {
  return {
    ...s,
    body: s.body ? paragraphsToBlocks(s.body) : undefined,
  }
}

export async function getServices(): Promise<Service[]> {
  if (isSanityConfigured && client) {
    const services = await client.fetch(servicesQuery, {}, { next: { tags: [REVALIDATE_TAGS.services] } })
    if (services?.length) return services
  }
  return seedServices.map(seedServiceToService)
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  if (isSanityConfigured && client) {
    const service = await client.fetch(
      serviceBySlugQuery,
      { slug },
      { next: { tags: [REVALIDATE_TAGS.services] } },
    )
    if (service) return service
  }
  const seedService = seedServices.find((s) => s.slug === slug)
  return seedService ? seedServiceToService(seedService) : null
}

function seedPageToPage(p: SeedPage) {
  return {
    _id: p._id,
    title: p.title,
    slug: p.slug,
    intro: p.intro,
    body: paragraphsToBlocks(p.body),
  }
}

export async function getPageBySlug(slug: string) {
  if (isSanityConfigured && client) {
    const page = await client.fetch(pageBySlugQuery, { slug }, { next: { tags: [REVALIDATE_TAGS.pages] } })
    if (page) return page
  }
  const seedPage = seedPages.find((p) => p.slug === slug)
  return seedPage ? seedPageToPage(seedPage) : null
}

export async function getAllPageSlugs(): Promise<string[]> {
  if (isSanityConfigured && client) {
    const pages = await client.fetch<{ slug: string }[]>(
      allPageSlugsQuery,
      {},
      { next: { tags: [REVALIDATE_TAGS.pages] } },
    )
    if (pages?.length) return pages.map((p) => p.slug)
  }
  return seedPages.map((p) => p.slug)
}

export type Testimonial = SeedTestimonial & { photo?: unknown }

export async function getTestimonials(): Promise<Testimonial[]> {
  if (isSanityConfigured && client) {
    const testimonials = await client.fetch(
      testimonialsQuery,
      {},
      { next: { tags: [REVALIDATE_TAGS.testimonials] } },
    )
    if (testimonials?.length) return testimonials
  }
  return seedTestimonials
}

export type ClientLogo = SeedClientLogo & { logo?: unknown }

export async function getClientLogos(): Promise<ClientLogo[]> {
  if (isSanityConfigured && client) {
    const logos = await client.fetch(clientLogosQuery, {}, { next: { tags: [REVALIDATE_TAGS.clientLogos] } })
    if (logos?.length) return logos
  }
  return seedClientLogos
}

export async function getGallery() {
  if (isSanityConfigured && client) {
    return client.fetch(galleryQuery, {}, { next: { tags: [REVALIDATE_TAGS.gallery] } })
  }
  return []
}

export async function getSiteSettings() {
  if (isSanityConfigured && client) {
    const settings = await client.fetch(siteSettingsQuery, {}, { next: { tags: [REVALIDATE_TAGS.siteSettings] } })
    if (settings) return settings
  }
  return seedSiteSettings
}

export async function getNavigation() {
  if (isSanityConfigured && client) {
    const items = await client.fetch(navigationQuery, {}, { next: { tags: [REVALIDATE_TAGS.navigation] } })
    if (items?.length) return items
  }
  return seedNavigation
}

export async function getHomePage() {
  if (isSanityConfigured && client) {
    const home = await client.fetch(homePageQuery, {}, { next: { tags: [REVALIDATE_TAGS.homePage] } })
    if (home) return home
  }
  return seedHomePage
}

export const revalidateTagsByType: Record<string, string> = {
  post: REVALIDATE_TAGS.posts,
  category: REVALIDATE_TAGS.posts,
  service: REVALIDATE_TAGS.services,
  page: REVALIDATE_TAGS.pages,
  testimonial: REVALIDATE_TAGS.testimonials,
  clientLogo: REVALIDATE_TAGS.clientLogos,
  galleryItem: REVALIDATE_TAGS.gallery,
  siteSettings: REVALIDATE_TAGS.siteSettings,
  navigation: REVALIDATE_TAGS.navigation,
  homePage: REVALIDATE_TAGS.homePage,
}
