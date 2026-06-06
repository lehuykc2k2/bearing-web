'use client'

import { ChevronUp, Phone, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { SalesContact } from '@/types'

interface Props { contacts: SalesContact[] }
type ContactMode = 'phone' | 'zalo' | null

function cleanPhone(phone: string) {
  return phone.replace(/[^\d+]/g, '')
}

function cleanZalo(zalo: string) {
  return zalo.replace(/\D/g, '')
}

function ZaloIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} fill="none">
      <path d="M30 7C19.5 7 11 14.6 11 24c0 5.3 2.7 10 7 13.2l-.9 6.3 6.3-3.4c2 .6 4.2.9 6.6.9 10.5 0 19-7.6 19-17S40.5 7 30 7z" fill="white"/>
      <path d="M19 19.5h8.5L19 28h9" stroke="#0068FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M31.5 22.5a2 2 0 012-2H35v7h-1.5a2 2 0 01-2-2v-3z" stroke="#0068FF" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M37.5 18v11.5" stroke="#0068FF" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="41.5" cy="25.5" r="3" stroke="#0068FF" strokeWidth="1.8" fill="none"/>
    </svg>
  )
}

export default function FloatingContact({ contacts }: Props) {
  const [mode, setMode] = useState<ContactMode>(null)
  const [showScroll, setShowScroll] = useState(false)
  const [footerVisible, setFooterVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const phoneContacts = contacts.filter(c => cleanPhone(c.phone))
  const zaloContacts = contacts.filter(c => cleanZalo(c.zalo))
  const activeContacts = mode === 'zalo' ? zaloContacts : phoneContacts

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return
    const update = () => setFooterVisible(footer.getBoundingClientRect().top < window.innerHeight - 24)
    update()
    const t = window.setTimeout(update, 300)
    window.addEventListener('scroll', update)
    window.addEventListener('resize', update)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setMode(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!phoneContacts.length && !zaloContacts.length) return null

  return (
    <div
      ref={ref}
      className={`fixed ${footerVisible ? 'bottom-56' : 'bottom-6'} right-4 z-40 hidden md:flex flex-col items-end gap-2.5 transition-[bottom] duration-200`}
    >
      {showScroll && (
        <button
          type="button"
          aria-label="Lên đầu trang"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="focus-ring group relative flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
          style={{ background: 'linear-gradient(135deg,#303030,#181818)' }}>
          <ChevronUp size={18} color="white"/>
        </button>
      )}

      {mode && (
        <div className="w-72 overflow-hidden rounded-2xl border bg-white shadow-2xl"
          style={{ borderColor: '#e5e8ea' }}>
          <div className="flex items-center justify-between border-b px-4 py-3"
            style={{ borderColor: '#f1f5f9', background: '#f8fafc' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748b' }}>
              {mode === 'zalo' ? 'Chọn nhân viên Zalo' : 'Chọn nhân viên tư vấn'}
            </span>
            <button
              type="button"
              aria-label="Đóng liên hệ"
              onClick={() => setMode(null)}
              className="text-slate-400 transition hover:text-slate-600">
              <X size={14}/>
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y" style={{ borderColor: '#f1f5f9' }}>
            {activeContacts.map(contact => {
              const phone = cleanPhone(contact.phone)
              const zalo = cleanZalo(contact.zalo)
              const href = mode === 'zalo' ? `https://zalo.me/${zalo}` : `tel:${phone}`

              return (
                <a
                  key={contact.id}
                  href={href}
                  target={mode === 'zalo' ? '_blank' : undefined}
                  rel={mode === 'zalo' ? 'noopener noreferrer' : undefined}
                  onClick={() => setMode(null)}
                  className="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{ background: mode === 'zalo' ? '#0068FF' : '#2c2a7c' }}>
                    {mode === 'zalo' ? <ZaloIcon size={18}/> : <Phone size={14} color="white"/>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold leading-tight" style={{ color: '#1a1a2e' }}>{contact.name}</p>
                    <p className="truncate text-xs" style={{ color: '#64748b' }}>
                      {mode === 'zalo' ? `Zalo: ${contact.zalo}` : contact.phone}
                    </p>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      )}

      {zaloContacts.length > 0 && (
        <button
          type="button"
          aria-label="Chọn nhân viên Zalo"
          aria-expanded={mode === 'zalo'}
          onClick={() => setMode(mode === 'zalo' ? null : 'zalo')}
          className="focus-ring group relative flex h-[52px] w-[52px] items-center justify-center rounded-full shadow-xl transition-all hover:scale-110 active:scale-95"
          style={{ background: mode === 'zalo' ? '#c51c23' : '#0068FF', boxShadow: '0 4px 16px rgba(0,104,255,0.35)' }}>
          <span className="absolute inset-0 rounded-full animate-ping opacity-[0.15]" style={{ background: '#0068FF' }}/>
          {mode === 'zalo' ? <X size={20} color="white"/> : <ZaloIcon/>}
          {mode !== 'zalo' && (
            <span className="pointer-events-none absolute right-[60px] whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
              Chọn Zalo
              <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent" style={{ borderLeftColor: '#111827' }}/>
            </span>
          )}
        </button>
      )}

      {phoneContacts.length > 0 && (
        <button
          type="button"
          aria-label="Chọn nhân viên tư vấn"
          aria-expanded={mode === 'phone'}
          onClick={() => setMode(mode === 'phone' ? null : 'phone')}
          className="focus-ring group relative flex h-[52px] w-[52px] items-center justify-center rounded-full shadow-xl transition-all hover:scale-110 active:scale-95"
          style={{ background: mode === 'phone' ? '#c51c23' : 'linear-gradient(135deg,#2c2a7c,#0c3263)', boxShadow: '0 4px 16px rgba(44,42,124,0.3)' }}>
          <span className="absolute inset-0 rounded-full animate-ping opacity-[0.15]" style={{ background: '#2c2a7c' }}/>
          {mode === 'phone' ? <X size={20} color="white"/> : <Phone size={20} color="white"/>}
          {mode !== 'phone' && (
            <span className="pointer-events-none absolute right-[60px] whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
              Gọi tư vấn
              <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent" style={{ borderLeftColor: '#111827' }}/>
            </span>
          )}
        </button>
      )}
    </div>
  )
}
