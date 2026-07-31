import { defineField, defineType } from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Serviço',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Nome do serviço', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'Aparece em valorizarte.com.br/empresas/<slug>/ — igual ao site atual.',
      options: { source: 'title', maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'audience',
      title: 'Público-alvo',
      type: 'string',
      options: {
        list: [
          { title: 'Para empresas', value: 'empresas' },
          { title: 'Para profissionais', value: 'profissionais' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'summary', title: 'Resumo (aparece nos cards)', type: 'text', rows: 3 }),
    defineField({ name: 'image', title: 'Foto da página do serviço', type: 'richImage' }),
    defineField({
      name: 'highlights',
      title: 'Lista de destaques (checklist)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Frases curtas exibidas com marcador de check na página do serviço.',
    }),
    defineField({ name: 'body', title: 'Descrição completa', type: 'portableBody' }),
    defineField({ name: 'order', title: 'Ordem de exibição', type: 'number', initialValue: 0 }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  orderings: [
    { title: 'Ordem de exibição', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'audience' },
  },
})
