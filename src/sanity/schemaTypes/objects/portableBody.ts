import { defineArrayMember, defineType } from 'sanity'

/**
 * Corpo de texto rico usado em posts e páginas. Deliberadamente restrito:
 * títulos, negrito/itálico, listas, links e imagens. Nada de tabelas ou
 * embeds arbitrários — cada opção a mais é uma forma nova de o cliente
 * "quebrar" o layout sem querer.
 */
export const portableBody = defineType({
  name: 'portableBody',
  title: 'Conteúdo',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Texto', value: 'normal' },
        { title: 'Título 2', value: 'h2' },
        { title: 'Título 3', value: 'h3' },
        { title: 'Citação', value: 'blockquote' },
      ],
      lists: [
        { title: 'Lista com marcadores', value: 'bullet' },
        { title: 'Lista numerada', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Negrito', value: 'strong' },
          { title: 'Itálico', value: 'em' },
          { title: 'Sublinhado', value: 'underline' },
        ],
        annotations: [
          {
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              {
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (rule) =>
                  rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
              },
              {
                name: 'openInNewTab',
                title: 'Abrir em nova aba',
                type: 'boolean',
                initialValue: true,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({ type: 'richImage' }),
  ],
})
