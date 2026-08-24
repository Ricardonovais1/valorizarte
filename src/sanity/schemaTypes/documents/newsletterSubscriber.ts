import { defineField, defineType } from 'sanity'

/**
 * Cada cadastro na newsletter vira um documento aqui. Isso dá ao Gilvan
 * uma lista visível e exportável dentro do próprio Studio, sem depender
 * de já ter escolhido uma ferramenta de e-mail marketing (Mailchimp,
 * MailerLite, etc.) — a lista existe desde o primeiro cadastro, e a
 * integração com o envio de e-mails de fato pode ser plugada depois em
 * src/lib/newsletter.ts sem mudar o formulário nem o schema.
 */
export const newsletterSubscriber = defineType({
  name: 'newsletterSubscriber',
  title: 'Inscrito na newsletter',
  type: 'document',
  // Este tipo não deve ser criado ou editado manualmente no Studio —
  // só existe para leitura/exportação. Ver src/sanity/structure.ts.
  fields: [
    defineField({ name: 'email', title: 'E-mail', type: 'string', readOnly: true, validation: (r) => r.required() }),
    defineField({ name: 'name', title: 'Nome (opcional)', type: 'string', readOnly: true }),
    defineField({ name: 'subscribedAt', title: 'Cadastrado em', type: 'datetime', readOnly: true }),
    defineField({ name: 'source', title: 'Origem', type: 'string', readOnly: true, description: 'Página onde o formulário foi preenchido.' }),
    defineField({
      name: 'consentAcceptedAt',
      title: 'Aceitou as Políticas de Privacidade em',
      type: 'datetime',
      readOnly: true,
      description:
        'Momento em que a pessoa marcou a caixa de consentimento no formulário. Vazio nos cadastros anteriores à exigência.',
    }),
  ],
  preview: {
    select: { title: 'email', subtitle: 'subscribedAt' },
  },
})
