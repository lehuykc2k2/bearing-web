'use client'
import { Phone, MessageCircle, X, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { SalesContact } from '@/types'

interface Props { contacts: SalesContact[] }

export default function StickyCTA({ contacts }: Props) {
  const [open, setOpen] = useState(false)
  if (!contacts.length) return null

  const firstZalo = contacts.find(c => c.zalo)?.zalo

  return (
    <>
      {/* Panel chọn sale — trượt lên từ dưới */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setOpen(false)}/>
          <div className="fixed bottom-[57px] left-0 right-0 z-50 md:hidden bg-white rounded-t-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#f1f5f9' }}>
              <div className="flex items-center gap-2">
                <ChevronUp size={14} className="text-slate-400"/>
                <span className="text-sm font-bold" style={{ color: '#1a1a2e' }}>Chọn nhân viên tư vấn</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-400 p-1">
                <X size={16}/>
              </button>
            </div>
            <div className="divide-y" style={{ borderColor: '#f1f5f9' }}>
              {contacts.map(c => (
                <a key={c.id}
                  href={`tel:${c.phone.replace(/\s/g, '')}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-4 active:bg-slate-50">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: '#2c2a7c' }}>
                    <Phone size={16} color="white"/>
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#1a1a2e' }}>{c.name}</p>
                    <p className="text-sm" style={{ color: '#2c2a7c' }}>{c.phone}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Thanh CTA cố định */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
        style={{ background: 'rgba(255,255,255,0.97)', borderTop: '1px solid #e5e8ea', backdropFilter: 'blur(12px)' }}>
        <div className="flex">
          <button
            onClick={() => setOpen(v => !v)}
            className="focus-ring flex-1 flex items-center justify-center gap-2 py-3.5 text-white font-bold text-sm transition"
            style={{ background: open ? '#c51c23' : 'linear-gradient(135deg,#2c2a7c 0%,#0c3263 100%)' }}>
            <Phone size={17} strokeWidth={2.5}/>
            <span>Gọi tư vấn</span>
          </button>
          {firstZalo && (
            <a href={`https://zalo.me/${firstZalo}`} target="_blank" rel="noopener noreferrer"
              className="focus-ring flex-1 flex items-center justify-center gap-2 py-3.5 text-white font-bold text-sm transition"
              style={{ background: '#0068ff' }}>
              <MessageCircle size={17} strokeWidth={2.5}/>
              <span>Zalo</span>
            </a>
          )}
        </div>
      </div>
    </>
  )
}
