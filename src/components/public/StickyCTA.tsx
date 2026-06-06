'use client'
import { Phone, MessageCircle, X, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { SalesContact } from '@/types'

interface Props { contacts: SalesContact[] }

function cleanPhone(phone: string) {
  return phone.replace(/[^\d+]/g, '')
}

function cleanZalo(zalo: string) {
  return zalo.replace(/\D/g, '')
}

export default function StickyCTA({ contacts }: Props) {
  const [open, setOpen] = useState(false)
  if (!contacts.length) return null

  const hasZalo = contacts.some(c => Boolean(cleanZalo(c.zalo)))

  return (
    <>
      {/* Panel chọn sale - trượt lên từ dưới */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-950/35 md:hidden" onClick={() => setOpen(false)}/>
          <div
            id="mobile-contact-panel"
            className="fixed inset-x-3 z-50 md:hidden overflow-hidden rounded-2xl bg-white shadow-2xl"
            style={{
              bottom: 'calc(4.75rem + env(safe-area-inset-bottom))',
              maxHeight: 'min(58vh, 420px)',
            }}
          >
            <div className="flex items-center justify-between gap-3 border-b px-4 py-3" style={{ borderColor: '#f1f5f9' }}>
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: '#eef1f3', color: '#2c2a7c' }}>
                  <ChevronUp size={15}/>
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold leading-tight" style={{ color: '#1a1a2e' }}>Chọn nhân viên tư vấn</p>
                  <p className="text-xs leading-snug text-slate-500">Chọn người phụ trách để gọi hoặc Zalo</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Đóng liên hệ"
                onClick={() => setOpen(false)}
                className="focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={16}/>
              </button>
            </div>
            <div className="max-h-[calc(min(58vh,420px)-4.25rem)] overflow-y-auto divide-y divide-slate-100">
              {contacts.map(c => {
                const phone = cleanPhone(c.phone)
                const zalo = cleanZalo(c.zalo)

                return (
                  <div key={c.id} className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                        style={{ background: '#2c2a7c' }}>
                        <Phone size={16} color="white"/>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold" style={{ color: '#1a1a2e' }}>{c.name}</p>
                        <p className="truncate text-xs text-slate-500">{c.role || 'Kinh doanh'}</p>
                      </div>
                    </div>

                    <div className={`mt-3 grid gap-2 ${zalo ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      <a
                        href={`tel:${phone}`}
                        onClick={() => setOpen(false)}
                        className="focus-ring flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-extrabold text-white"
                        style={{ background: '#169447' }}
                      >
                        <Phone size={15} strokeWidth={2.6}/>
                        <span className="truncate">{c.phone}</span>
                      </a>
                      {zalo && (
                        <a
                          href={`https://zalo.me/${zalo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setOpen(false)}
                          className="focus-ring flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-extrabold text-white"
                          style={{ background: '#16bfe3' }}
                        >
                          <MessageCircle size={15} strokeWidth={2.6}/>
                          <span>Zalo</span>
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Thanh CTA cố định */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: 'rgba(255,255,255,0.97)',
          borderTop: '1px solid #e5e8ea',
          backdropFilter: 'blur(12px)',
          paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))',
        }}
      >
        <div className={`grid gap-2 px-3 pt-2 ${hasZalo ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-contact-panel"
            onClick={() => setOpen(v => !v)}
            className="focus-ring flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-extrabold text-white shadow-lg transition active:scale-[0.99]"
            style={{ background: open ? '#c51c23' : 'linear-gradient(135deg,#2c2a7c 0%,#0c3263 100%)' }}>
            <Phone size={17} strokeWidth={2.5}/>
            <span>Gọi tư vấn</span>
          </button>
          {hasZalo && (
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-contact-panel"
              onClick={() => setOpen(true)}
              className="focus-ring flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-extrabold text-white shadow-lg transition active:scale-[0.99]"
              style={{ background: '#0068ff' }}
            >
              <MessageCircle size={17} strokeWidth={2.5}/>
              <span>Zalo</span>
            </button>
          )}
        </div>
      </div>
    </>
  )
}
