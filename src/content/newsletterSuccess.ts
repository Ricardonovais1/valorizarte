/**
 * Conteúdo da confirmação de inscrição na newsletter, em um lugar só.
 *
 * É usado em dois pontos que precisam dizer a mesma coisa: o modal que
 * aparece logo após o cadastro (NewsletterSuccessModal) e a página
 * /empresas/inscricao-confirmada-com-sucesso, que continua no ar porque
 * e-mails antigos do site anterior ainda apontam para ela.
 */

/** Newsletter do Gilvan no LinkedIn — destino final que queremos que a pessoa alcance. */
export const LINKEDIN_NEWSLETTER_URL =
  'https://www.linkedin.com/in/gilvan-silva/recent-activity/newsletter/'

export const NEWSLETTER_HIGHLIGHTS = [
  { emoji: '💼', text: 'Dicas valiosas para empresários, líderes e empreendedores' },
  { emoji: '📌', text: 'Ferramentas práticas para seu desenvolvimento pessoal e profissional' },
  { emoji: '🔥', text: 'Reflexões que despertam ação, clareza e autenticidade' },
  { emoji: '🎯', text: 'Convites para eventos, mentorias e cursos exclusivos' },
] as const
