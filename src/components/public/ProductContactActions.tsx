'use client'

import { MessageCircle, Phone, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { SalesContact } from '@/types'

interface Props {
  contacts: SalesContact[]
  color?: string
}

type Mode = 'phone' | 'zalo' | null

function cleanPhone(phone: string) {
  return phone.replace(/[^\d+]/g, '')
}

function cleanZalo(zalo: string) {
  return zalo.replace(/\D/g, '')
}

export default function ProductContactActions({ contacts, color = '#2c2a7c' }: Props) {
  const [mode, setMode] = useState<Mode>(null)
  const ref = useRef<HTMLDivElement>(null)
  const phoneContacts = contacts.filter(c => cleanPhone(c.phone))
  const zaloContacts = contacts.filter(c => cleanZalo(c.zalo))
  const activeContacts = mode === 'zalo' ? zaloContacts : phoneContacts

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setMode(null)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  if (!phoneContacts.length && !zaloContacts.length) return null

  return (
    <div ref={ref} className="relative">
      <div className={`grid gap-2 ${phoneContacts.length && zaloContacts.length ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {phoneContacts.length > 0 && (
          <button
            type="button"
            onClick={() => setMode(mode === 'phone' ? null : 'phone')}
            className="focus-ring interactive-lift flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-sm transition"
            style={{ background: color }}
          >
            <Phone size={14}/> Gọi tư vấn
          </button>
        )}
        {zaloContacts.length > 0 && (
          <button
            type="button"
            onClick={() => setMode(mode === 'zalo' ? null : 'zalo')}
            className="focus-ring interactive-lift flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-sm transition"
            style={{ background: '#0068ff' }}
          >
            <MessageCircle size={14}/> Zalo
          </button>
        )}
      </div>

      {mode && (
        <div
          className="mt-2 overflow-hidden rounded-xl border bg-white shadow-xl"
          style={{ borderColor: '#e5e8ea' }}
        >
          <div className="flex items-center justify-between gap-3 border-b px-3 py-2.5" style={{ borderColor: '#f1f5f9' }}>
            <div>
              <p className="text-sm font-extrabold" style={{ color: '#1a1a2e' }}>
                {mode === 'zalo' ? 'Chọn nhân viên Zalo' : 'Chọn nhân viên để gọi'}
              </p>
              <p className="text-xs text-slate-500">Không dồn liên hệ vào một người</p>
            </div>
            <button
              type="button"
              aria-label="Đóng chọn liên hệ"
              onClick={() => setMode(null)}
              className="focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={15}/>
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
            {activeContacts.map(contact => {
              const href = mode === 'zalo'
                ? `https://zalo.me/${cleanZalo(contact.zalo)}`
                : `tel:${cleanPhone(contact.phone)}`

              return (
                <a
                  key={contact.id}
                  href={href}
                  target={mode === 'zalo' ? '_blank' : undefined}
                  rel={mode === 'zalo' ? 'noopener noreferrer' : undefined}
                  onClick={() => setMode(null)}
                  className="focus-ring flex items-center justify-between gap-3 px-3 py-3 transition hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold" style={{ color: '#303030' }}>{contact.name}</p>
                    <p className="truncate text-xs text-slate-500">{contact.role || 'Kinh doanh & Tư vấn'}</p>
                  </div>
                  <span
                    className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-extrabold text-white"
                    style={{ background: mode === 'zalo' ? '#0068ff' : '#169447' }}
                  >
                    {mode === 'zalo' ? 'Zalo' : contact.phone}
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
