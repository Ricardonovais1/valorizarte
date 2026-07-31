/**
 * Studio embutido no próprio Next.js — rota /studio.
 * Não pré-renderizar: o Studio é uma aplicação client-side.
 */
import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
