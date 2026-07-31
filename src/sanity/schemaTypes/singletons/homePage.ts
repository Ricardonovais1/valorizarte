import { defineField, defineType } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Página inicial',
  type: 'document',
  fields: [
    defineField({
      name: 'heroSlides',
      title: 'Slides do banner principal',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'heroSlide',
          fields: [
            defineField({ name: 'image', title: 'Imagem de fundo', type: 'richImage' }),
            defineField({ name: 'headline', title: 'Título', type: 'string' }),
            defineField({ name: 'subtext', title: 'Texto de apoio', type: 'text', rows: 2 }),
            defineField({ name: 'ctaLabel', title: 'Texto do botão', type: 'string', initialValue: 'Saiba Mais' }),
            defineField({ name: 'ctaHref', title: 'Link do botão', type: 'string' }),
          ],
          preview: {
            select: { title: 'headline', media: 'image' },
          },
        },
      ],
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Título do banner principal (legado)',
      type: 'string',
      description: 'Usado apenas se nenhum slide for cadastrado acima.',
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Texto de apoio do banner (legado)',
      type: 'text',
      rows: 2,
      description: 'Usado apenas se nenhum slide for cadastrado acima.',
    }),
    defineField({
      name: 'founderIntro',
      title: 'Texto de apresentação (seção sobre a Valorizarte)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'showTestimonials',
      title: 'Mostrar seção de depoimentos',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showClientLogos',
      title: 'Mostrar seção de logos de clientes',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showGallery',
      title: 'Mostrar galeria de fotos',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'Página inicial' }),
  },
})
