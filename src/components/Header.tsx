import { getNavigation, getSiteSettings } from '@/lib/data'
import { HeaderBar, type NavItem } from './HeaderBar'

export async function Header() {
  const [navigation, settings] = await Promise.all([getNavigation(), getSiteSettings()])
  const items = navigation as NavItem[]

  return <HeaderBar items={items} siteName={settings?.siteName || 'Valorizarte'} social={settings?.social} />
}
