'use client'
import { Phone, ChevronUp } from 'lucide-react'
import { useState, useEffect, type ReactNode } from 'react'

interface Props { phone: string; zalo: string; messenger: string }

interface Btn {
  href: string; label: string; title: string
  bg: string; shadow: string; ping: string
  icon: ReactNode; external: boolean
}

const ZaloIcon = () => (
  <svg viewBox="0 0 60 60" width="26" height="26" fill="none">
    <path d="M30 7C19.5 7 11 14.6 11 24c0 5.3 2.7 10 7 13.2l-.9 6.3 6.3-3.4c2 .6 4.2.9 6.6.9 10.5 0 19-7.6 19-17S40.5 7 30 7z" fill="white"/>
    <path d="M19 19.5h8.5L19 28h9" stroke="#0068FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M31.5 22.5a2 2 0 012-2H35v7h-1.5a2 2 0 01-2-2v-3z" stroke="#0068FF" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <path d="M37.5 18v11.5" stroke="#0068FF" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="41.5" cy="25.5" r="3" stroke="#0068FF" strokeWidth="1.8" fill="none"/>
  </svg>
)

const MessengerIcon = () => (
  <svg viewBox="0 0 36 36" width="24" height="24" fill="none">
    <path d="M18 2C9.16 2 2 8.7 2 17c0 4.7 2.2 8.9 5.7 11.8V34l5.3-2.9c1.6.4 3.3.6 5 .6 8.84 0 16-6.7 16-15S26.84 2 18 2z" fill="white"/>
    <path d="M8 21l5.8-6.2 3.7 3.9 5.2-3.9 5.3 6.2-5.7-6.3-3.7 4-3.8-4L8 21z" fill="#c51c23"/>
  </svg>
)

export default function FloatingContact({ phone, zalo, messenger }: Props) {
  const [showScroll, setShowScroll] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const buttons = ([
    phone ? {
      href: `tel:${phone.replace(/\s/g, '')}`,
      label: phone, title: 'Gọi điện',
      bg: 'linear-gradient(135deg,#2c2a7c 0%,#0c3263 100%)', shadow: 'rgba(44,42,124,0.28)', ping: '#2c2a7c',
      icon: <Phone size={20} color="white" strokeWidth={2.5} />,
      external: false,
    } : null,
    messenger ? {
      href: messenger,
      label: 'Messenger', title: 'Messenger',
      bg: 'linear-gradient(135deg,#c51c23 0%,#94151a 100%)', shadow: 'rgba(197,28,35,0.3)', ping: '#c51c23',
      icon: <MessengerIcon />,
      external: true,
    } : null,
    zalo ? {
      href: `https://zalo.me/${zalo}`,
      label: 'Chat Zalo', title: 'Zalo',
      bg: '#0068FF', shadow: 'rgba(0,104,255,0.35)', ping: '#0068FF',
      icon: <ZaloIcon />,
      external: true,
    } : null,
  ] as (Btn | null)[]).filter((b): b is Btn => b !== null)

  if (!buttons.length) return null

  return (
    <div className="fixed bottom-6 right-4 z-40 hidden md:flex flex-col items-center gap-2.5">

      {/* Scroll to top — chỉ desktop */}
      {showScroll && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Lên đầu trang"
          className="focus-ring group relative hidden md:flex w-10 h-10 rounded-full items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg,#303030 0%,#181818 100%)' }}>
          <ChevronUp size={18} color="white" />
          <span className="absolute right-12 bg-gray-900 text-white text-xs font-medium px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Lên đầu
            <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent" style={{ borderLeftColor: '#111827' }} />
          </span>
        </button>
      )}

      {/* 3 nút liên hệ: nhỏ hơn trên mobile (44px), bình thường trên desktop (52px) */}
      {buttons.map(({ href, label, title, bg, shadow, ping, icon, external }) => (
        <a key={title} href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          title={title}
          className="focus-ring group relative flex items-center justify-center rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 w-11 h-11 md:w-[52px] md:h-[52px]"
          style={{ background: bg, boxShadow: `0 4px 16px ${shadow}` }}>

          <span className="absolute inset-0 rounded-full animate-ping opacity-[0.18]"
            style={{ background: ping }} />

          {icon}

          {/* Tooltip — chỉ desktop */}
          <span className="absolute right-[56px] hidden md:block bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
            {label}
            <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent"
              style={{ borderLeftColor: '#111827' }} />
          </span>
        </a>
      ))}
    </div>
  )
}
