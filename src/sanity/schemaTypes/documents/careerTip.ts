import { defineField, defineType } from 'sanity'

export const careerTip = defineType({
  name: 'careerTip',
  title: 'Dica de carreira',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      description: 'Aparece acima do vídeo e é lido por leitores de tela.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Endereço do reel no Instagram',
      type: 'url',
      description: 'Cole o link do post — ex: https://www.instagram.com/reel/C1NnYesOWWx/',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'order', title: 'Ordem de exibição', type: 'number', initialValue: 0 }),
  ],
  orderings: [
    { title: 'Ordem de exibição', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'instagramUrl' },
  },
})
