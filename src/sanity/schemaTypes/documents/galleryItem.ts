import { defineField, defineType } from 'sanity'

export const galleryItem = defineType({
  name: 'galleryItem',
  title: 'Foto da galeria',
  type: 'document',
  fields: [
    defineField({ name: 'image', title: 'Foto', type: 'richImage', validation: (r) => r.required() }),
    defineField({ name: 'eventDate', title: 'Data do evento', type: 'date' }),
    defineField({ name: 'order', title: 'Ordem de exibição', type: 'number', initialValue: 0 }),
  ],
  orderings: [
    { title: 'Ordem de exibição', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'image.caption', media: 'image', subtitle: 'eventDate' },
  },
})
