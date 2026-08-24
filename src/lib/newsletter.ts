import { getWriteClient } from '@/sanity/lib/client'
import { isSanityConfigured } from '@/sanity/env'

export type NewsletterSubscription = {
  email: string
  name?: string
  source: string
}

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

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

  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'contato@valorizarte.com.br'
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

  try {
    await sendWelcomeEmail(email, name)
  } catch (error) {
    // Falha no envio do e-mail não deve impedir o cadastro em si — ele já
    // foi (ou não) persistido acima, o que importa para o usuário é a
    // mensagem de sucesso no formulário.
    console.error('[newsletter] falha ao enviar e-mail de boas-vindas', error)
  }

  return { persisted }
}
