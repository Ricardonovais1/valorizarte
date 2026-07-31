import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Post do blog',
  type: 'document',
  groups: [
    { name: 'content', title: 'Conteúdo', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'content',
      description:
        'Aparece na raiz do site, ex: valorizarte.com.br/meu-titulo/ — igual ao site atual, para não perder posicionamento no Google.',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Resumo',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Usado nos cards de listagem do blog e como descrição padrão de SEO.',
      validation: (r) => r.max(300),
    }),
    defineField({
      name: 'coverImage',
      title: 'Imagem de capa',
      type: 'richImage',
      group: 'content',
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'content',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data de publicação',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'body',
      title: 'Corpo do post',
      type: 'portableBody',
      group: 'content',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', media: 'coverImage', subtitle: 'category.title' },
  },
})
