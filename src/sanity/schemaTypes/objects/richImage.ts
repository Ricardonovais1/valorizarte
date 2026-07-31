import { defineField, defineType } from 'sanity'

export const richImage = defineType({
  name: 'richImage',
  title: 'Imagem',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Texto alternativo (obrigatório)',
      type: 'string',
      description:
        'Descreva a imagem em uma frase curta. Usado por leitores de tela e pelo Google — não deixe em branco.',
      validation: (rule) => rule.required().error('Toda imagem precisa de um texto alternativo.'),
    }),
    defineField({
      name: 'caption',
      title: 'Legenda (opcional)',
      type: 'string',
    }),
  ],
})
