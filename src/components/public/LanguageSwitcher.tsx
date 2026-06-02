'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const LOCALES = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English',    flag: '🇬🇧' },
]

export default function LanguageSwitcher() {
  const locale   = useLocale()
  const router   = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = LOCALES.find(l => l.code === locale) ?? LOCALES[0]

  function switchLocale(code: string) {
    router.replace(pathname, { locale: code })
    setOpen(false)
  }

  // đóng khi click ra ngoài
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="focus-ring flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition hover:bg-white/10 text-sky-200 hover:text-white"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-40 rounded-lg overflow-hidden shadow-2xl border z-50"
          style={{ background: '#0d2d4e', borderColor: 'rgba(11,173,232,0.2)' }}>
          {LOCALES.map(loc => (
            <button
              key={loc.code}
              onClick={() => switchLocale(loc.code)}
              className="focus-ring w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition text-left"
              style={
                loc.code === locale
                  ? { background: '#0BADE8', color: 'white' }
                  : { color: '#a8cfe0' }
              }
              onMouseEnter={e => { if (loc.code !== locale) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { if (loc.code !== locale) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <span className="text-base leading-none">{loc.flag}</span>
              <span className="font-medium">{loc.label}</span>
              {loc.code === locale && <span className="ml-auto text-xs opacity-80">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
