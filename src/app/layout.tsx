import type { Metadata } from 'next'
import { Nunito, Roboto } from 'next/font/google'
import { MotionConfig } from 'motion/react'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { NewsletterPopup } from '@/components/NewsletterPopup'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { getSiteSettings } from '@/lib/data'

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
})

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const title = settings?.siteName || 'Valorizarte'
  const description = settings?.defaultSeo?.description || settings?.tagline || ''

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://valorizarte.com.br'),
  }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} ${roboto.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <MotionConfig reducedMotion="user">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <NewsletterPopup />
          <WhatsAppButton />
        </MotionConfig>
      </body>
    </html>
  )
}
