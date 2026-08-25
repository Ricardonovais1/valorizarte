import { getWriteClient } from '@/sanity/lib/client'
import { isSanityConfigured } from '@/sanity/env'
import { LINKEDIN_NEWSLETTER_URL } from '@/content/newsletterSuccess'

export type NewsletterSubscription = {
  email: string
  name?: string
  source: string
}

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'
const BREVO_CONTACTS_URL = 'https://api.brevo.com/v3/contacts'

// Lista de contatos na conta Brevo do cliente onde os inscritos entram.
// Fica com valor padrão para o cadastro funcionar sem configuração extra;
// BREVO_LIST_ID sobrescreve, caso a lista mude ou outro ambiente use outra.
const BREVO_LIST_ID = Number(process.env.BREVO_LIST_ID || 3)

/**
 * Adiciona o inscrito à lista de contatos do Brevo — é isso que faz a
 * pessoa virar destinatária das campanhas, coisa que o e-mail de boas-vindas
 * (transacional, logo abaixo) não faz sozinho.
 *
 * `updateEnabled: true` é o que impede um segundo cadastro do mesmo e-mail
 * de responder 400 "Contact already exist": em vez de erro, o contato é
 * atualizado — mesmo comportamento do `createIfNotExists` no Sanity.
 *
 * Como toda a integração, só age se BREVO_API_KEY existir.
 */
async function addContactToBrevoList(email: string, name?: string) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    console.warn('[newsletter] BREVO_API_KEY não configurada — contato não adicionado à lista:', email)
    return
  }

  const response = await fetch(BREVO_CONTACTS_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      email,
      listIds: [BREVO_LIST_ID],
      updateEnabled: true,
      // A conta do cliente foi criada em português e nomeia os atributos
      // padrão como NOME/SOBRENOME — não FIRSTNAME/LASTNAME, que é o que
      // a documentação em inglês mostra. Enviar um atributo inexistente faz
      // a API responder 400 e o contato não entra na lista. Se um dia a
      // conta mudar, conferir em: GET /v3/contacts/attributes
      ...(name ? { attributes: { NOME: name } } : {}),
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Brevo (contatos) respondeu ${response.status}: ${body}`)
  }
}

/**
 * E-mail de boas-vindas via Brevo (https://www.brevo.com), plano gratuito
 * cobre bem o volume deste site. Só ativa quando BREVO_API_KEY estiver
 * definida em .env.local — sem ela, esta função não faz nada, então o
 * cadastro continua funcionando normalmente (só sem o e-mail) até a conta
 * Brevo ser criada e a chave ser configurada. Nenhum outro arquivo precisa
 * mudar quando isso acontecer.
 */
async function sendWelcomeEmail(email: string, name?: string) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    console.warn('[newsletter] BREVO_API_KEY não configurada — e-mail de boas-vindas não enviado:', email)
    return
  }

  // Precisa ser um remetente VERIFICADO na conta Brevo, senão a API recusa
  // o envio. Conferir em: GET /v3/senders (hoje só gilvan@ está verificado;
  // para usar contato@, verificar antes em Brevo -> Remetentes e IPs).
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'gilvan@valorizarte.com.br'
  const senderName = process.env.BREVO_SENDER_NAME || 'Valorizarte'
  const greetingName = name ? `, ${name}` : ''

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #133453;">
      <div style="background: #133453; padding: 24px; text-align: center;">
        <span style="color: #a48e79; font-size: 22px; font-weight: bold; letter-spacing: 1px;">VALORIZARTE</span>
      </div>
      <div style="padding: 24px;">
        <h1 style="font-size: 20px; margin: 0 0 16px;">Bem-vindo${greetingName}!</h1>
        <p style="line-height: 1.6;">
          Obrigado por assinar a newsletter da Valorizarte. A partir de agora você vai receber
          conteúdos sobre liderança, estratégia e desenvolvimento profissional direto no seu e-mail.
        </p>
        <p style="line-height: 1.6;">
          O Gilvan também publica uma newsletter no LinkedIn. Vale assinar as duas:
        </p>
        <p style="text-align: center; margin: 24px 0;">
          <!-- Link direto para o LinkedIn. No site anterior este botão levava a uma
               página intermediária de confirmação, e só de lá ao LinkedIn — um passo a
               mais que fazia gente desistir no caminho. -->
          <a href="${LINKEDIN_NEWSLETTER_URL}"
             style="background: #0A66C2; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 4px; font-weight: bold; display: inline-block;">
            Assinar a newsletter do LinkedIn
          </a>
        </p>
        <p style="line-height: 1.6;">Um abraço,<br />Equipe Valorizarte</p>
      </div>
    </div>
  `

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to: [{ email, name }],
      subject: 'Bem-vindo à newsletter da Valorizarte',
      htmlContent: html,
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Brevo respondeu ${response.status}: ${body}`)
  }
}

/**
 * Ponto único de integração com o "mundo exterior" do cadastro de
 * newsletter. Grava um documento `newsletterSubscriber` no Sanity — isso já
 * dá uma lista real, visível e exportável no Studio — e dispara o e-mail de
 * boas-vindas via Brevo (ver sendWelcomeEmail acima).
 */
export async function subscribeToNewsletter({ email, name, source }: NewsletterSubscription) {
  let persisted = false

  if (isSanityConfigured) {
    const write = getWriteClient()
    // ID determinístico a partir do e-mail: um cadastro repetido do mesmo
    // endereço atualiza o registro em vez de criar duplicata.
    const id = `newsletterSubscriber-${Buffer.from(email.toLowerCase()).toString('base64url')}`

    const now = new Date().toISOString()

    await write.createIfNotExists({
      _id: id,
      _type: 'newsletterSubscriber',
      email: email.toLowerCase(),
      name: name || undefined,
      subscribedAt: now,
      source,
      // Prova de consentimento (LGPD): a Server Action só chega aqui se a
      // caixa "Li e aceito as Políticas de Privacidade" veio marcada, então
      // o momento do cadastro é também o momento do aceite. Fica vazio nos
      // cadastros feitos antes de a caixa passar a ser obrigatória.
      consentAcceptedAt: now,
    })
    persisted = true
  } else {
    // Sem Sanity configurado ainda (ambiente de prévia). Não há onde
    // persistir o cadastro — segue em frente sem quebrar a experiência de
    // quem está revisando o site antes do go-live.
    console.warn(
      '[newsletter] Sanity não configurado — cadastro não foi persistido (ambiente de prévia):',
      email,
    )
  }

  // As duas chamadas ao Brevo são independentes e nenhuma delas pode
  // derrubar o cadastro: o registro no Sanity é a fonte de verdade e já
  // foi gravado acima. Por isso cada uma tem seu próprio try/catch — uma
  // falha na lista não impede o e-mail de boas-vindas, e vice-versa. Os
  // erros vão para o log com o corpo da resposta do Brevo, que é onde se
  // descobre o motivo (chave inválida, lista inexistente, atributo
  // desconhecido).
  try {
    await addContactToBrevoList(email, name)
  } catch (error) {
    console.error('[newsletter] falha ao adicionar contato na lista Brevo', error)
  }

  try {
    await sendWelcomeEmail(email, name)
  } catch (error) {
    console.error('[newsletter] falha ao enviar e-mail de boas-vindas', error)
  }

  return { persisted }
}
