import Link from 'next/link'
import Image from 'next/image'
import { resolveImage } from '@/lib/resolveImage'
import type { Post } from '@/lib/data'

export function PostCard({ post }: { post: Post }) {
  const imageUrl = resolveImage(post.coverImage, { width: 600, height: 375 })

  return (
    <Link href={`/${post.slug}`} className="group flex flex-col">
      <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={(post.coverImage as { alt?: string })?.alt || post.title}
            width={600}
            height={375}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
            Sem imagem de capa
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col pt-4">
        {post.categoryTitle && (
          <span className="text-xs font-semibold uppercase tracking-wide text-teal">{post.categoryTitle}</span>
        )}
        <h3 className="mt-2 text-lg font-semibold text-navy group-hover:text-teal-dark">{post.title}</h3>
        {post.excerpt && <p className="mt-2 line-clamp-3 text-sm text-slate-600">{post.excerpt}</p>}
        <span className="mt-3 text-sm font-medium text-teal">Leia mais</span>
      </div>
    </Link>
  )
}
