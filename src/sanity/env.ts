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

/**
 * Este arquivo é compilado por DOIS empacotadores diferentes, e cada um
 * só injeta no bundle do navegador as variáveis com o seu prefixo:
 *
 *   - Next.js (o site)   -> NEXT_PUBLIC_*
 *   - Vite (o Studio)    -> SANITY_STUDIO_*
 *
 * Por isso cada valor é lido nos dois prefixos: no bundle do site o
 * SANITY_STUDIO_* vem vazio, no bundle do Studio o NEXT_PUBLIC_* vem
 * vazio, e o `||` fica com o que existir. Os acessos precisam ser
 * literais (`process.env.NOME`) — uma busca dinâmica como
 * `process.env[nome]` não é substituída em tempo de build por nenhum dos
 * dois, que foi exatamente o que deixou o Studio publicado sem
 * `projectId`.
 */

export const apiVersion =
  process.env.SANITY_STUDIO_API_VERSION ||
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  '2025-01-01'

export const dataset =
  process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || ''

export const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''

// Token com permissão de escrita, usado apenas em rotas de servidor
// (cadastro de newsletter, webhook de revalidação). NUNCA exponha este
// valor com o prefixo NEXT_PUBLIC_.
export const writeToken = process.env.SANITY_API_WRITE_TOKEN || ''

// Segredo compartilhado com o webhook do Sanity que dispara a revalidação
// sob demanda (ver src/app/api/revalidate/route.ts).
export const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET || ''

export const isSanityConfigured = Boolean(projectId && dataset)
