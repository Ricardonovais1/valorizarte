import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Container } from '@/components/Container'
import { PageHeader } from '@/components/PageHeader'
import { PortableTextRenderer } from '@/components/PortableTextRenderer'
import { NewsletterForm } from '@/components/NewsletterForm'
import { resolveImage } from '@/lib/resolveImage'
import { getAllPageSlugs, getPageBySlug, getPostBySlug, getPosts } from '@/lib/data'

/**
 * Rota "coringa" que resolve qualquer URL de primeiro nível do site —
 * exatamente como o WordPress atual, onde tanto posts quanto páginas
 * soltas (ex: /politicas-de-privacidade/) vivem na raiz do domínio.
 * Isso preserva 100% das URLs existentes, sem precisar de redirects.
 *
 * Ordem de resolução: primeiro tenta um post do blog, depois uma página
 * institucional. Se nenhum dos dois existir, retorna 404.
 */
export async function generateStaticParams() {
  const [posts, pageSlugs] = await Promise.all([getPosts(), getAllPageSlugs()])
  // "quemsomos" tem rota estática dedicada (src/app/quemsomos/page.tsx).
  const institutionalSlugs = pageSlugs.filter((slug) => slug !== 'quemsomos')
  return [...posts.map((post) => ({ slug: post.slug })), ...institutionalSlugs.map((slug) => ({ slug }))]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (post) {
    return {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
    }
  }
  const page = await getPageBySlug(slug)
  if (page) {
    return {
      title: page.seo?.title || page.title,
      description: page.seo?.description || page.intro,
    }
  }
  return {}
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const post = await getPostBySlug(slug)
  if (post) {
    const imageUrl = resolveImage(post.coverImage, { width: 1600, height: 686 })
    const date = new Date(post.publishedAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })

    return (
      <article>
        {imageUrl && (
          <div className="relative aspect-[21/9] w-full overflow-hidden bg-navy">
            <Image
              src={imageUrl}
              alt={post.coverAlt || (post.coverImage as { alt?: string })?.alt || post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}
        {!imageUrl && <PageHeader title={post.title} />}
        <Container
          className={
            imageUrl
              ? 'relative z-10 max-w-3xl -mt-[12.8571vw] rounded-t-[3px] bg-white pb-12 pt-10 shadow-[0_-10px_30px_rgba(15,42,67,0.08)] sm:pt-14'
              : 'max-w-3xl py-12'
          }
        >
          {post.categoryTitle && (
            <span className="text-xs font-semibold uppercase tracking-wide text-teal">{post.categoryTitle}</span>
          )}
          {imageUrl && <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">{post.title}</h1>}
          <p className="mt-3 text-sm text-slate-500">
            {date} <span aria-hidden="true">·</span> Por Gilvan Silva
          </p>

          <div className="mt-8">
            <PortableTextRenderer value={post.body} />
          </div>

          <div className="mt-12">
            <NewsletterForm source={`post-${slug}`} />
          </div>
        </Container>
      </article>
    )
  }

  const page = await getPageBySlug(slug)
  if (page) {
    return (
      <>
        <PageHeader title={page.title} />
        <Container className="max-w-3xl py-16">
          {page.intro && <p className="text-lg text-slate-600">{page.intro}</p>}
          <div className="mt-8">
            <PortableTextRenderer value={page.body} />
          </div>
        </Container>
      </>
    )
  }

  notFound()
}
