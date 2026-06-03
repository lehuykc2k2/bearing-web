import { Phone, MapPin, MessageCircle, Clock, ChevronRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import type { Settings } from '@/types'
import BrandLogo from '@/components/BrandLogo'

export default async function Footer({ settings }: { settings: Settings }) {
  const t = await getTranslations('footer')
  const tn = await getTranslations('nav')

  return (
    <footer id="contact" className="mt-auto border-t" style={{ background: 'linear-gradient(180deg,#ffffff 0%,#f7fafc 100%)', color: '#565b61', borderColor: '#e5e8ea' }}>
      {/* CTA strip */}
      <div style={{ background: 'linear-gradient(90deg,#2c2a7c 0%,#0c3263 58%,#c51c23 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-lg">{t('ctaTitle')}</p>
            <p className="text-white/80 text-sm">{t('ctaSub')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {settings.phone && (
              <a href={`tel:${settings.phone.replace(/\s/g,'')}`}
                className="focus-ring interactive-lift font-bold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 text-white"
                style={{ background: 'rgba(255,255,255,0.16)' }}>
                <Phone size={15}/> {settings.phone}
              </a>
            )}
            {settings.zalo && (
              <a href={`https://zalo.me/${settings.zalo}`} target="_blank" rel="noopener noreferrer"
                className="focus-ring border-2 border-white text-white font-bold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 hover:bg-white/10 transition">
                <MessageCircle size={15}/> {t('zaloNow')}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="mb-3">
            <BrandLogo variant="dark" size="md" />
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#565b61' }}>{settings.slogan}</p>
          <p className="text-xs mt-3 italic" style={{ color: '#767778' }}>
            MORE STABLE – MORE EFFICIENT – MORE AT EASE
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: '#303030' }}>{t('linksTitle')}</h4>
          <ul className="space-y-2 text-sm">
            {[
              { href: '/' as const,         label: tn('home') },
              { href: '/products' as const, label: tn('products') },
              { href: '/#contact' as const, label: tn('contact') },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="focus-ring flex items-center gap-1.5 rounded transition hover:text-[#2c2a7c]" style={{ color: '#565b61' }}>
                  <ChevronRight size={13} style={{ color: '#2c2a7c' }}/>{label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: '#303030' }}>{t('contactTitle')}</h4>
          <ul className="space-y-3 text-sm">
            {settings.phone && (
              <li className="flex items-center gap-2.5">
                <Phone size={14} style={{ color: '#2c2a7c' }} className="shrink-0"/>
                <a href={`tel:${settings.phone.replace(/\s/g,'')}`}
                  className="focus-ring rounded transition hover:text-[#2c2a7c]" style={{ color: '#565b61' }}>
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.zalo && (
              <li className="flex items-center gap-2.5">
                <MessageCircle size={14} className="shrink-0" style={{ color: '#c51c23' }}/>
                <a href={`https://zalo.me/${settings.zalo}`} target="_blank" rel="noopener noreferrer"
                  className="focus-ring rounded transition hover:text-[#2c2a7c]" style={{ color: '#565b61' }}>
                  Zalo: {settings.zalo}
                </a>
              </li>
            )}
            {settings.address && (
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="shrink-0 mt-0.5" style={{ color: '#c51c23' }}/>
                <span style={{ color: '#565b61' }}>{settings.address}</span>
              </li>
            )}
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: '#303030' }}>{t('hoursTitle')}</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <Clock size={14} className="shrink-0 mt-0.5" style={{ color: '#2c2a7c' }}/>
              <div style={{ color: '#565b61' }}>
                <p>{t('weekdays')}</p>
                <p className="font-semibold" style={{ color: '#303030' }}>{t('weekdaysHours')}</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock size={14} className="shrink-0 mt-0.5" style={{ color: '#2c2a7c' }}/>
              <div style={{ color: '#565b61' }}>
                <p>{t('sunday')}</p>
                <p className="font-semibold" style={{ color: '#303030' }}>{t('sundayHours')}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t text-center py-5 text-xs" style={{ borderColor: '#e5e8ea', color: '#767778' }}>
        © {new Date().getFullYear()}{' '}
        <span style={{ color: '#2c2a7c' }}>D<span style={{ color: '#c51c23' }}>&amp;</span>X Bearings</span>.
        {' '}{t('rights')}
      </div>
    </footer>
  )
}
