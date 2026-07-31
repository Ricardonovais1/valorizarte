/**
 * Migra posts do WordPress (valorizarte.com.br) para o Sanity.
 *
 * Uso:
 *   npx tsx scripts/migrate-wp.ts
 *
 * Requer no .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
 * e SANITY_API_WRITE_TOKEN (token com permissão de Editor, gerado em
 * manage.sanity.io -> API -> Tokens).
 *
 * O script é IDEMPOTENTE: cada post e categoria recebe um _id determinístico
 * a partir do ID do WordPress (ex: "post-3016"). Rodar de novo atualiza os
 * documentos existentes em vez de duplicá-los — pode rodar quantas vezes
 * quiser durante o desenvolvimento.
 *
 * NOTA IMPORTANTE: este script não pôde ser executado de ponta a ponta
 * dentro do ambiente onde este projeto foi montado (um sandbox com acesso
 * de rede restrito a poucos domínios). Ele foi escrito e revisado com
 * cuidado a partir da estrutura real da API do WordPress do site (testada
 * via outra via de acesso), mas rode primeiro com um dataset de teste
 * (`--dataset=staging`, por exemplo) e confira 3-4 posts publicados antes
 * de rodar contra o dataset de produção.
 */
import { createClient } from '@sanity/client'
import { htmlToBlocks } from '@portabletext/block-tools'
import { Schema } from '@sanity/schema'
import { JSDOM } from 'jsdom'
import 'dotenv/config'

const WP_BASE_URL = process.env.WP_BASE_URL || 'https://valorizarte.com.br'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error(
    'Faltam variáveis de ambiente. Defina NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET e SANITY_API_WRITE_TOKEN no .env.local antes de rodar a migração.',
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
})

// Schema mínimo, usado só para o conversor de HTML->Portable Text saber
// quais estilos/decorators são válidos (precisa espelhar src/sanity/schemaTypes/objects/portableBody.ts).
const blockContentSchema = Schema.compile({
  name: 'default',
  types: [
    {
      type: 'object',
      name: 'blogPost',
      fields: [
        {
          title: 'Body',
          name: 'body',
          type: 'array',
          of: [{ type: 'block' }, { type: 'image' }],
        },
      ],
    },
  ],
})
const blockContentType = blockContentSchema
  .get('blogPost')
  .fields.find((field: { name: string }) => field.name === 'body').type

type WpPost = {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  categories: number[]
  featured_media: number
  yoast_head_json?: { title?: string; description?: string }
}

type WpCategory = { id: number; name: string; slug: string }
type WpMedia = { id: number; source_url: string; alt_text?: string }

async function fetchAllPages<T>(path: string): Promise<T[]> {
  const results: T[] = []
  let page = 1
  // WordPress limita per_page a 100; pagina até a API responder vazio.
  while (true) {
    const res = await fetch(`${WP_BASE_URL}/wp-json/wp/v2${path}${path.includes('?') ? '&' : '?'}per_page=100&page=${page}`)
    if (res.status === 400) break // página além do total: WP retorna 400
    if (!res.ok) throw new Error(`Falha ao buscar ${path} (página ${page}): ${res.status}`)
    const batch = (await res.json()) as T[]
    if (!batch.length) break
    results.push(...batch)
    page += 1
  }
  return results
}

function stripLegacyEmbeds(html: string): string {
  // Remove atributos e tags que não têm equivalente em Portable Text e
  // que o htmlToBlocks não sabe descartar sozinho.
  return html.replace(/<script[\s\S]*?<\/script>/gi, '')
}

async function migrateCategories(): Promise<Map<number, string>> {
  console.log('Buscando categorias...')
  const categories = await fetchAllPages<WpCategory>('/categories')
  const idToDocId = new Map<number, string>()

  for (const cat of categories) {
    const docId = `category-${cat.id}`
    idToDocId.set(cat.id, docId)
    await client.createIfNotExists({
      _id: docId,
      _type: 'category',
      title: cat.name,
      slug: { _type: 'slug', current: cat.slug },
    })
  }
  console.log(`  ${categories.length} categorias migradas.`)
  return idToDocId
}

async function uploadImageFromUrl(url: string, altText: string) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`status ${res.status}`)
    const buffer = Buffer.from(await res.arrayBuffer())
    const filename = url.split('/').pop() || 'imagem.jpg'
    const asset = await client.assets.upload('image', buffer, { filename })
    return {
      _type: 'richImage',
      asset: { _type: 'reference', _ref: asset._id },
      alt: altText || filename,
    }
  } catch (err) {
    console.warn(`  [aviso] falha ao subir imagem ${url}:`, (err as Error).message)
    return undefined
  }
}

async function migratePosts(categoryMap: Map<number, string>) {
  console.log('Buscando posts...')
  const [posts, media] = await Promise.all([
    fetchAllPages<WpPost>('/posts'),
    fetchAllPages<WpMedia>('/media'),
  ])
  const mediaById = new Map(media.map((m) => [m.id, m]))

  console.log(`  ${posts.length} posts encontrados. Convertendo e enviando...`)

  for (const post of posts) {
    const cleanHtml = stripLegacyEmbeds(post.content.rendered)
    const { window } = new JSDOM('')

    const body = htmlToBlocks(cleanHtml, blockContentType, {
      parseHtml: (html: string) => new JSDOM(html).window.document,
    })

    const featuredMedia = mediaById.get(post.featured_media)
    const coverImage = featuredMedia
      ? await uploadImageFromUrl(featuredMedia.source_url, featuredMedia.alt_text || post.title.rendered)
      : undefined

    const firstCategoryId = post.categories?.[0]
    const categoryRef = firstCategoryId ? categoryMap.get(firstCategoryId) : undefined

    await client.createOrReplace({
      _id: `post-${post.id}`,
      _type: 'post',
      title: post.title.rendered,
      slug: { _type: 'slug', current: post.slug },
      excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, '').trim(),
      publishedAt: post.date,
      body,
      ...(coverImage ? { coverImage } : {}),
      ...(categoryRef ? { category: { _type: 'reference', _ref: categoryRef } } : {}),
      seo: {
        title: post.yoast_head_json?.title,
        description: post.yoast_head_json?.description,
      },
    })
    console.log(`  ✓ ${post.slug}`)
    window.close()
  }
}

async function main() {
  console.log(`Migrando conteúdo de ${WP_BASE_URL} para o dataset "${dataset}" do projeto ${projectId}.\n`)
  const categoryMap = await migrateCategories()
  await migratePosts(categoryMap)
  console.log('\nMigração concluída.')
}

main().catch((err) => {
  console.error('Migração falhou:', err)
  process.exit(1)
})
