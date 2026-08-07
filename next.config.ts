import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      // Domínio do WordPress atual — só necessário durante a migração,
      // enquanto imagens antigas ainda não foram todas subidas ao Sanity.
      // Pode ser removido depois que o migrate-wp.ts rodar por completo.
      { protocol: 'https', hostname: 'valorizarte.com.br' },
      { protocol: 'http', hostname: 'valorizarte.com.br' },
    ],
  },
  async redirects() {
    return [
      // No site atual, "Dicas de Carreira" mora numa URL herdada de um
      // rascunho antigo. O conteúdo passa a viver em /dicas-de-carreira.
      { source: '/como-identificar-o-seu-proposito', destination: '/dicas-de-carreira', permanent: true },
    ]
  },
}

export default nextConfig

// Dá ao `next dev` acesso aos bindings do wrangler.jsonc (R2, D1) via
// getCloudflareContext, para o comportamento em dev bater com o deploy real.
// Não afeta build/produção — só importa em desenvolvimento.
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
initOpenNextCloudflareForDev()
