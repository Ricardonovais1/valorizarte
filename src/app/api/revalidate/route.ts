import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { revalidateSecret } from '@/sanity/env'
import { revalidateTagsByType } from '@/lib/data'

/**
 * Webhook de revalidação sob demanda.
 *
 * Configure em manage.sanity.io -> API -> Webhooks:
 *   URL: https://SEU-DOMINIO/api/revalidate
 *   Dataset: production (ou o que você usar)
 *   Trigger on: Create, Update, Delete
 *   Secret: o mesmo valor de SANITY_REVALIDATE_SECRET no .env
 *   Projection: { "_type": _type }
 *
 * Assim que o cliente publica um post no Studio, o Sanity chama esta
 * rota, que invalida só o cache do tipo de conteúdo afetado — o site
 * atualiza em segundos, sem precisar de um novo deploy.
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, revalidateSecret)

    if (!isValidSignature) {
      return NextResponse.json({ message: 'Assinatura inválida' }, { status: 401 })
    }

    const type = body?._type
    if (!type) {
      return NextResponse.json({ message: 'Corpo sem _type' }, { status: 400 })
    }

    const tag = revalidateTagsByType[type]
    if (!tag) {
      return NextResponse.json({ message: `Tipo "${type}" não mapeado para revalidação` }, { status: 200 })
    }

    revalidateTag(tag, 'max')

    return NextResponse.json({ revalidated: true, tag, now: Date.now() })
  } catch (error) {
    console.error('[revalidate] erro ao processar webhook', error)
    return NextResponse.json({ message: 'Erro ao revalidar' }, { status: 500 })
  }
}
