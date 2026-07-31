import Link from 'next/link'
import { Container } from '@/components/Container'

export default function NotFound() {
  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="text-4xl font-bold text-navy">Página não encontrada</h1>
      <p className="mt-3 text-slate-600">O conteúdo que você procura não existe ou foi movido.</p>
      <Link
        href="/"
        className="mt-6 rounded-[5px] bg-gold px-6 py-2.5 text-sm font-medium text-white hover:brightness-95"
      >
        Voltar para o início
      </Link>
    </Container>
  )
}
