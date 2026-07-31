import { createClient, type SanityClient } from 'next-sanity'
import { apiVersion, dataset, isSanityConfigured, projectId, writeToken } from '../env'

/**
 * Cliente de leitura, usado por todas as páginas públicas do site.
 * Usa o CDN do Sanity (rápido, com cache) — perfeito para conteúdo que
 * não precisa ser 100% em tempo real.
 */
export const client: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: 'published',
    })
  : null

/**
 * Cliente de escrita, usado apenas em rotas de servidor (Server Actions,
 * Route Handlers). Requer um token com permissão de "Editor" ou superior,
 * gerado em manage.sanity.io -> API -> Tokens.
 */
export function getWriteClient(): SanityClient {
  if (!isSanityConfigured) {
    throw new Error(
      'Sanity ainda não está configurado. Defina NEXT_PUBLIC_SANITY_PROJECT_ID e NEXT_PUBLIC_SANITY_DATASET no .env.local.',
    )
  }
  if (!writeToken) {
    throw new Error(
      'SANITY_API_WRITE_TOKEN não definido. Crie um token de escrita em manage.sanity.io e adicione ao .env.local.',
    )
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: writeToken,
  })
}
