import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Categoria do blog',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Nome', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'description', title: 'Descrição curta', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'title' },
  },
})
