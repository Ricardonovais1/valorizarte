import { defineField, defineType } from 'sanity'

export const clientLogo = defineType({
  name: 'clientLogo',
  title: 'Logo de cliente',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nome da empresa', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'logo', title: 'Logo', type: 'richImage', validation: (r) => r.required() }),
    defineField({ name: 'website', title: 'Site (opcional)', type: 'url' }),
    defineField({ name: 'order', title: 'Ordem de exibição', type: 'number', initialValue: 0 }),
  ],
  orderings: [
    { title: 'Ordem de exibição', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', media: 'logo' },
  },
})
