import { defineField, defineType } from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Título para o Google (SEO)',
      type: 'string',
      description:
        'Se vazio, o site usa o título da página. Ideal: até 60 caracteres.',
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: 'description',
      title: 'Descrição para o Google (SEO)',
      type: 'text',
      rows: 3,
      description: 'Aparece como resumo nos resultados de busca. Ideal: até 155 caracteres.',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'shareImage',
      title: 'Imagem de compartilhamento (redes sociais)',
      type: 'image',
      description: 'Usada quando o link é compartilhado no WhatsApp, LinkedIn, etc.',
    }),
  ],
  options: { collapsible: true, collapsed: true },
})
