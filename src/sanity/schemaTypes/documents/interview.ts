import { defineArrayMember, defineField, defineType } from 'sanity'

export const interview = defineType({
  name: 'interview',
  title: 'Entrevista na mídia',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'Aparece em valorizarte.com.br/midia/entrevistas/<slug>/ — igual ao site atual.',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'outlet',
      title: 'Veículo',
      type: 'string',
      description: 'Nome da rádio, TV ou publicação. Ex: Band News, Rádio Itatiaia.',
    }),
    defineField({ name: 'publishedAt', title: 'Data da entrevista', type: 'date' }),
    defineField({ name: 'coverImage', title: 'Imagem de capa', type: 'richImage' }),
    defineField({
      name: 'audioTracks',
      title: 'Áudios',
      type: 'array',
      description: 'Entrevistas longas costumam vir divididas em blocos — cadastre um item por bloco.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'audioTrack',
          fields: [
            defineField({ name: 'label', title: 'Nome do bloco', type: 'string' }),
            defineField({
              name: 'url',
              title: 'Endereço do arquivo (mp3)',
              type: 'url',
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        }),
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'Vídeo (YouTube)',
      type: 'url',
      description: 'Para entrevistas de TV ou podcast em vídeo.',
    }),
    defineField({ name: 'body', title: 'Texto de apoio', type: 'portableBody' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  orderings: [
    { title: 'Mais recentes', name: 'dateDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'outlet', media: 'coverImage' },
  },
})
