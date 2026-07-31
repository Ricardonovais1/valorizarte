import Image from 'next/image'
import Link from 'next/link'
import { getSiteSettings } from '@/lib/data'
import { Container } from './Container'

export async function Footer() {
  const settings = await getSiteSettings()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy-deep text-white/70">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col items-start gap-3">
          <Image src="/images/logo-gold-icon.png" alt="" width={63} height={40} />
          <p className="text-xl font-bold tracking-wide text-gold">{(settings?.siteName || 'Valorizarte').toUpperCase()}</p>
          <p className="text-sm text-white/50">{settings?.tagline}</p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">Contato</p>
          <ul className="mt-3 space-y-2 text-sm">
            {settings?.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="transition hover:text-white">
                  {settings.email}
                </a>
              </li>
            )}
            {settings?.phone && <li>{settings.phone}</li>}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">Redes sociais</p>
          <ul className="mt-3 space-y-2 text-sm">
            {settings?.social?.instagram && (
              <li>
                <a
                  href={settings.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  Instagram
                </a>
              </li>
            )}
            {settings?.social?.linkedin && (
              <li>
                <a
                  href={settings.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  LinkedIn
                </a>
              </li>
            )}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 py-4">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-white/40 sm:flex-row">
          <p>
            © {year} {settings?.siteName || 'Valorizarte'}. Todos os direitos reservados.
          </p>
          <Link href="/politicas-de-privacidade" className="transition hover:text-white/70">
            Políticas de Privacidade
          </Link>
        </Container>
      </div>
    </footer>
  )
}
