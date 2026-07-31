import type { StructureResolver } from 'sanity/structure'

/**
 * Organiza o menu lateral do Studio em português, agrupado por assunto,
 * com os singletons abrindo direto no documento (em vez de numa lista de
 * um item só) e a lista de inscritos da newsletter em modo somente leitura.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Conteúdo do site')
    .items([
      S.listItem()
        .title('Página inicial')
        .icon(() => '🏠')
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.divider(),
      S.listItem()
        .title('Blog')
        .child(
          S.list()
            .title('Blog')
            .items([
              S.documentTypeListItem('post').title('Posts'),
              S.documentTypeListItem('category').title('Categorias'),
            ]),
        ),
      S.listItem()
        .title('Páginas institucionais')
        .child(S.documentTypeList('page').title('Páginas institucionais')),
      S.listItem()
        .title('Serviços (Para Empresas / Para Profissionais)')
        .child(S.documentTypeList('service').title('Serviços')),
      S.divider(),
      S.listItem()
        .title('Depoimentos')
        .child(S.documentTypeList('testimonial').title('Depoimentos')),
      S.listItem()
        .title('Logos de clientes')
        .child(S.documentTypeList('clientLogo').title('Logos de clientes')),
      S.listItem()
        .title('Galeria de fotos')
        .child(S.documentTypeList('galleryItem').title('Galeria de fotos')),
      S.divider(),
      S.listItem()
        .title('Inscritos na newsletter')
        .icon(() => '✉️')
        .child(
          S.documentTypeList('newsletterSubscriber')
            .title('Inscritos na newsletter')
            .defaultOrdering([{ field: 'subscribedAt', direction: 'desc' }]),
        ),
      S.divider(),
      S.listItem()
        .title('Menu de navegação')
        .child(S.document().schemaType('navigation').documentId('navigation')),
      S.listItem()
        .title('Configurações do site')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ])
