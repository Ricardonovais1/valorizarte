import { defineField, defineType } from 'sanity'

export const usefulLink = defineType({
  name: 'usefulLink',
  title: 'Link importante',
  type: 'document',
  fields: [
    defineField({ name: 'label', title: 'Texto do botão', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'url', title: 'Endereço', type: 'url', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Descrição (opcional)', type: 'string' }),
    defineField({ name: 'order', title: 'Ordem de exibição', type: 'number', initialValue: 0 }),
  ],
  orderings: [
    { title: 'Ordem de exibição', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'label', subtitle: 'url' },
  },
})
