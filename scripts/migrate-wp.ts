/**
 * Migra os posts do blog do WordPress (valorizarte.com.br) para o Sanity.
 *
 * Uso:
 *   npm run migrate                      # dataset do .env.local
 *   npm run migrate -- --dataset=staging # ensaio num dataset separado
 *   npm run migrate -- --dry-run         # só mostra o que faria, não grava
 *
 * Requer no .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
 * e SANITY_API_WRITE_TOKEN (token com permissão de Editor, gerado em
 * manage.sanity.io -> API -> Tokens).
 *
 * Usa a MESMA conversão de HTML que o `npm run import:blog` (scripts/lib/
 * wordpress.ts), então o conteúdo no Studio sai idêntico ao que já está no
 * ar: títulos, listas aninhadas, negrito, itálico, sublinhado, links e as
 * imagens dentro do texto — que sobem como assets e viram blocos richImage,
 * editáveis pelo Studio como qualquer outra imagem.
 *
 * O script é IDEMPOTENTE: cada post e categoria recebe um _id determinístico
 * a partir do ID do WordPress (ex: "post-3016"), e cada imagem é enviada uma
 * única vez por URL de origem. Rodar de novo atualiza os documentos
 * existentes em vez de duplicá-los.
 *
 * Recomendação: rode primeiro com `--dataset=staging`, confira 3-4 posts no
 * Studio, e só então rode contra o dataset de produção.
 */
import { createClient } from '@sanity/client'
import 'dotenv/config'
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

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const datasetOverride = args.find((a) => a.startsWith('--dataset='))?.split('=')[1]

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = datasetOverride || process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

// O dry-run não fala com o Sanity, então roda sem nenhuma configuração —
// serve para conferir a conversão antes de ter o projeto criado.
if (!dryRun && (!projectId || !dataset || !token)) {
  console.error(
    'Faltam variáveis de ambiente. Defina NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET e SANITY_API_WRITE_TOKEN no .env.local antes de rodar a migração.\n' +
      'Para conferir a conversão sem gravar nada: npm run migrate -- --dry-run',
  )
  process.exit(1)
}

const client =
  dryRun || !projectId || !dataset
    ? null
    : createClient({ projectId, dataset, apiVersion: '2025-01-01', token, useCdn: false })

async function migrateCategories(): Promise<Map<number, string>> {
  console.log('Buscando categorias...')
  const categories = await fetchAllPages<WpCategory>('/categories')
  const idToDocId = new Map<number, string>()

  for (const cat of categories) {
    const docId = `category-${cat.id}`
    idToDocId.set(cat.id, docId)
    if (client) {
      await client.createIfNotExists({
        _id: docId,
        _type: 'category',
        title: decodeText(cat.name),
        slug: { _type: 'slug', current: cat.slug },
      })
    }
  }
  console.log(`  ${categories.length} categorias.`)
  return idToDocId
}

// Uma URL do WordPress = um asset no Sanity, por mais posts que a usem.
const uploadedAssets = new Map<string, string>()

/**
 * Baixa a imagem do WordPress, otimiza (o mesmo tratamento do site: teto de
 * 1600px e JPEG quando não há transparência) e sobe como asset do Sanity.
 * Devolve a referência pronta para entrar num campo de imagem.
 */
async function uploadImage(rawUrl: string): Promise<ImageFields | undefined> {
  const url = rawUrl.replace(/^http:\/\//, 'https://')
  const cached = uploadedAssets.get(url)
  if (cached) return { asset: { _type: 'reference', _ref: cached } }

  try {
    const { data, fileName, originalBytes } = await fetchOptimizedImage(url)

    if (!client) {
      const fakeRef = `image-dry-run-${fileName}`
      uploadedAssets.set(url, fakeRef)
      console.log(`    ↑ [dry-run] ${fileName} (${(data.length / 1024).toFixed(0)} KB)`)
      return { asset: { _type: 'reference', _ref: fakeRef } }
    }

    const asset = await client.assets.upload('image', data, { filename: fileName })
    uploadedAssets.set(url, asset._id)
    const reduction = Math.round((1 - data.length / originalBytes) * 100)
    console.log(`    ↑ ${fileName} (${(data.length / 1024).toFixed(0)} KB, -${reduction}%)`)
    return { asset: { _type: 'reference', _ref: asset._id } }
  } catch (err) {
    console.warn(`    [aviso] falha ao subir ${url}: ${(err as Error).message}`)
    return undefined
  }
}

async function migratePosts(categoryMap: Map<number, string>) {
  console.log('\nBuscando posts...')
  const posts = await fetchAllPages<WpPost>('/posts?_embed=1&orderby=date&order=desc')
  console.log(`  ${posts.length} posts. Convertendo e enviando...\n`)

  for (const post of posts) {
    const title = decodeText(post.title.rendered)
    console.log(`  ${post.slug}`)

    const body = await convertHtmlToBlocks(post.content.rendered, title, uploadImage)

    // Sem imagem destacada no WordPress, a primeira imagem do corpo vira a
    // capa — mesma regra do conteúdo que já está no ar.
    const featured = post._embedded?.['wp:featuredmedia']?.[0]
    const featuredFields = featured?.source_url ? await uploadImage(featured.source_url) : undefined
    const firstBodyImage = body.find((b): b is ImageBlock => b._type === 'richImage')

    const coverFields = featuredFields ?? (firstBodyImage ? { asset: firstBodyImage.asset } : undefined)
    const coverAlt = featuredFields ? decodeText(featured?.alt_text || '') || title : firstBodyImage?.alt

    const categoryRef = categoryMap.get(post.categories?.[0])
    const seoTitle = seoTitleFor(post.yoast_head_json?.title, title)
    const seoDescription = post.yoast_head_json?.description
      ? decodeText(post.yoast_head_json.description)
      : undefined

    const doc = {
      _id: `post-${post.id}`,
      _type: 'post',
      title,
      slug: { _type: 'slug', current: post.slug },
      excerpt: excerptFrom(post.excerpt.rendered),
      publishedAt: post.date,
      body,
      ...(coverFields ? { coverImage: { _type: 'richImage', ...coverFields, alt: coverAlt || title } } : {}),
      ...(categoryRef ? { category: { _type: 'reference', _ref: categoryRef } } : {}),
      ...(seoTitle || seoDescription
        ? {
            seo: {
              ...(seoTitle ? { title: seoTitle } : {}),
              ...(seoDescription ? { description: seoDescription } : {}),
            },
          }
        : {}),
    }

    const images = body.filter((b) => b._type === 'richImage').length
    if (client) {
      await client.createOrReplace(doc)
      console.log(`    ✓ gravado — ${body.length} blocos, ${images} imagens no corpo`)
    } else {
      console.log(`    [dry-run] ${body.length} blocos, ${images} imagens no corpo`)
    }
  }
}

async function main() {
  console.log(
    `Migrando o blog de ${WP_BASE_URL} para o dataset "${dataset}" do projeto ${projectId}.` +
      (dryRun ? ' (dry-run: nada será gravado)' : '') +
      '\n',
  )
  const categoryMap = await migrateCategories()
  await migratePosts(categoryMap)
  console.log('\nMigração concluída.')
  if (!dryRun) {
    console.log(
      'Confira os posts em https://valorizarte.sanity.studio e, se estiver tudo certo, o site passa a servir o Sanity automaticamente.',
    )
  }
}

main().catch((err) => {
  console.error('Migração falhou:', err)
  process.exit(1)
})
