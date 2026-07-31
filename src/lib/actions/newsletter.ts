'use server'

import { z } from 'zod'
import { subscribeToNewsletter } from '@/lib/newsletter'

// FormData.get() devolve `null` (não `undefined`) para campos ausentes —
// por isso usamos .nullish() (aceita null OU undefined) em vez de
// .optional() (que só aceita undefined) em todo campo não obrigatório.
const schema = z.object({
  email: z.string().trim().email('Digite um e-mail válido.'),
  name: z.string().trim().max(120).nullish(),
  // Campo-armadilha: invisível para humanos via CSS, mas robôs de spam
  // costumam preencher todos os campos de um formulário. Se vier
  // preenchido, tratamos como spam e fingimos sucesso.
  company: z.string().max(0, 'Campo inválido.').nullish(),
  source: z.string().max(200).nullish(),
})

export type NewsletterFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

// Limite simples de tentativas por IP, em memória. Em produção com mais
// de uma instância de servidor isso não é perfeito (cada instância tem
// seu próprio contador), mas é suficiente para conter spam de robôs
// simples num site institucional de baixo tráfego. Se o volume crescer,
// trocar por um contador no Sanity ou num serviço como Upstash Redis.
const attempts = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 5

function isRateLimited(key: string) {
  const now = Date.now()
  const entry = attempts.get(key)
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > MAX_ATTEMPTS
}

export async function subscribeAction(
  _prevState: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  const parsed = schema.safeParse({
    email: formData.get('email'),
    name: formData.get('name'),
    company: formData.get('company'),
    source: formData.get('source'),
  })

  if (!parsed.success) {
    // Se foi o honeypot que disparou, não entregamos a mensagem de erro
    // real — apenas fingimos sucesso, para não ensinar o robô a se
    // adaptar.
    const isHoneypot = parsed.error.issues.some((issue) => issue.path[0] === 'company')
    if (isHoneypot) {
      return { status: 'success', message: 'Cadastro recebido! Obrigado.' }
    }
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message || 'Não foi possível validar os dados enviados.',
    }
  }

  // Chave de rate-limit: e-mail normalizado (simples e eficaz o
  // suficiente aqui; evita depender de cabeçalhos de IP que variam
  // conforme o proxy/CDN na frente da aplicação).
  if (isRateLimited(parsed.data.email.toLowerCase())) {
    return { status: 'error', message: 'Muitas tentativas. Tente novamente em alguns minutos.' }
  }

  try {
    await subscribeToNewsletter({
      email: parsed.data.email,
      name: parsed.data.name || undefined,
      source: parsed.data.source || 'desconhecida',
    })
    return { status: 'success', message: 'Cadastro recebido! Você vai receber nossos próximos conteúdos.' }
  } catch (error) {
    console.error('[newsletter] falha ao gravar cadastro', error)
    return {
      status: 'error',
      message: 'Não foi possível concluir o cadastro agora. Tente novamente em instantes.',
    }
  }
}
