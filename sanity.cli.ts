import { defineCliConfig } from 'sanity/cli'

import { dataset, projectId } from './src/sanity/env'

export default defineCliConfig({
  api: { projectId, dataset },
  // Fixa o endereço do Studio hospedado pelo próprio Sanity (grátis) em
  // valorizarte.sanity.studio, para "npx sanity deploy" não perguntar o
  // hostname a cada deploy. Trocar aqui se o nome já estiver em uso.
  studioHost: 'valorizarte',
  deployment: {
    appId: 'lfdvq8y8p98taz7ggrq4mjkn',
  },
})
