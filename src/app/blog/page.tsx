import type { Metadata } from 'next'
import { Container } from '@/components/Container'
import { PageHeader } from '@/components/PageHeader'
import { PostCard } from '@/components/PostCard'
import { NewsletterForm } from '@/components/NewsletterForm'
import { getPosts } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artigos sobre liderança, estratégia, carreira e governança da Valorizarte.',
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <>
      <PageHeader title="Blog" />
      <Container className="py-16">
        {posts.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500">Nenhum post publicado ainda.</p>
        )}

        <div className="mt-16 max-w-2xl mx-auto">
          <NewsletterForm source="blog-listing" />
        </div>
      </Container>
    </>
  )
}
