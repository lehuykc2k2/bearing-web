import { Phone, MapPin, MessageCircle, Clock, ChevronRight, FileText, Mail } from 'lucide-react'
import type { ElementType } from 'react'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import type { Settings, SalesContact } from '@/types'
import BrandLogo from '@/components/BrandLogo'

export default async function Footer({ settings, contacts = [] }: { settings: Settings; contacts?: SalesContact[] }) {
  const t = await getTranslations('footer')
  const tn = await getTranslations('nav')
  const companyName = settings.company_name || settings.shop_name
  const companyDescription = settings.company_description || settings.slogan
  const companyInfo = [
    settings.tax_code && { icon: FileText, value: `MST: ${settings.tax_code}` },
    settings.address && { icon: MapPin, value: settings.address },
    settings.phone && { icon: Phone, value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, '')}` },
    settings.email && { icon: Mail, value: settings.email, href: `mailto:${settings.email}` },
    settings.zalo && { icon: MessageCircle, value: `Zalo: ${settings.zalo}`, href: `https://zalo.me/${settings.zalo}` },
    settings.business_hours && { icon: Clock, value: settings.business_hours },
  ].filter(Boolean) as { icon: ElementType; value: string; href?: string }[]

  return (
    <footer
      id="contact"
      className="mt-auto border-t"
      style={{
        background: 'linear-gradient(180deg,#ffffff 0%,#f7fafc 100%)',
        color: '#565b61',
        borderColor: '#e5e8ea',
      }}
    >
      <div style={{ background: 'linear-gradient(90deg,#2c2a7c 0%,#0c3263 58%,#c51c23 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-white font-bold text-lg">{t('ctaTitle')}</p>
            <p className="text-white/80 text-sm">{t('ctaSub')}</p>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end gap-2">
            {(contacts.length > 0 ? contacts : settings.phone ? [{ id: '0', name: settings.phone, phone: settings.phone, zalo: settings.zalo, role: '', sort_order: 0, is_active: true }] : []).map(c => (
              <a key={c.id}
                href={`tel:${c.phone.replace(/\s/g, '')}`}
                className="focus-ring interactive-lift font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 text-white"
                style={{ background: 'rgba(255,255,255,0.16)' }}>
                <Phone size={14}/> {c.name || c.phone}
              </a>
            ))}
            {(contacts[0]?.zalo || settings.zalo) && (
              <a href={`https://zalo.me/${contacts[0]?.zalo || settings.zalo}`}
                target="_blank" rel="noopener noreferrer"
                className="focus-ring border-2 border-white text-white font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 hover:bg-white/10 transition">
                <MessageCircle size={14}/> {t('zaloNow')}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_0.55fr] gap-8 lg:gap-12">
        <div>
          <div className="mb-3">
            <BrandLogo variant="dark" size="md" />
          </div>
          <h3 className="font-extrabold text-base md:text-lg uppercase leading-snug mb-3" style={{ color: '#111827' }}>
            {companyName}
          </h3>
          <p className="text-sm leading-relaxed max-w-md" style={{ color: '#303030' }}>
            {companyDescription}
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: '#303030' }}>
            {t('contactTitle')}
          </h4>
          <ul className="space-y-3 text-sm">
            {companyInfo.map(({ icon: Icon, value, href }) => (
              <li key={value} className="flex items-start gap-3">
                <Icon size={15} className="shrink-0 mt-0.5" style={{ color: '#9aa3af' }} />
                {href ? (
                  <a
                    href={href}
                    className="focus-ring min-w-0 rounded break-words transition hover:text-[#2c2a7c]"
                    style={{ color: '#111827' }}
                  >
                    {value}
                  </a>
                ) : (
                  <span className="min-w-0 break-words" style={{ color: '#111827' }}>
                    {value}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: '#303030' }}>
            {t('linksTitle')}
          </h4>
          <ul className="space-y-2 text-sm">
            {[
              { href: '/' as const, label: tn('home') },
              { href: '/products' as const, label: tn('products') },
              { href: '/contact' as const, label: tn('contact') },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="focus-ring flex items-center gap-1.5 rounded transition hover:text-[#2c2a7c]"
                  style={{ color: '#565b61' }}
                >
                  <ChevronRight size={13} style={{ color: '#2c2a7c' }} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t text-center py-5 text-xs" style={{ borderColor: '#e5e8ea', color: '#767778' }}>
        &copy; {new Date().getFullYear()}{' '}
        <span style={{ color: '#2c2a7c' }}>{settings.shop_name}</span>. {t('rights')}
      </div>
    </footer>
  )
}
