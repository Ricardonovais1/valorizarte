/**
 * Peças comuns aos dois caminhos de migração do WordPress:
 *
 *   scripts/import-blog.ts  → conteúdo local (public/ + src/content/blogPosts.ts)
 *   scripts/migrate-wp.ts   → documentos no Sanity
 *
 * A conversão de HTML para Portable Text mora aqui para que os dois destinos
 * produzam exatamente o mesmo conteúdo. A única diferença entre eles é o que
 * fazer com cada imagem — daí o `ImageHandler` recebido por parâmetro.
 */
import { JSDOM } from 'jsdom'
import sharp from 'sharp'

export const WP_BASE_URL = process.env.WP_BASE_URL || 'https://valorizarte.com.br'

export type WpRendered = { rendered: string }

export type WpPost = {
  id: number
  slug: string
  date: string
  title: WpRendered
  excerpt: WpRendered
  content: WpRendered
  categories: number[]
  yoast_head_json?: { title?: string; description?: string }
  _embedded?: {
    'wp:featuredmedia'?: { source_url?: string; alt_text?: string }[]
  }
}

export type WpCategory = { id: number; name: string; slug: string }

export type Span = { _type: 'span'; _key: string; text: string; marks: string[] }
export type MarkDef = { _key: string; _type: 'link'; href: string; openInNewTab: boolean }

export type TextBlock = {
  _type: 'block'
  _key: string
  style: string
  markDefs: MarkDef[]
  children: Span[]
  listItem?: 'bullet' | 'number'
  level?: number
}

/** Campos próprios da imagem: `{ url }` no site, `{ asset }` no Sanity. */
export type ImageFields = Record<string, unknown>

export type ImageBlock = ImageFields & {
  _type: 'richImage'
  _key: string
  alt: string
  caption?: string
}

export type Block = TextBlock | ImageBlock

/**
 * Recebe a URL da imagem no WordPress e devolve os campos que identificam a
 * imagem no destino, ou `undefined` se não deu para trazer. O conversor cuida
 * de `_key`, `alt` e `caption`.
 */
export type ImageHandler = (sourceUrl: string) => Promise<ImageFields | undefined>

let keyCounter = 0
const nextKey = () => `k${(keyCounter++).toString(36)}`

export async function fetchAllPages<T>(pathAndQuery: string): Promise<T[]> {
  const results: T[] = []
  let page = 1
  while (true) {
    const sep = pathAndQuery.includes('?') ? '&' : '?'
    const url = `${WP_BASE_URL}/wp-json/wp/v2${pathAndQuery}${sep}per_page=100&page=${page}`
    const res = await fetch(url)
    // Página além do total: o WordPress responde 400.
    if (res.status === 400) break
    if (!res.ok) throw new Error(`Falha ao buscar ${url}: ${res.status}`)
    const batch = (await res.json()) as T[]
    if (!batch.length) break
    results.push(...batch)
    page += 1
  }
  return results
}

/** Resolve entidades HTML e normaliza espaços. */
export function decodeText(html: string): string {
  const { window } = new JSDOM(`<body>${html}</body>`)
  const text = (window.document.body.textContent || '').replace(/\s+/g, ' ').trim()
  window.close()
  return text
}

/**
 * O campo "Resumo" do schema aceita até 300 caracteres. Um dos posts passa
 * disso — cortamos na última palavra inteira para não deixar o Studio
 * reclamando de validação depois da migração.
 */
export function excerptFrom(html: string, limit = 300): string {
  const text = decodeText(html)
  if (text.length <= limit) return text
  const cut = text.slice(0, limit - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '')}…`
}

/**
 * O Yoast grava o título já com o sufixo do site ("... - Valorizarte"), que o
 * layout do Next acrescenta de novo — e num dos posts o campo veio duplicado.
 * Só aproveitamos o título de SEO quando ele de fato diz algo diferente do
 * título do post; caso contrário a página cai no título normal.
 */
export function seoTitleFor(yoastTitle: string | undefined, postTitle: string): string | undefined {
  const cleaned = yoastTitle
    ? decodeText(yoastTitle)
        .replace(/\s*[-–|]\s*Valorizarte\s*$/i, '')
        .trim()
    : ''
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/gi, '')
  if (!cleaned || normalize(cleaned).startsWith(normalize(postTitle))) return undefined
  return cleaned
}

/** Base do nome de arquivo, previsível e segura, derivada da URL de origem. */
export function fileStemFor(url: string): string {
  const base = decodeURIComponent(url.split('/').pop() || 'imagem')
  const withoutExt = base.replace(/\.[^.]+$/, '')
  return (
    withoutExt
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()
      .slice(0, 60) || 'imagem'
  )
}

// Largura máxima guardada. As telas maiores do site usam bem menos que isso;
// acima daqui é peso morto no repositório, no Sanity e no deploy.
const MAX_WIDTH = 1600

/**
 * Reprocessa a imagem antes de guardar. O WordPress guarda fotos como PNG de
 * 1920px com 4 MB cada — em JPEG a 1600px o arquivo cai ~20x sem diferença
 * visível. Só continua PNG o que realmente usa transparência.
 */
export async function optimizeImage(
  input: Buffer,
  stem: string,
): Promise<{ data: Buffer; fileName: string }> {
  const image = sharp(input, { animated: false })
  const meta = await image.metadata()

  if (meta.width && meta.width > MAX_WIDTH) image.resize({ width: MAX_WIDTH, withoutEnlargement: true })

  // Muitos PNGs do site têm canal alfa mas nenhum pixel transparente (é o
  // padrão de imagem gerada por IA). Só vale manter PNG quando a
  // transparência é usada de verdade.
  const transparent = meta.hasAlpha ? !(await sharp(input).stats()).isOpaque : false

  if (transparent) {
    return {
      data: await image.png({ compressionLevel: 9, palette: true }).toBuffer(),
      fileName: `${stem}.png`,
    }
  }
  return {
    data: await image.flatten({ background: '#ffffff' }).jpeg({ quality: 82, mozjpeg: true }).toBuffer(),
    fileName: `${stem}.jpg`,
  }
}

/** Baixa a imagem e já devolve otimizada, pronta para gravar ou subir. */
export async function fetchOptimizedImage(rawUrl: string) {
  const url = rawUrl.replace(/^http:\/\//, 'https://')
  const res = await fetch(url)
  if (!res.ok) throw new Error(`status ${res.status}`)
  const original = Buffer.from(await res.arrayBuffer())

  const stem = fileStemFor(url)
  // Gif e svg não passam pelo sharp — vão como estão.
  const rawExt = (url.match(/\.[a-z0-9]+$/i)?.[0] || '').toLowerCase()
  if (rawExt === '.gif' || rawExt === '.svg') {
    return { data: original, fileName: `${stem}${rawExt}`, originalBytes: original.length }
  }

  const { data, fileName } = await optimizeImage(original, stem)
  return { data, fileName, originalBytes: original.length }
}

/**
 * No WordPress as imagens flutuavam ao lado do parágrafo (alignleft/right).
 * O layout novo é linear, com a imagem logo abaixo do texto — então as
 * referências do próprio texto precisam acompanhar.
 */
function fixPositionalReferences(text: string): string {
  return text.replace(/\b(fotos?|imagens?|figuras?)\s+ao\s+lado\b/gi, (match, noun: string) =>
    `${noun} abaixo`,
  )
}

/**
 * O WordPress serve o thumbnail redimensionado no src e guarda o original
 * no <a> que envolve a imagem. Preferimos o original — tanto o next/image
 * quanto o CDN do Sanity geram os tamanhos menores depois.
 */
function bestImageUrl(img: Element): string | undefined {
  const href = img.closest('a')?.getAttribute('href') || ''
  if (/\.(jpe?g|png|webp|gif|avif)$/i.test(href)) return href
  return img.getAttribute('src') || undefined
}

const DECORATOR_BY_TAG: Record<string, string> = {
  STRONG: 'strong',
  B: 'strong',
  EM: 'em',
  I: 'em',
  U: 'underline',
}

// Os posts do site não usam h1/h2 — o h1 é o título da página e as seções
// começam em h3. Promovemos um nível para que a hierarquia visual bata com
// o resto do site (e com os estilos disponíveis no Studio).
const HEADING_STYLE: Record<string, string> = {
  H1: 'h2',
  H2: 'h2',
  H3: 'h2',
  H4: 'h3',
  H5: 'h3',
  H6: 'h3',
}

function makeSpan(text: string, marks: string[]): Span {
  return { _type: 'span', _key: nextKey(), text, marks: [...marks] }
}

/** Converte o conteúdo inline de um elemento em spans + anotações de link. */
function inlineChildren(el: Element, markDefs: MarkDef[]): Span[] {
  const spans: Span[] = []

  const walk = (node: Node, marks: string[]) => {
    if (node.nodeType === 3) {
      const text = (node.textContent || '').replace(/\s+/g, ' ')
      if (text) spans.push(makeSpan(text, marks))
      return
    }
    if (node.nodeType !== 1) return

    const element = node as Element
    const tag = element.tagName

    // Imagens são blocos próprios — recolhidas fora do fluxo inline.
    if (tag === 'IMG') return
    if (tag === 'BR') {
      spans.push(makeSpan('\n', marks))
      return
    }

    if (tag === 'A') {
      const href = element.getAttribute('href')
      // Âncoras que só envolvem uma imagem não viram link de texto.
      if (!href || !element.textContent?.trim()) {
        element.childNodes.forEach((child) => walk(child, marks))
        return
      }
      const markDef: MarkDef = {
        _key: nextKey(),
        _type: 'link',
        href,
        openInNewTab: !href.startsWith('/') && !href.includes('valorizarte.com.br'),
      }
      markDefs.push(markDef)
      element.childNodes.forEach((child) => walk(child, [...marks, markDef._key]))
      return
    }

    const decorator = DECORATOR_BY_TAG[tag]
    const nextMarks = decorator && !marks.includes(decorator) ? [...marks, decorator] : marks
    element.childNodes.forEach((child) => walk(child, nextMarks))
  }

  el.childNodes.forEach((child) => walk(child, []))

  // Junta spans vizinhos com as mesmas marcas e limpa espaços nas pontas.
  const merged: Span[] = []
  for (const span of spans) {
    const last = merged[merged.length - 1]
    if (last && last.marks.join('|') === span.marks.join('|')) last.text += span.text
    else merged.push(span)
  }
  if (merged.length) {
    merged[0].text = merged[0].text.replace(/^[\s ]+/, '')
    merged[merged.length - 1].text = merged[merged.length - 1].text.replace(/[\s ]+$/, '')
  }
  return merged.filter((span) => span.text !== '').map((span) => ({ ...span, text: fixPositionalReferences(span.text) }))
}

function textBlock(
  el: Element,
  style: string,
  listItem?: 'bullet' | 'number',
  level?: number,
): TextBlock | null {
  const markDefs: MarkDef[] = []
  const children = inlineChildren(el, markDefs)
  if (!children.length) return null
  const usedKeys = new Set(children.flatMap((span) => span.marks))
  return {
    _type: 'block',
    _key: nextKey(),
    style,
    markDefs: markDefs.filter((def) => usedKeys.has(def._key)),
    children,
    ...(listItem ? { listItem, level: level ?? 1 } : {}),
  }
}

async function imageBlocksIn(
  el: Element,
  fallbackAlt: string,
  handleImage: ImageHandler,
): Promise<ImageBlock[]> {
  const blocks: ImageBlock[] = []
  for (const img of Array.from(el.querySelectorAll('img'))) {
    const source = bestImageUrl(img)
    if (!source) continue
    const fields = await handleImage(source)
    if (!fields) continue
    const title = img.getAttribute('title')?.trim()
    const alt = img.getAttribute('alt')?.trim()
    blocks.push({
      ...fields,
      _type: 'richImage',
      _key: nextKey(),
      // A maioria das imagens não tem alt no WordPress. O título do post é
      // um substituto honesto até alguém revisar cada uma pelo Studio.
      alt: alt || title || fallbackAlt,
      ...(title ? { caption: title } : {}),
    })
  }
  return blocks
}

/**
 * Converte o HTML de um post do WordPress em Portable Text: títulos, listas
 * (com aninhamento), negrito, itálico, sublinhado, links e imagens.
 */
export async function convertHtmlToBlocks(
  html: string,
  fallbackAlt: string,
  handleImage: ImageHandler,
): Promise<Block[]> {
  const cleaned = html.replace(/<script[\s\S]*?<\/script>/gi, '')
  const { window } = new JSDOM(`<body>${cleaned}</body>`)
  const blocks: Block[] = []

  const handle = async (el: Element, listLevel = 0): Promise<void> => {
    const tag = el.tagName

    if (tag === 'UL' || tag === 'OL') {
      const listItem = tag === 'UL' ? 'bullet' : 'number'
      for (const li of Array.from(el.children)) {
        if (li.tagName !== 'LI') continue
        // Sublistas viram itens de nível maior, preservando o aninhamento.
        const nested = Array.from(li.children).filter((c) => c.tagName === 'UL' || c.tagName === 'OL')
        nested.forEach((n) => n.remove())
        const block = textBlock(li, 'normal', listItem, listLevel + 1)
        if (block) blocks.push(block)
        for (const sublist of nested) await handle(sublist, listLevel + 1)
      }
      return
    }

    if (tag === 'BLOCKQUOTE') {
      for (const child of Array.from(el.children)) await handle(child, listLevel)
      if (!el.children.length) {
        const block = textBlock(el, 'blockquote')
        if (block) blocks.push(block)
      }
      return
    }

    if (HEADING_STYLE[tag]) {
      const block = textBlock(el, HEADING_STYLE[tag])
      if (block) blocks.push(block)
      return
    }

    if (tag === 'DIV') {
      for (const child of Array.from(el.children)) await handle(child, listLevel)
      return
    }

    // FIGURE e P podem trazer imagens junto com (ou no lugar de) texto. No
    // WordPress elas flutuavam ao lado do parágrafo; num layout linear o
    // texto vem primeiro e a imagem logo abaixo.
    const block = textBlock(el, 'normal')
    if (block) blocks.push(block)
    blocks.push(...(await imageBlocksIn(el, fallbackAlt, handleImage)))
  }

  for (const el of Array.from(window.document.body.children)) await handle(el)
  window.close()
  return blocks
}
