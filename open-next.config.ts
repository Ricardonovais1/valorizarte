import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import d1TagCache from '@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache'
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache'

// D1 (não Durable Objects sharded) é suficiente aqui: site institucional de
// baixo tráfego, revalidação só sob demanda via webhook do Sanity — nada
// perto do volume que justificaria o tag cache "sharded".
// https://opennext.js.org/cloudflare/caching
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  tagCache: d1TagCache,
})
