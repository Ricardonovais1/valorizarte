import type { Metadata } from 'next'
import Image from 'next/image'
import { Container } from '@/components/Container'
import { FacebookIcon, InstagramIcon, LinkedinIcon } from '@/components/SocialIcons'
import { getSiteSettings, getUsefulLinks } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Links Importantes',
  description: 'Podcast, redes sociais, newsletter e os demais canais de Gilvan Silva e da Valorizarte.',
}

export default async function LinksUteisPage() {
  const [links, settings] = await Promise.all([getUsefulLinks(), getSiteSettings()])

  const socialLinks = [
    settings.social?.linkedin && { href: settings.social.linkedin, Icon: LinkedinIcon, label: 'LinkedIn' },
    settings.social?.instagram && { href: settings.social.instagram, Icon: InstagramIcon, label: 'Instagram' },
    settings.social?.facebook && { href: settings.social.facebook, Icon: FacebookIcon, label: 'Facebook' },
  ].filter(Boolean) as { href: string; Icon: typeof FacebookIcon; label: string }[]

  return (
    <div className="bg-navy py-16">
      <Container className="max-w-sm">
        <div className="rounded-[3px] bg-gold px-8 py-10 text-center text-white">
          <Image
            src="/images/links-uteis-avatar.jpg"
            alt="Gilvan Silva"
            width={112}
            height={112}
            className="mx-auto h-28 w-28 rounded-full object-cover ring-4 ring-white/40"
          />
          <h1 className="mt-5 text-2xl font-bold">{settings.siteName}</h1>
          <p className="mt-1 text-white/90">Gilvan Silva</p>
          <p className="mt-4 text-sm leading-relaxed text-white/90">
            Acesse meus links para receber conteúdos, aprender e se desenvolver ao seu potencial máximo!
          </p>

          {links.length > 0 && (
            <ul className="mt-8 divide-y divide-white/30 border-t border-white/30">
              {links.map((link) => (
                <li key={link._id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-3.5 font-semibold transition hover:text-navy"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {socialLinks.length > 0 && (
            <div className="mt-8 flex justify-center gap-4">
              {socialLinks.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
