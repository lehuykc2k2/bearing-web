import { Phone, MapPin, MessageCircle, Clock, ChevronRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import type { Settings } from '@/types'

export default async function Footer({ settings }: { settings: Settings }) {
  const t = await getTranslations('footer')
  const tn = await getTranslations('nav')

  return (
    <footer id="contact" className="mt-auto" style={{ background: 'linear-gradient(180deg,#0A2340 0%,#061A30 100%)', color: '#b8d4e8' }}>
      {/* CTA strip */}
      <div style={{ background: 'linear-gradient(90deg,#087fb5 0%,#0BADE8 55%,#E5197E 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-lg">{t('ctaTitle')}</p>
            <p className="text-sky-100 text-sm">{t('ctaSub')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {settings.phone && (
              <a href={`tel:${settings.phone.replace(/\s/g,'')}`}
                className="focus-ring interactive-lift font-bold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 text-white"
                style={{ background: '#061A30' }}>
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
          <div className="flex items-center gap-1 mb-3">
            <span className="font-black text-white text-2xl leading-none">D</span>
            <span className="font-black text-2xl leading-none" style={{ color: '#E5197E' }}>&amp;</span>
            <span className="font-black text-white text-2xl leading-none">X</span>
            <span className="ml-2 text-sky-300 text-sm font-semibold uppercase tracking-wider">Bearings</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#7fb3cc' }}>{settings.slogan}</p>
          <p className="text-xs mt-3 italic" style={{ color: '#5a8fa8' }}>
            MORE STABLE – MORE EFFICIENT – MORE AT EASE
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('linksTitle')}</h4>
          <ul className="space-y-2 text-sm">
            {[
              { href: '/' as const,         label: tn('home') },
              { href: '/products' as const, label: tn('products') },
              { href: '/#contact' as const, label: tn('contact') },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="focus-ring flex items-center gap-1.5 rounded hover:text-white transition" style={{ color: '#7fb3cc' }}>
                  <ChevronRight size={13} style={{ color: '#0BADE8' }}/>{label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('contactTitle')}</h4>
          <ul className="space-y-3 text-sm">
            {settings.phone && (
              <li className="flex items-center gap-2.5">
                <Phone size={14} style={{ color: '#0BADE8' }} className="shrink-0"/>
                <a href={`tel:${settings.phone.replace(/\s/g,'')}`}
                  className="focus-ring rounded hover:text-white transition" style={{ color: '#7fb3cc' }}>
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.zalo && (
              <li className="flex items-center gap-2.5">
                <MessageCircle size={14} className="shrink-0" style={{ color: '#E5197E' }}/>
                <a href={`https://zalo.me/${settings.zalo}`} target="_blank" rel="noopener noreferrer"
                  className="focus-ring rounded hover:text-white transition" style={{ color: '#7fb3cc' }}>
                  Zalo: {settings.zalo}
                </a>
              </li>
            )}
            {settings.address && (
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="shrink-0 mt-0.5" style={{ color: '#E5197E' }}/>
                <span style={{ color: '#7fb3cc' }}>{settings.address}</span>
              </li>
            )}
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('hoursTitle')}</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <Clock size={14} className="shrink-0 mt-0.5" style={{ color: '#0BADE8' }}/>
              <div style={{ color: '#7fb3cc' }}>
                <p>{t('weekdays')}</p>
                <p className="text-white font-semibold">{t('weekdaysHours')}</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock size={14} className="shrink-0 mt-0.5" style={{ color: '#0BADE8' }}/>
              <div style={{ color: '#7fb3cc' }}>
                <p>{t('sunday')}</p>
                <p className="text-white font-semibold">{t('sundayHours')}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t text-center py-5 text-xs" style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#4a7a96' }}>
        © {new Date().getFullYear()}{' '}
        <span style={{ color: '#7fb3cc' }}>D<span style={{ color: '#E5197E' }}>&amp;</span>X Bearings</span>.
        {' '}{t('rights')}
      </div>
    </footer>
  )
}
