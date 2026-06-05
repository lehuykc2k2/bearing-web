import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import FloatingContact from '@/components/public/FloatingContact'
import { getSettings, getSalesContacts } from '@/lib/settings'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, contacts] = await Promise.all([getSettings(), getSalesContacts()])
  return (
    <>
      <Header shopName={settings.shop_name} phone={contacts[0]?.phone ?? settings.phone} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} contacts={contacts} />
      <FloatingContact contacts={contacts} />
    </>
  )
}
