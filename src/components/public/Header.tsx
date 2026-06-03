'use client'
import { usePathname } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { useState } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'
import BrandLogo from '@/components/BrandLogo'

interface Props { shopName: string; phone: string }

export default function Header({ shopName, phone }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const t = useTranslations('nav')
  const th = useTranslations('header')

  const links = [
    { href: '/' as const,         label: t('home') },
    { href: '/products' as const, label: t('products') },
    { href: '/about' as const,    label: t('about') },
    { href: '/contact' as const,  label: t('contact') },
  ]

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.96)', borderColor: '#e5e8ea' }}>
      {phone && (
        <div className="flex items-center justify-center gap-1.5 text-white text-xs text-center py-1.5 font-medium" style={{ background: 'linear-gradient(90deg,#2c2a7c 0%,#0c3263 58%,#c51c23 100%)' }}>
          <Phone size={12} strokeWidth={2.6}/> {th('hotline')}:{' '}
          <a href={`tel:${phone.replace(/\s/g,'')}`} className="font-bold underline underline-offset-2 hover:text-white/80">
            {phone}
          </a>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" aria-label={shopName} className="focus-ring rounded-lg">
            <BrandLogo variant="dark" size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ href, label }) => {
              const active = pathname === href
              return (
                <Link key={href} href={href}
                  className={`focus-ring px-4 py-2 rounded-lg text-sm font-medium transition ${
                    active ? 'text-[#2c2a7c] bg-[#eef1f3]' : 'text-[#303030] hover:text-[#2c2a7c] hover:bg-[#f7fafc]'
                  }`}>
                  {label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            {phone && (
              <a href={`tel:${phone.replace(/\s/g,'')}`}
                className="focus-ring interactive-lift flex items-center gap-2 font-bold px-4 py-2 rounded-lg text-sm text-white"
                style={{ background: 'linear-gradient(135deg,#c51c23 0%,#94151a 100%)' }}>
                <Phone size={15}/> {phone}
              </a>
            )}
          </div>

          <button aria-label="Toggle menu" className="focus-ring md:hidden p-2 rounded-lg hover:bg-[#f7fafc]" style={{ color: '#2c2a7c' }} onClick={() => setOpen(!open)}>
            {open ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t" style={{ background: 'rgba(255,255,255,0.98)', borderColor: '#e5e8ea' }}>
          <div className="px-4 py-3 space-y-1">
            {links.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className="focus-ring block px-4 py-2.5 rounded-lg text-sm text-[#303030] hover:bg-[#f7fafc] hover:text-[#2c2a7c] transition">
                {label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-2 border-t mt-2" style={{ borderColor: '#e5e8ea' }}>
              <LanguageSwitcher />
              {phone && (
                <a href={`tel:${phone.replace(/\s/g,'')}`}
                  className="focus-ring flex items-center gap-2 text-white font-bold px-4 py-2 rounded-lg text-sm"
                  style={{ background: 'linear-gradient(135deg,#c51c23 0%,#94151a 100%)' }}>
                  <Phone size={15}/> {phone}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
