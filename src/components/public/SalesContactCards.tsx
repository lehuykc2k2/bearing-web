import { MessageCircle, Phone, UserRound } from 'lucide-react'
import type { SalesContact } from '@/types'

interface Props {
  contacts: SalesContact[]
}

function cleanPhone(phone: string) {
  return phone.replace(/[^\d+]/g, '')
}

function cleanZalo(zalo: string) {
  return zalo.replace(/\D/g, '')
}

export default function SalesContactCards({ contacts }: Props) {
  if (!contacts.length) return null

  return (
    <div className="grid grid-cols-1 gap-3">
      {contacts.map(contact => {
        const phone = cleanPhone(contact.phone)
        const zalo = cleanZalo(contact.zalo)

        return (
          <article
            key={contact.id}
            className="rounded-lg border bg-white p-3.5 shadow-sm"
            style={{ borderColor: '#e5e8ea' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: 'linear-gradient(135deg,#d8fbf4 0%,#6ee7d8 48%,#0f766e 100%)',
                  color: '#0f4f4a',
                }}
              >
                <UserRound size={34} strokeWidth={1.8} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-xl font-extrabold leading-tight" style={{ color: '#303030' }}>
                  {contact.name}
                </h3>
                <p className="truncate text-sm" style={{ color: '#565b61' }}>
                  {contact.role || 'Kinh doanh & Tư vấn'}
                </p>
              </div>
            </div>

            <div className={`mt-3 grid gap-2 ${zalo ? 'grid-cols-[minmax(0,1fr)_96px]' : 'grid-cols-1'}`}>
              <a
                href={`tel:${phone}`}
                className="focus-ring flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-md px-2.5 text-sm font-extrabold text-white"
                style={{ background: '#169447' }}
              >
                <Phone size={16} strokeWidth={2.6} />
                <span className="whitespace-nowrap">{contact.phone}</span>
              </a>
              {zalo && (
                <a
                  href={`https://zalo.me/${zalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring flex min-h-10 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-extrabold text-white"
                  style={{ background: '#16bfe3' }}
                >
                  <MessageCircle size={16} strokeWidth={2.6} />
                  <span>Zalo</span>
                </a>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}
