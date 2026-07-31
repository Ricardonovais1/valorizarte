'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Container } from './Container'
import { MobileMenu } from './MobileMenu'
import { FacebookIcon, InstagramIcon, LinkedinIcon } from './SocialIcons'

export type NavChild = { label: string; href: string }
export type NavItem = { label: string; href: string; children?: NavChild[] }

type Social = { instagram?: string; linkedin?: string; facebook?: string }

export function HeaderBar({
  items,
  siteName,
  social,
}: {
  items: NavItem[]
  siteName: string
  social?: Social
}) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const socialLinks = [
    social?.facebook && { href: social.facebook, Icon: FacebookIcon, label: 'Facebook' },
    social?.instagram && { href: social.instagram, Icon: InstagramIcon, label: 'Instagram' },
    social?.linkedin && { href: social.linkedin, Icon: LinkedinIcon, label: 'LinkedIn' },
  ].filter(Boolean) as { href: string; Icon: typeof FacebookIcon; label: string }[]

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/95 backdrop-blur">
      <Container
        className={`flex items-center justify-between transition-[height] duration-300 ${
          scrolled ? 'h-14' : 'h-20'
        }`}
      >
        <Link href="/" className="relative flex items-center" aria-label={siteName}>
          <AnimatePresence mode="wait" initial={false}>
            {scrolled ? (
              <motion.span
                key="icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Image src="/images/logo-gold-icon.png" alt={siteName} width={50} height={32} priority />
              </motion.span>
            ) : (
              <motion.span
                key="full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Image src="/images/logo-navy.png" alt={siteName} width={164} height={45} priority />
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {items.map((item) => (
            <div key={item.label} className="group relative">
              <Link
                href={item.href}
                className="relative py-2 text-sm font-medium text-navy transition after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:bg-navy after:transition-all after:duration-200 hover:after:w-full"
              >
                {item.label}
              </Link>
              {item.children && item.children.length > 0 && (
                <div className="invisible absolute left-0 top-full z-20 min-w-64 -translate-y-1 rounded-sm bg-navy py-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-5 py-2.5 text-sm text-white/90 transition hover:bg-white/5 hover:text-teal"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {socialLinks.map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-teal/15 text-teal transition hover:bg-teal hover:text-white"
            >
              <Icon size={16} />
            </a>
          ))}
          <Link
            href="/#newsletter"
            className="inline-block rounded-[5px] bg-gold px-8 py-2.5 text-sm font-medium text-white transition hover:brightness-95"
          >
            Fale conosco
          </Link>
        </div>

        <MobileMenu items={items} />
      </Container>
    </header>
  )
}
