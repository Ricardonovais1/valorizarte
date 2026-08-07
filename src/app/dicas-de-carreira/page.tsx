import type { Metadata } from 'next'
import { Container } from '@/components/Container'
import { PageHeader } from '@/components/PageHeader'
import { NewsletterForm } from '@/components/NewsletterForm'
import { getCareerTips } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Dicas de Carreira',
  description:
    'Vídeos curtos com orientações práticas sobre propósito, transição de carreira e desenvolvimento profissional.',
}

// Aceita links de /reel/, /p/ e /tv/ e devolve o iframe oficial de embed,
// que dispensa carregar o script do Instagram.
function instagramEmbedUrl(url: string): string | undefined {
  const match = url.match(/instagram\.com\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/)
  return match ? `https://www.instagram.com/reel/${match[1]}/embed/` : undefined
}

export default async function DicasDeCarreiraPage() {
  const tips = await getCareerTips()
  const embeds = tips
    .map((tip) => ({ ...tip, embedUrl: instagramEmbedUrl(tip.instagramUrl) }))
    .filter((tip) => tip.embedUrl)

  return (
    <>
      <PageHeader title="Dicas de Carreira" icon />
      <Container className="space-y-12 py-16">
        <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-slate-600">
          Conteúdos rápidos sobre propósito, transição de carreira e desenvolvimento profissional, gravados
          por Gilvan Silva.
        </p>

        {embeds.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {embeds.map((tip) => (
              <div
                key={tip._id}
                className="relative h-[360px] overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70"
              >
                {/* O embed do Instagram vem com cabeçalho (perfil) e rodapé
                    (curtidas/comentário) que não dá pra remover via URL. O
                    iframe é deslocado pra cima para cortar o cabeçalho, e o
                    container com altura fixa e overflow escondido corta o
                    rodapé — sobra só o vídeo. */}
                <iframe
                  src={tip.embedUrl}
                  title={tip.title}
                  loading="lazy"
                  allowFullScreen
                  scrolling="no"
                  className="absolute -top-14 left-0 h-[640px] w-full border-0"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500">Nenhuma dica cadastrada ainda.</p>
        )}

        <div className="mx-auto max-w-2xl">
          <NewsletterForm source="dicas-de-carreira" />
        </div>
      </Container>
    </>
  )
}
