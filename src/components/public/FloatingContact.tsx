'use client'
import { ChevronUp, X, Phone } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import type { SalesContact } from '@/types'

interface Props { contacts: SalesContact[] }

const ZaloIcon = () => (
  <svg viewBox="0 0 60 60" width="22" height="22" fill="none">
    <path d="M30 7C19.5 7 11 14.6 11 24c0 5.3 2.7 10 7 13.2l-.9 6.3 6.3-3.4c2 .6 4.2.9 6.6.9 10.5 0 19-7.6 19-17S40.5 7 30 7z" fill="white"/>
    <path d="M19 19.5h8.5L19 28h9" stroke="#0068FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M31.5 22.5a2 2 0 012-2H35v7h-1.5a2 2 0 01-2-2v-3z" stroke="#0068FF" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <path d="M37.5 18v11.5" stroke="#0068FF" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="41.5" cy="25.5" r="3" stroke="#0068FF" strokeWidth="1.8" fill="none"/>
  </svg>
)

export default function FloatingContact({ contacts }: Props) {
  const [open, setOpen] = useState(false)
  const [showScroll, setShowScroll] = useState(false)
  const [footerVisible, setFooterVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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
    return () => { window.clearTimeout(t); window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const firstZalo = contacts.find(c => c.zalo)?.zalo

  if (!contacts.length) return null

  return (
    <div
      ref={ref}
      className={`fixed ${footerVisible ? 'bottom-56' : 'bottom-6'} right-4 z-40 hidden md:flex flex-col items-end gap-2.5 transition-[bottom] duration-200`}
    >
      {/* Scroll to top */}
      {showScroll && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="focus-ring group relative flex w-10 h-10 rounded-full items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg,#303030,#181818)' }}>
          <ChevronUp size={18} color="white"/>
        </button>
      )}

      {/* Popup danh sách sale */}
      {open && (
        <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden w-64"
          style={{ borderColor: '#e5e8ea' }}>
          <div className="px-4 py-3 flex items-center justify-between border-b"
            style={{ borderColor: '#f1f5f9', background: '#f8fafc' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#64748b' }}>
              Chọn nhân viên tư vấn
            </span>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
              <X size={14}/>
            </button>
          </div>
          <div className="divide-y" style={{ borderColor: '#f1f5f9' }}>
            {contacts.map(c => (
              <a key={c.id}
                href={`tel:${c.phone.replace(/\s/g, '')}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: '#2c2a7c' }}>
                  <Phone size={13} color="white"/>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold leading-tight" style={{ color: '#1a1a2e' }}>{c.name}</p>
                  <p className="text-xs" style={{ color: '#64748b' }}>{c.phone}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Nút Zalo */}
      {firstZalo && (
        <a href={`https://zalo.me/${firstZalo}`} target="_blank" rel="noopener noreferrer"
          className="focus-ring group relative flex items-center justify-center rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all w-[52px] h-[52px]"
          style={{ background: '#0068FF', boxShadow: '0 4px 16px rgba(0,104,255,0.35)' }}>
          <span className="absolute inset-0 rounded-full animate-ping opacity-[0.15]" style={{ background: '#0068FF' }}/>
          <ZaloIcon/>
          <span className="absolute right-[60px] bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
            Chat Zalo
            <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent" style={{ borderLeftColor: '#111827' }}/>
          </span>
        </a>
      )}

      {/* Nút Phone — toggle popup */}
      <button
        onClick={() => setOpen(v => !v)}
        className="focus-ring group relative flex items-center justify-center rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all w-[52px] h-[52px]"
        style={{ background: open ? '#c51c23' : 'linear-gradient(135deg,#2c2a7c,#0c3263)', boxShadow: '0 4px 16px rgba(44,42,124,0.3)' }}>
        <span className="absolute inset-0 rounded-full animate-ping opacity-[0.15]" style={{ background: '#2c2a7c' }}/>
        {open ? <X size={20} color="white"/> : <Phone size={20} color="white"/>}
        {!open && (
          <span className="absolute right-[60px] bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
            Gọi tư vấn
            <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent" style={{ borderLeftColor: '#111827' }}/>
          </span>
        )}
      </button>
    </div>
  )
}
