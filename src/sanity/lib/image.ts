import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'
import { dataset, projectId } from '../env'

const imageBuilder = projectId && dataset ? createImageUrlBuilder({ projectId, dataset }) : null

export function urlForImage(source: Image | undefined) {
  if (!source?.asset?._ref || !imageBuilder) {
    return undefined
  }
  return imageBuilder.image(source).auto('format').fit('max')
}
