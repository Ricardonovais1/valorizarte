/**
 * Controle de exibição do popup da lista VIP.
 *
 * Mora fora do componente do popup porque quem se inscreve por QUALQUER
 * formulário do site precisa poder silenciá-lo — não faz sentido convidar
 * para assinar alguém que acabou de assinar.
 */
export const NEWSLETTER_POPUP_SEEN_KEY = 'valorizarte-newsletter-popup-seen'

export function popupJaResolvido() {
  try {
    return Boolean(localStorage.getItem(NEWSLETTER_POPUP_SEEN_KEY))
  } catch {
    // Navegação anônima ou storage bloqueado pelo navegador.
    return false
  }
}

export function marcarPopupComoResolvido() {
  try {
    localStorage.setItem(NEWSLETTER_POPUP_SEEN_KEY, '1')
  } catch {
    // Se não dá para gravar, o popup volta numa próxima visita — incômodo
    // pequeno perto de deixar uma exceção derrubar o fluxo de cadastro.
  }
}
