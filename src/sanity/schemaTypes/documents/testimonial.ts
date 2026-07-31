import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Depoimento',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nome', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'roleAndCompany', title: 'Cargo e empresa', type: 'string' }),
    defineField({ name: 'photo', title: 'Foto', type: 'richImage' }),
    defineField({
      name: 'quote',
      title: 'Depoimento',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Ordem de exibição',
      type: 'number',
      description: 'Números menores aparecem primeiro.',
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: 'Ordem de exibição', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', subtitle: 'roleAndCompany', media: 'photo' },
  },
})
