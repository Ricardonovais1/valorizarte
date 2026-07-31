import type { Metadata } from 'next'
import { Container } from '@/components/Container'
import { PageHeader } from '@/components/PageHeader'

export const metadata: Metadata = {
  title: 'Mídia',
  description: 'Entrevistas, aparições na imprensa e fotos da Valorizarte.',
}

/**
 * A seção "Mídia" do site atual reúne entrevistas em rádio/TV e uma
 * galeria de fotos. O conteúdo específico (links de entrevistas, vídeos)
 * precisa ser confirmado com o cliente e cadastrado como um tipo de
 * conteúdo próprio no Sanity — por ora esta página serve de estrutura.
 */
export default function MidiaPage() {
  return (
    <>
      <PageHeader title="Mídia" />
      <Container className="py-16 text-center">
        <p className="text-slate-600">
          Em breve: entrevistas de rádio, TV e a galeria de fotos, migradas do site atual.
        </p>
      </Container>
    </>
  )
}
