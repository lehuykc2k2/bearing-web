import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import FloatingContact from '@/components/public/FloatingContact'
import { getSettings } from '@/lib/settings'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  return (
    <>
      <Header shopName={settings.shop_name} phone={settings.phone} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <FloatingContact
        phone={settings.phone}
        zalo={settings.zalo}
        messenger={settings.messenger}
      />
    </>
  )
}
