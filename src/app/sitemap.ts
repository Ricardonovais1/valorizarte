import type { MetadataRoute } from 'next'
import { getAllPageSlugs, getPosts, getServices } from '@/lib/data'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://valorizarte.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, services, pageSlugs] = await Promise.all([getPosts(), getServices(), getAllPageSlugs()])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/midia`, changeFrequency: 'monthly', priority: 0.4 },
  ]

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

  const pageRoutes: MetadataRoute.Sitemap = pageSlugs.map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    changeFrequency: 'yearly',
    priority: 0.3,
  }))

  return [...staticRoutes, ...postRoutes, ...serviceRoutes, ...pageRoutes]
}
