import type { SchemaTypeDefinition } from 'sanity'

import { careerTip } from './documents/careerTip'
import { category } from './documents/category'
import { clientLogo } from './documents/clientLogo'
import { galleryItem } from './documents/galleryItem'
import { interview } from './documents/interview'
import { newsletterSubscriber } from './documents/newsletterSubscriber'
import { page } from './documents/page'
import { post } from './documents/post'
import { service } from './documents/service'
import { testimonial } from './documents/testimonial'
import { usefulLink } from './documents/usefulLink'
import { portableBody } from './objects/portableBody'
import { richImage } from './objects/richImage'
import { seo } from './objects/seo'
import { homePage } from './singletons/homePage'
import { navigation } from './singletons/navigation'
import { siteSettings } from './singletons/siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // objetos reutilizáveis
    seo,
    richImage,
    portableBody,
    // documentos
    post,
    category,
    testimonial,
    clientLogo,
    galleryItem,
    interview,
    careerTip,
    usefulLink,
    service,
    page,
    newsletterSubscriber,
    // singletons
    siteSettings,
    navigation,
    homePage,
  ],
}

export const singletonTypes = new Set(['siteSettings', 'navigation', 'homePage'])
