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
}

export default nextConfig
