import { WhatsAppIcon } from './SocialIcons'

const WHATSAPP_NUMBER = '5531991050060'
const WHATSAPP_MESSAGE = 'Olá, estou no site da Valorizarte'

export function WhatsAppButton() {
  const href = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp"
      className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:brightness-105"
    >
      <WhatsAppIcon size={30} />
    </a>
  )
}
