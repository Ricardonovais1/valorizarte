/**
 * Configuração central do Sanity.
 *
 * Propositalmente NÃO lança erro se as variáveis de ambiente estiverem
 * ausentes — isso permite que o site faça build e rode em modo de prévia
 * com o conteúdo semente (src/content/seed.ts) antes de existir um projeto
 * Sanity real. Assim que você criar o projeto (`npx sanity init`) e
 * preencher o .env.local, o site passa a usar o conteúdo de verdade
 * automaticamente — nenhuma outra mudança de código é necessária.
 */

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01'

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || ''

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''

// Token com permissão de escrita, usado apenas em rotas de servidor
// (cadastro de newsletter, webhook de revalidação). NUNCA exponha este
// valor com o prefixo NEXT_PUBLIC_.
export const writeToken = process.env.SANITY_API_WRITE_TOKEN || ''

// Segredo compartilhado com o webhook do Sanity que dispara a revalidação
// sob demanda (ver src/app/api/revalidate/route.ts).
export const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET || ''

export const isSanityConfigured = Boolean(projectId && dataset)
