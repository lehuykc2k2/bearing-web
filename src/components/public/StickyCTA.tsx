'use client'
import { Phone, MessageCircle } from 'lucide-react'

interface Props { phone: string; zalo: string }

export default function StickyCTA({ phone, zalo }: Props) {
  if (!phone && !zalo) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      style={{ background: 'rgba(6,26,48,0.96)', borderTop: '1px solid rgba(11,173,232,0.22)', backdropFilter: 'blur(12px)' }}>
      <div className="flex">
        {phone && (
          <a href={`tel:${phone.replace(/\s/g, '')}`}
            className="focus-ring flex-1 flex items-center justify-center gap-2 py-3.5 text-white font-bold text-sm hover:brightness-105 transition"
            style={{ background: 'linear-gradient(135deg,#0BADE8 0%,#087fb5 100%)' }}>
            <Phone size={18} strokeWidth={2.5}/>
            <span>Gọi ngay</span>
          </a>
        )}
        {zalo && (
          <a href={`https://zalo.me/${zalo}`} target="_blank" rel="noopener noreferrer"
            className="focus-ring flex-1 flex items-center justify-center gap-2 py-3.5 text-white font-bold text-sm hover:brightness-105 transition"
            style={{ background: 'linear-gradient(135deg,#E5197E 0%,#b90f63 100%)' }}>
            <MessageCircle size={18} strokeWidth={2.5}/>
            <span>Zalo tư vấn</span>
          </a>
        )}
      </div>
    </div>
  )
}
