import { defineField, defineType } from 'sanity'

export const navigation = defineType({
  name: 'navigation',
  title: 'Menu de navegação',
  type: 'document',
  fields: [
    defineField({
      name: 'items',
      title: 'Itens do menu principal',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'navItem',
          fields: [
            { name: 'label', title: 'Texto', type: 'string', validation: (r) => r.required() },
            {
              name: 'href',
              title: 'Link (ex: /blog, /quemsomos)',
              type: 'string',
              validation: (r) => r.required(),
            },
            {
              name: 'children',
              title: 'Submenu (opcional)',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'navChild',
                  fields: [
                    { name: 'label', title: 'Texto', type: 'string', validation: (r) => r.required() },
                    { name: 'href', title: 'Link', type: 'string', validation: (r) => r.required() },
                  ],
                },
              ],
            },
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Menu de navegação' }),
  },
})
