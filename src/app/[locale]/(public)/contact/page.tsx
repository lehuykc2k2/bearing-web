import type { Metadata } from 'next'
import Image from 'next/image'
import { getSettings } from '@/lib/settings'
import { Phone, MapPin, Clock, MessageCircle, ExternalLink, Mail, FileText } from 'lucide-react'
import QuoteForm from '@/components/public/QuoteForm'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  return {
    title: `Liên hệ – ${s.shop_name}`,
    description: `Liên hệ ${s.shop_name} để được tư vấn và báo giá vòng bi chính hãng. Hotline: ${s.phone}`,
  }
}

export const revalidate = 60

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; name?: string }>
}) {
  const [settings, params] = await Promise.all([getSettings(), searchParams])
  const productId   = params.product
  const productName = params.name ? decodeURIComponent(params.name) : undefined

  const infoItems = [
    settings.tax_code && {
      icon: FileText,
      label: 'Mã số thuế',
      value: settings.tax_code,
      color: '#64748b',
    },
    settings.phone && {
      icon: Phone,
      label: 'Hotline',
      value: settings.phone,
      href: `tel:${settings.phone.replace(/\s/g, '')}`,
      color: '#2c2a7c',
    },
    settings.email && {
      icon: Mail,
      label: 'Email',
      value: settings.email,
      href: `mailto:${settings.email}`,
      color: '#2c2a7c',
    },
    settings.zalo && {
      icon: MessageCircle,
      label: 'Zalo',
      value: `zalo.me/${settings.zalo}`,
      href: `https://zalo.me/${settings.zalo}`,
      color: '#0068FF',
    },
    settings.address && {
      icon: MapPin,
      label: 'Địa chỉ',
      value: settings.address,
      href: `https://maps.google.com/?q=${encodeURIComponent(settings.address)}`,
      color: '#c51c23',
    },
    settings.facebook && {
      icon: ExternalLink,
      label: 'Facebook',
      value: 'Facebook Page',
      href: settings.facebook,
      color: '#1877F2',
    },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string; href?: string; color: string }[]

  return (
    <div className="public-page-bg">
      {/* Banner */}
      <div className="hero-shell relative overflow-hidden">
        <Image
          src="/hero-bearings-showroom.png"
          alt="Liên hệ D&X Bearings"
          fill priority sizes="100vw"
          className="hero-media object-cover object-center"
        />
        <div className="hero-vignette absolute inset-0" />
        <div className="hero-mesh absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#f7fafc] to-transparent" />
        <div className="soft-enter relative max-w-5xl mx-auto px-5 py-9 md:py-12 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2" style={{ color: '#2c2a7c' }}>
            Hỗ trợ miễn phí
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-1 drop-shadow">Liên hệ & Báo giá</h1>
          <p className="text-sm" style={{ color: '#565b61' }}>Phản hồi trong 5 phút trong giờ làm việc</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.12fr)_minmax(380px,0.88fr)] gap-8 lg:gap-10 items-start">

          {/* Cột trái — Thông tin liên hệ */}
          <div className="flex flex-col gap-5 min-w-0">
            <div>
              <h2 className="text-xl font-extrabold mb-1" style={{ color: '#303030' }}>Thông tin liên hệ</h2>
              <p className="text-sm text-slate-500">Liên hệ trực tiếp qua các kênh bên dưới hoặc gửi form để chúng tôi chủ động liên hệ lại.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {infoItems.map(({ icon: Icon, label, value, href, color }) => {
                const isWide = value.length > 32
                const content = (
                  <>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${color}18`, color }}>
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: '#767778' }}>{label}</p>
                      <p className="text-sm font-semibold break-words group-hover:underline" style={{ color: '#303030' }}>{value}</p>
                    </div>
                  </>
                )

                return href ? (
                  <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className={`filter-panel flex items-start gap-4 p-4 rounded-lg hover:shadow-md transition-shadow group ${isWide ? 'sm:col-span-2' : ''}`}>
                    {content}
                  </a>
                ) : (
                  <div key={label} className={`filter-panel flex items-start gap-4 p-4 rounded-lg ${isWide ? 'sm:col-span-2' : ''}`}>
                    {content}
                  </div>
                )
              })}
            </div>

            {/* Giờ làm việc */}
            <div className="filter-panel rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} style={{ color: '#2c2a7c' }} />
                <p className="text-sm font-bold" style={{ color: '#303030' }}>Giờ làm việc</p>
              </div>
              <div className="flex flex-col gap-1.5 text-sm">
                {settings.business_hours ? (
                  <p className="font-semibold whitespace-pre-line" style={{ color: '#303030' }}>{settings.business_hours}</p>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Thứ 2 – Thứ 7</span>
                      <span className="font-semibold" style={{ color: '#303030' }}>07:30 – 17:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Chủ nhật</span>
                      <span className="font-semibold" style={{ color: '#303030' }}>08:00 – 12:00</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Cột phải — Form */}
          <div className="filter-panel rounded-xl p-6 md:p-7 lg:sticky lg:top-28">
            <h2 className="text-lg font-extrabold mb-1" style={{ color: '#303030' }}>
              {productName ? `Báo giá: ${productName}` : 'Gửi yêu cầu báo giá'}
            </h2>
            <p className="text-xs text-slate-400 mb-5">Điền thông tin, chúng tôi sẽ gọi lại trong 5 phút.</p>
            <QuoteForm productId={productId} productName={productName} />
          </div>
        </div>
      </div>
    </div>
  )
}
