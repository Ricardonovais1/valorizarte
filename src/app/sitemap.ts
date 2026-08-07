import type { MetadataRoute } from 'next'
import { getAllPageSlugs, getInterviews, getPosts, getServices } from '@/lib/data'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://valorizarte.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, services, pageSlugs, interviews] = await Promise.all([
    getPosts(),
    getServices(),
    getAllPageSlugs(),
    getInterviews(),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/quemsomos`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE_URL}/empresas`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/profissionais`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/midia`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/midia/entrevistas`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/midia/fotos`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/links-uteis`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/dicas-de-carreira`, changeFrequency: 'monthly', priority: 0.4 },
  ]

  const interviewRoutes: MetadataRoute.Sitemap = interviews.map((interview) => ({
    url: `${SITE_URL}/midia/entrevistas/${interview.slug}`,
    lastModified: interview.publishedAt,
    changeFrequency: 'yearly',
    priority: 0.3,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/${post.slug}`,
    lastModified: post.publishedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${SITE_URL}/empresas/${service.slug}`,
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  // "quemsomos" tem rota estática dedicada (src/app/quemsomos/page.tsx) e já
  // entra em staticRoutes acima.
  const pageRoutes: MetadataRoute.Sitemap = pageSlugs
    .filter((slug) => slug !== 'quemsomos')
    .map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    changeFrequency: 'yearly',
    priority: 0.3,
  }))

  return [...staticRoutes, ...postRoutes, ...serviceRoutes, ...pageRoutes, ...interviewRoutes]
}
