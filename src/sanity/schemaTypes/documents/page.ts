import { defineField, defineType } from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Página institucional',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'Aparece na raiz do site: valorizarte.com.br/<slug>/',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Texto de introdução (abaixo do título)',
      type: 'text',
      rows: 3,
    }),
    defineField({ name: 'body', title: 'Conteúdo', type: 'portableBody' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
  },
})
