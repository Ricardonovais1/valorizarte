/**
 * Importa todos os posts do blog do WordPress (valorizarte.com.br) para o
 * conteúdo local do projeto.
 *
 * Uso:
 *   npm run import:blog
 *
 * Diferente de scripts/migrate-wp.ts — que envia o mesmo conteúdo para o
 * Sanity e exige um token de escrita — este script não precisa de credencial
 * nenhuma. Ele baixa as imagens para public/images/blog/ e gera o arquivo
 * src/content/blogPosts.ts, que a camada de dados usa como conteúdo semente.
 * É assim que o blog funciona por completo antes de o Sanity ser configurado.
 *
 * A conversão de HTML para Portable Text vem de scripts/lib/wordpress.ts, a
 * mesma que a migração para o Sanity usa — os dois destinos produzem
 * exatamente o mesmo conteúdo.
 *
 * O script é idempotente: rodar de novo regrava o arquivo gerado e só grava
 * as imagens que ainda não existem em disco.
 */
import { mkdir, readdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import {
  convertHtmlToBlocks,
  decodeText,
  excerptFrom,
  fetchAllPages,
  fetchOptimizedImage,
  seoTitleFor,
  WP_BASE_URL,
  type ImageBlock,
  type ImageFields,
  type WpCategory,
  type WpPost,
} from './lib/wordpress'

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..')
const IMAGE_DIR = path.join(PROJECT_ROOT, 'public', 'images', 'blog')
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'src', 'content', 'blogPosts.ts')

const saved = new Map<string, string>()

/** Grava a imagem em public/images/blog/ e devolve o caminho público. */
async function saveImage(rawUrl: string): Promise<ImageFields | undefined> {
  const url = rawUrl.replace(/^http:\/\//, 'https://')
  const cached = saved.get(url)
  if (cached) return { url: cached }

  try {
    const { data, fileName, originalBytes } = await fetchOptimizedImage(url)
    const publicPath = `/images/blog/${fileName}`
    const diskPath = path.join(IMAGE_DIR, fileName)
    saved.set(url, publicPath)

    if (!existsSync(diskPath)) {
      await writeFile(diskPath, data)
      const reduction = Math.round((1 - data.length / originalBytes) * 100)
      console.log(`    ↓ ${publicPath} (${(data.length / 1024).toFixed(0)} KB, -${reduction}%)`)
    }
    return { url: publicPath }
  } catch (err) {
    console.warn(`    [aviso] não baixou ${url}: ${(err as Error).message}`)
    return undefined
  }
}

async function main() {
  console.log(`Importando o blog de ${WP_BASE_URL}...\n`)
  await mkdir(IMAGE_DIR, { recursive: true })

  const [posts, categories] = await Promise.all([
    fetchAllPages<WpPost>('/posts?_embed=1&orderby=date&order=desc'),
    fetchAllPages<WpCategory>('/categories'),
  ])
  const categoryById = new Map(categories.map((c) => [c.id, c]))
  console.log(`${posts.length} posts encontrados.\n`)

  const imported = []
  for (const post of posts) {
    const title = decodeText(post.title.rendered)
    console.log(`  ${post.slug}`)

    const body = await convertHtmlToBlocks(post.content.rendered, title, saveImage)
    const category = categoryById.get(post.categories?.[0])

    // Alguns posts antigos não têm imagem destacada no WordPress. Nesse caso
    // a primeira imagem do corpo serve de capa, para o card do blog não sair
    // com um retângulo vazio.
    const featured = post._embedded?.['wp:featuredmedia']?.[0]
    const featuredFields = featured?.source_url ? await saveImage(featured.source_url) : undefined
    const firstBodyImage = body.find((b): b is ImageBlock => b._type === 'richImage')

    const coverImage = (featuredFields?.url as string) ?? (firstBodyImage?.url as string | undefined)
    const coverAlt = featuredFields
      ? decodeText(featured?.alt_text || '') || title
      : firstBodyImage?.alt

    const seoTitle = seoTitleFor(post.yoast_head_json?.title, title)
    const seoDescription = post.yoast_head_json?.description
      ? decodeText(post.yoast_head_json.description)
      : undefined

    imported.push({
      _id: `post-${post.id}`,
      title,
      slug: post.slug,
      excerpt: excerptFrom(post.excerpt.rendered),
      publishedAt: post.date,
      ...(coverImage ? { coverImage, coverAlt: coverAlt || title } : {}),
      ...(category ? { categoryTitle: decodeText(category.name), categorySlug: category.slug } : {}),
      ...(seoTitle || seoDescription
        ? {
            seo: {
              ...(seoTitle ? { title: seoTitle } : {}),
              ...(seoDescription ? { description: seoDescription } : {}),
            },
          }
        : {}),
      body,
    })
  }

  const file = `/**
 * ARQUIVO GERADO — não edite à mão.
 *
 * Produzido por \`npm run import:blog\` a partir da API do WordPress de
 * ${WP_BASE_URL}. Contém os posts do blog já convertidos para Portable Text,
 * com as imagens baixadas para public/images/blog/.
 *
 * Depois que o conteúdo estiver no Sanity, a camada de dados passa a servir
 * o CMS e este arquivo vira apenas o fallback (ver src/lib/data.ts).
 */
import type { BlogPost } from './types'

export const blogPosts: BlogPost[] = ${JSON.stringify(imported, null, 2)}
`

  await writeFile(OUTPUT_FILE, file, 'utf8')

  const images = await readdir(IMAGE_DIR)
  console.log(`\n${imported.length} posts gravados em src/content/blogPosts.ts`)
  console.log(`${images.length} imagens em public/images/blog/`)
}

main().catch((err) => {
  console.error('Importação falhou:', err)
  process.exit(1)
})
