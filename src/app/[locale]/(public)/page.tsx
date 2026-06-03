import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getSettings } from '@/lib/settings'
import { getFeaturedProducts } from '@/lib/data'
import ProductCard from '@/components/public/ProductCard'
import {
  Award,
  CircleDollarSign,
  Headphones,
  PackageCheck,
  Scale,
  ShieldCheck,
  Truck,
  Warehouse,
  BadgeDollarSign,
  Wrench,
  ArrowRight,
  Phone,
} from 'lucide-react'
import type { Product } from '@/types'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  return {
    title: `${s.shop_name} – ${s.slogan}`,
    description: s.banner_sub || s.slogan,
    openGraph: { title: s.shop_name, description: s.slogan, type: 'website' },
  }
}

export const revalidate = 60

export default async function HomePage() {
  const [settings, products, t] = await Promise.all([
    getSettings(),
    getFeaturedProducts(8),
    getTranslations('home'),
  ])

  const features = [
    { icon: ShieldCheck,     title: t('f1Title'), sub: t('f1Sub'), color: '#2c2a7c' },
    { icon: Truck,           title: t('f2Title'), sub: t('f2Sub'), color: '#c51c23' },
    { icon: BadgeDollarSign, title: t('f3Title'), sub: t('f3Sub'), color: '#2c2a7c' },
    { icon: Wrench,          title: t('f4Title'), sub: t('f4Sub'), color: '#c51c23' },
  ]

  const stats = [
    { num: t('stat1Num'), label: t('stat1Label'), sub: t('stat1Sub'), color: '#2c2a7c' },
    { num: t('stat2Num'), label: t('stat2Label'), sub: t('stat2Sub'), color: '#c51c23' },
    { num: t('stat3Num'), label: t('stat3Label'), sub: t('stat3Sub'), color: '#2c2a7c' },
  ]

  const whyChoose = [
    {
      icon: Award,
      title: 'CHẤT LƯỢNG VƯỢT TRỘI',
      desc: 'Sản phẩm được kiểm nghiệm và tin dùng cho nhiều hệ thống máy móc, nhà xưởng.',
    },
    {
      icon: CircleDollarSign,
      title: 'GIÁ THÀNH TỐT',
      desc: 'Nguồn hàng nhập trực tiếp, chính sách giá cạnh tranh cho khách lẻ và đại lý.',
    },
    {
      icon: Warehouse,
      title: 'TỒN KHO ĐA DẠNG',
      desc: 'Lưu kho nhiều mã vòng bi thông dụng, đáp ứng nhanh nhu cầu thay thế của khách.',
    },
    {
      icon: Scale,
      title: 'PHÁP LÝ MINH BẠCH',
      desc: 'Đảm bảo hàng chính hãng, chứng từ rõ ràng, hỗ trợ CO-CQ theo yêu cầu.',
    },
    {
      icon: PackageCheck,
      title: 'GIAO HÀNG NHANH',
      desc: 'Quy trình đóng gói và giao hàng linh hoạt, hạn chế gián đoạn vận hành.',
    },
    {
      icon: Headphones,
      title: 'HỖ TRỢ KỸ THUẬT',
      desc: 'Đội ngũ tư vấn hỗ trợ chọn đúng mã vòng bi, đúng tải trọng và ứng dụng.',
    },
  ]

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero-shell relative overflow-hidden">
        <Image
          src="/hero-bearings-showroom.png"
          alt="Industrial rolling bearings on a brushed metal surface"
          fill
          priority
          sizes="100vw"
          className="hero-media hero-visual-motion object-cover"
        />
        <div className="hero-vignette absolute inset-0" />
        <div className="hero-mesh absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#f7fafc] to-transparent" />

        <div className="soft-enter relative max-w-6xl mx-auto px-5 py-14 md:py-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider backdrop-blur"
            style={{ borderColor: 'rgba(44,42,124,0.18)', color: '#2c2a7c', background: 'rgba(255,255,255,0.82)' }}>
            <Wrench size={13} strokeWidth={2.6}/> {t('badge')}
          </div>

          <h1 className="text-3xl md:text-6xl font-extrabold leading-tight mb-4 tracking-tight">
            {settings.banner_title || 'D&X Rolling Bearings'}
          </h1>
          <p className="text-sm md:text-xl leading-relaxed mb-3 md:max-w-xl" style={{ color: '#565b61' }}>
            {settings.banner_sub || settings.slogan}
          </p>
          <p className="text-[11px] md:text-sm font-semibold mb-7 tracking-widest uppercase" style={{ color: '#2c2a7c' }}>
            {t('tagline')}
          </p>

          {/* Buttons: full-width on mobile */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <Link href="/products"
              className="focus-ring interactive-lift flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-lg text-sm text-white shadow-lg shadow-black/10"
              style={{ background: 'linear-gradient(135deg,#2c2a7c 0%,#0c3263 100%)' }}>
              {t('viewProducts')} <ArrowRight size={15}/>
            </Link>
            {settings.phone && (
              <a href={`tel:${settings.phone.replace(/\s/g,'')}`}
                className="focus-ring interactive-lift flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-lg text-sm text-white shadow-lg shadow-black/10"
                style={{ background: 'linear-gradient(135deg,#c51c23 0%,#94151a 100%)' }}>
                <Phone size={15}/> {settings.phone}
              </a>
            )}
          </div>
        </div>

      </section>

      {/* ===== FEATURES — horizontal list on mobile ===== */}
      <section className="section-soft py-8 md:py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Mobile: 2 rows x 2 cols dạng ngang */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {features.map(({ icon: Icon, title, sub, color }) => (
              <div key={title} className="feature-tile interactive-lift rounded-lg p-3 md:p-5 flex items-center gap-3 md:flex-col md:items-center md:text-center">
                <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center"
                  style={{ background: `${color}18`, color }}>
                  <Icon size={19}/>
                </div>
                <div>
                  <div className="font-bold text-xs md:text-sm leading-snug" style={{ color: '#303030' }}>{title}</div>
                  <div className="text-[10px] md:text-xs text-slate-400 mt-0.5 leading-snug line-clamp-2">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SẢN PHẨM NỔI BẬT ===== */}
      {products.length > 0 && (
        <section className="section-white py-9 md:py-14">
          <div className="max-w-6xl mx-auto px-3 md:px-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#2c2a7c' }}>
                  {t('featuredLabel')}
                </p>
                <h2 className="text-xl md:text-3xl font-extrabold" style={{ color: '#303030' }}>
                  {t('featuredTitle')}
                </h2>
              </div>
              <Link href="/products"
                className="focus-ring flex items-center gap-1 text-xs md:text-sm font-semibold shrink-0 hover:underline underline-offset-4"
                style={{ color: '#2c2a7c' }}>
                {t('viewAll')} <ArrowRight size={13}/>
              </Link>
            </div>
          </div>

          {/* Grid full-width trên mobile: sát mép, card to hơn */}
          <div className="px-2 md:px-4 max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {(products as Product[]).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ===== STATS ===== */}
      <section className="section-warm py-10 md:py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-7">
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#2c2a7c' }}>
              {t('whyLabel')}
            </p>
            <h2 className="text-xl md:text-3xl font-extrabold" style={{ color: '#303030' }}>
              {t('whyTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-3 gap-3">
            {stats.map(({ num, label, sub, color }) => (
              <div key={label} className="stat-tile interactive-lift rounded-lg p-4 md:p-7 text-center">
                <div className="text-2xl md:text-5xl font-black mb-1" style={{ color }}>{num}</div>
                <div className="font-bold text-xs md:text-base leading-snug mb-0.5" style={{ color: '#303030' }}>{label}</div>
                <div className="text-slate-400 text-[10px] md:text-sm leading-snug hidden sm:block">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="why-choose-dark relative overflow-hidden px-4 py-14 md:py-20 text-white"
        style={{ background: 'linear-gradient(135deg,#2c2a7c 0%,#1f2f74 48%,#0c3263 100%)' }}>
        <Image
          src="/hero-bearings-showroom.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.12]"
        />
        <div className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg,rgba(44,42,124,0.86) 0%,rgba(44,42,124,0.74) 46%,rgba(12,50,99,0.84) 100%), repeating-linear-gradient(135deg,rgba(255,255,255,0.055) 0 1px,transparent 1px 96px)',
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-5 mb-10 md:mb-14">
            <span className="hidden sm:block h-px flex-1 max-w-xs bg-white/20" />
            <h2 className="text-center text-2xl md:text-4xl font-extrabold uppercase tracking-wide">
              Tại sao chọn D&amp;X Bearings?
            </h2>
            <span className="hidden sm:block h-px flex-1 max-w-xs bg-white/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-9 md:gap-y-12">
            {whyChoose.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-5 md:gap-6">
                <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 flex items-start justify-center text-white/90">
                  <Icon size={58} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold uppercase tracking-wide mb-3">
                    {title}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed text-white/82 font-medium">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
