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
    defineField({
      name: 'summary',
      title: 'Subtítulo (aparece no topo da página do serviço)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'cardSummary',
      title: 'Resumo curto (aparece nos cards da Home e de /empresas ou /profissionais)',
      type: 'text',
      rows: 3,
      description: 'Se vazio, os cards usam o subtítulo acima.',
    }),
    defineField({
      name: 'headerImage',
      title: 'Banner do topo',
      type: 'richImage',
      description: 'Faixa larga com o título do serviço, exibida no topo da página (opcional).',
    }),
    defineField({ name: 'image', title: 'Foto da página do serviço', type: 'richImage' }),
    defineField({
      name: 'highlights',
      title: 'Lista de destaques (checklist)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Frases curtas exibidas com marcador de check na página do serviço.',
    }),
    defineField({ name: 'body', title: 'Descrição completa', type: 'portableBody' }),
    defineField({
      name: 'tabSections',
      title: 'Sessões com seletor de abas',
      type: 'array',
      description:
        'Quando preenchido, substitui a Descrição completa/checklist por uma ou mais sessões com seletor de abas (ex: Coaching De Carreira/Vocacional/De Vida; ou Coaching + Mentoring, cada um com suas próprias abas).',
      of: [
        {
          type: 'object',
          name: 'serviceTabSection',
          fields: [
            defineField({ name: 'title', title: 'Título da sessão (opcional)', type: 'string' }),
            defineField({
              name: 'image',
              title: 'Imagem lateral (opcional)',
              type: 'richImage',
              description: 'Se ausente, usa a foto da página do serviço, acima.',
            }),
            defineField({
              name: 'tabs',
              title: 'Abas',
              type: 'array',
              validation: (r) => r.required().min(1),
              of: [
                {
                  type: 'object',
                  name: 'serviceTab',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Nome da aba',
                      type: 'string',
                      validation: (r) => r.required(),
                    }),
                    defineField({
                      name: 'body',
                      title: 'Texto',
                      type: 'text',
                      rows: 4,
                      validation: (r) => r.required(),
                    }),
                  ],
                  preview: {
                    select: { title: 'label', subtitle: 'body' },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'tabs.0.label' },
          },
        },
      ],
    }),
    defineField({
      name: 'closingText',
      title: 'Texto de encerramento',
      type: 'text',
      rows: 3,
      description: 'Parágrafo exibido depois da lista de destaques, quando o serviço precisa de uma chamada final.',
    }),
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
