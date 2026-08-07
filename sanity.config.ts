'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

export default defineConfig({
  name: 'valorizarte',
  title: 'Valorizarte — Painel de conteúdo',
  // '/' porque o Studio é hospedado à parte (valorizarte.sanity.studio),
  // não embutido em /studio dentro do Next — ver seção "Hospedagem" do README.
  basePath: '/',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    // "Vision" deixa você rodar consultas GROQ manualmente — útil para
    // depurar, não precisa remover em produção, mas pode se preferir.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
