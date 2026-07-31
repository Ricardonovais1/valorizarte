import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configurações do site',
  type: 'document',
  fields: [
    defineField({ name: 'siteName', title: 'Nome do site', type: 'string', initialValue: 'Valorizarte' }),
    defineField({ name: 'tagline', title: 'Frase de efeito (usada no rodapé e no SEO padrão)', type: 'string' }),
    defineField({ name: 'logo', title: 'Logo', type: 'richImage' }),
    defineField({ name: 'phone', title: 'Telefone / WhatsApp', type: 'string' }),
    defineField({ name: 'email', title: 'E-mail de contato', type: 'string' }),
    defineField({
      name: 'social',
      title: 'Redes sociais',
      type: 'object',
      fields: [
        { name: 'instagram', title: 'Instagram (URL)', type: 'url' },
        { name: 'linkedin', title: 'LinkedIn (URL)', type: 'url' },
        { name: 'facebook', title: 'Facebook (URL)', type: 'url' },
      ],
    }),
    defineField({ name: 'defaultSeo', title: 'SEO padrão do site', type: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'Configurações do site' }),
  },
})
