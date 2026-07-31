import { urlForImage } from '@/sanity/lib/image'

/**
 * Conteúdo semente usa caminhos de string simples em public/images/...;
 * conteúdo do Sanity usa objetos de imagem (asset._ref). Esta função aceita
 * qualquer um dos dois e devolve uma URL de imagem pronta para <Image>.
 */
export function resolveImage(source: unknown, size?: { width: number; height: number }): string | undefined {
  if (typeof source === 'string') return source
  const built = urlForImage(source as never)
  if (!built) return undefined
  return size ? built.width(size.width).height(size.height).url() : built.url()
}
