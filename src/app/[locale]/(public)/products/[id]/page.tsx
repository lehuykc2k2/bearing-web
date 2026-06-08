import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChevronRight, Tag, FileText, Share2, ShieldCheck, Truck, Headphones, CheckCircle2 } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getSettings, getSalesContacts } from '@/lib/settings'
import { getProductById, getProducts, getCategories } from '@/lib/data'
import ProductCard from '@/components/public/ProductCard'
import StickyCTA from '@/components/public/StickyCTA'
import ProductContactActions from '@/components/public/ProductContactActions'
import ProductImageGallery from '@/components/public/ProductImageGallery'
import ProductSpecSheet from '@/components/public/ProductSpecSheet'
import RichContentViewer from '@/components/public/RichContentViewer'
import { getBrandTheme } from '@/lib/brand-theme'
import type { Product, SalesContact } from '@/types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const [product, settings] = await Promise.all([getProductById(id), getSettings()])
  if (!product) return {}
  return {
    title: `${product.name} – ${settings.shop_name}`,
    description: product.short_description || `${product.name} chính hãng tại ${settings.shop_name}`,
    openGraph: {
      title: product.name,
      description: product.short_description,
      images: product.image_url ? [product.image_url] : [],
    },
  }
}

export const revalidate = 60

function formatPrice(price: number, locale: string) {
  if (locale === 'en') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price / 25000)
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  const [settings, contacts, t, product, categories] = await Promise.all([
    getSettings(),
    getSalesContacts(),
    getTranslations('product'),
    getProductById(id),
    getCategories(),
  ])

  if (!product) notFound()
  const p = product as Product

  const related = p.category_id && p.category?.slug
    ? (await getProducts({ categorySlug: p.category.slug, categories }))
        .filter(r => r.id !== p.id)
        .slice(0, 4)
    : []

  const BASE = 'https://www.vongbidx.com.vn'
  const productUrl = `${BASE}/${locale}/products/${p.id}`
  const brandColor = getBrandTheme(p.brand)
  const primaryPhone = contacts[0]?.phone || settings.phone
  const primaryZalo = contacts[0]?.zalo || settings.zalo
  const mobileContacts: SalesContact[] = contacts.length > 0
    ? contacts
    : primaryPhone
      ? [{
          id: 'company-contact',
          name: settings.shop_name || 'Tư vấn',
          phone: primaryPhone,
          zalo: primaryZalo,
          role: 'Kinh doanh & Tư vấn',
          sort_order: 0,
          is_active: true,
          created_at: '',
        }]
      : []
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.short_description || p.description || '',
    sku: p.ma_vong_bi || p.ma_san_pham || p.id,
    image: p.images?.length ? p.images : p.image_url ? [p.image_url] : [],
    url: productUrl,
    brand: { '@type': 'Brand', name: p.brand || 'D&X Bearings' },
    category: p.category?.name ?? '',
    offers: [{
      '@type': 'Offer',
      priceCurrency: 'VND',
      price: p.price > 0 ? p.price : undefined,
      availability: 'https://schema.org/InStock',
      url: productUrl,
    }],
  }

  return (
    <div className="public-page-bg min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div className="bg-white/90 border-b backdrop-blur-sm" style={{ borderColor: '#e5e8ea' }}>
        <div className="max-w-6xl mx-auto px-4 py-2.5">
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 flex-wrap">
            <Link href="/" className="focus-ring rounded hover:text-[#2c2a7c] transition">Trang chủ</Link>
            <ChevronRight size={11}/>
            <Link href="/products" className="focus-ring rounded hover:text-[#2c2a7c] transition">Sản phẩm</Link>
            {p.category && (
              <>
                <ChevronRight size={11}/>
                <Link href={`/products?category=${p.category.slug}`} className="focus-ring rounded hover:text-[#2c2a7c] transition">
                  {p.category.name}
                </Link>
              </>
            )}
            <ChevronRight size={11}/>
            <span className="text-slate-600 font-medium line-clamp-1">{p.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-7 pb-28 md:pb-12">

        {/* Hero grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* Gallery — sticky trên desktop */}
          <div className="md:sticky md:top-6">
            <ProductImageGallery
              images={p.images?.length ? p.images : p.image_url ? [p.image_url] : []}
              name={p.name}
            />
          </div>

          {/* Info panel */}
          <div className="flex flex-col gap-0 overflow-hidden rounded-2xl border" style={{ borderColor: brandColor?.border ?? '#e5e8ea' }}>

            {/* Brand strip */}
            {brandColor && (
              <div className="rounded-t-2xl px-5 py-4"
                style={{ background: brandColor.gradient, color: brandColor.text }}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-11 min-w-11 place-items-center rounded-xl bg-white/20 px-2 text-sm font-black leading-none ring-1 ring-white/30">
                      {brandColor.shortLabel}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] opacity-80">
                        Thương hiệu
                      </p>
                      <p className="truncate text-xl font-black leading-tight">
                        {brandColor.label}
                      </p>
                    </div>
                    <span className="hidden sm:inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold"
                      style={{ background: 'rgba(255,255,255,0.2)', color: brandColor.text }}>
                      Chính hãng
                    </span>
                  </div>
                  {p.category && (
                    <Link href={`/products?category=${p.category.slug}&brand=${encodeURIComponent(brandColor.key)}`}
                      className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition hover:bg-white/15"
                      style={{ color: brandColor.text }}>
                      <Tag size={10}/> {p.category.name}
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Main info */}
            <div className="px-5 pt-5 pb-4 flex flex-col gap-4" style={{ background: 'white' }}>

              {/* Tên sản phẩm */}
              <div>
                <h1 className="text-2xl md:text-[1.65rem] font-extrabold leading-snug" style={{ color: '#1a1a2e' }}>
                  {p.name}
                </h1>
                {p.short_description && (
                  <p className="mt-1.5 text-sm leading-relaxed" style={{ color: '#64748b' }}>
                    {p.short_description}
                  </p>
                )}
              </div>

              {/* Thông số nhanh */}
              {(p.ma_vong_bi || p.duong_kinh_trong || p.duong_kinh_ngoai || p.chieu_day) && (
                <div className="flex flex-wrap gap-2">
                  {p.ma_vong_bi && (
                    <span className="text-xs font-extrabold px-3 py-1.5 rounded-lg"
                      style={{ background: brandColor?.bg ?? '#2c2a7c', color: 'white' }}>
                      {p.ma_vong_bi}
                    </span>
                  )}
                  {p.duong_kinh_trong && (
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-lg border"
                      style={{ borderColor: '#e2e8f0', color: '#475569', background: '#f8fafc' }}>
                      d = {p.duong_kinh_trong} mm
                    </span>
                  )}
                  {p.duong_kinh_ngoai && (
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-lg border"
                      style={{ borderColor: '#e2e8f0', color: '#475569', background: '#f8fafc' }}>
                      D = {p.duong_kinh_ngoai} mm
                    </span>
                  )}
                  {p.chieu_day && (
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-lg border"
                      style={{ borderColor: '#e2e8f0', color: '#475569', background: '#f8fafc' }}>
                      B = {p.chieu_day} mm
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Giá + CTA */}
            <div className="px-5 py-5 flex flex-col gap-4 border-t"
              style={{ background: brandColor?.light ?? '#f8fafc', borderColor: '#f1f5f9' }}>

              {/* Giá */}
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>
                    Đơn giá
                  </p>
                  {p.price > 0 ? (
                    <p className="text-4xl font-black leading-none" style={{ color: brandColor?.bg ?? '#2c2a7c' }}>
                      {formatPrice(p.price, locale)}
                    </p>
                  ) : (
                    <p className="text-2xl font-extrabold" style={{ color: '#c51c23' }}>
                      Liên hệ báo giá
                    </p>
                  )}
                  {p.price > 0 && (
                    <p className="text-[11px] mt-1" style={{ color: '#94a3b8' }}>{t('priceNote')}</p>
                  )}
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full shrink-0"
                  style={{ background: '#dcfce7', color: '#166534' }}>
                  <CheckCircle2 size={11}/> Còn hàng
                </span>
              </div>

              {/* Nút CTA - chỉ hiện trên desktop */}
              <div className="hidden md:flex flex-col gap-2">
                <ProductContactActions contacts={mobileContacts} color={brandColor?.bg ?? '#2c2a7c'} />
                <div className="flex gap-2">
                  <Link href={`/contact?product=${p.id}&name=${encodeURIComponent(p.name)}`}
                    className="focus-ring interactive-lift flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition text-sm border-2"
                    style={{ borderColor: brandColor?.border ?? '#2c2a7c', color: brandColor?.bg ?? '#2c2a7c', background: 'white' }}>
                    <FileText size={14}/> Yêu cầu báo giá
                  </Link>
                  <a href={`https://zalo.me/share?url=${encodeURIComponent(productUrl)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="focus-ring interactive-lift flex items-center justify-center gap-2 font-semibold px-4 py-3 rounded-xl transition text-sm border"
                    style={{ borderColor: '#e2e8f0', color: '#64748b', background: 'white' }}>
                    <Share2 size={14}/>
                  </a>
                </div>
              </div>
            </div>

            {/* Trust row */}
            <div className="px-5 py-3.5 grid grid-cols-3 gap-2 border-t" style={{ borderColor: '#f1f5f9', background: 'white' }}>
              {[
                { icon: <ShieldCheck size={14}/>, text: 'Chính hãng 100%' },
                { icon: <Truck size={14}/>, text: 'Giao hàng toàn quốc' },
                { icon: <Headphones size={14}/>, text: 'Tư vấn miễn phí' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1 text-center">
                  <span style={{ color: brandColor?.bg ?? '#2c2a7c' }}>{icon}</span>
                  <span className="text-[10px] font-semibold leading-tight" style={{ color: '#64748b' }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Bảng giá hãng tương đương */}
            {p.variants?.length > 0 && (
              <div className="border-t" style={{ borderColor: '#f1f5f9' }}>
                <div className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#94a3b8', background: '#fafafa' }}>
                  Hãng tương đương
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {p.variants.map((v, i) => {
                      const variantTheme = getBrandTheme(v.thuong_hieu)
                      return (
                        <tr key={i} className="border-t" style={{ borderColor: '#f1f5f9' }}>
                          <td className="px-5 py-2.5 align-middle">
                            {variantTheme ? (
                              <span className="inline-flex max-w-full items-center gap-2 rounded-lg border px-2.5 py-1 text-xs font-black"
                                style={{ background: variantTheme.light, borderColor: variantTheme.border, color: variantTheme.bg }}>
                                <span className="h-2 w-2 rounded-full" style={{ background: variantTheme.bg }} />
                                <span className="truncate">{variantTheme.label}</span>
                              </span>
                            ) : (
                              <span className="font-bold" style={{ color: '#303030' }}>{v.thuong_hieu}</span>
                            )}
                          </td>
                          <td className="px-5 py-2.5 font-extrabold align-middle" style={{ color: variantTheme?.bg ?? '#2c2a7c' }}>
                            {v.gia > 0 ? formatPrice(v.gia, locale) : <span className="text-sm font-semibold italic" style={{ color: '#c51c23' }}>Liên hệ</span>}
                          </td>
                          <td className="px-5 py-2.5 text-xs text-right align-middle" style={{ color: '#94a3b8' }}>{v.ton_kho || '—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Thông số kỹ thuật */}
        <div className="mt-10">
          <ProductSpecSheet
            ma_san_pham={p.ma_san_pham}
            ma_vong_bi={p.ma_vong_bi}
            duong_kinh_trong={p.duong_kinh_trong}
            duong_kinh_ngoai={p.duong_kinh_ngoai}
            chieu_day={p.chieu_day}
            spec_image_url={p.spec_image_url || null}
            spec_notes={p.spec_notes || null}
          />
        </div>

        {/* Mô tả chi tiết */}
        {(p.description_html || p.description) && (
          <div className="detail-panel mt-6 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-extrabold mb-5 flex items-center gap-2.5" style={{ color: '#1a1a2e' }}>
              <span className="w-1 h-6 rounded-full inline-block" style={{ background: brandColor?.bg ?? '#2c2a7c' }}/>
              {t('descTitle')}
            </h2>
            {p.description_html ? (
              <RichContentViewer html={p.description_html} className="rich-content" />
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#5a5c5e' }}>
                {p.description}
              </p>
            )}
          </div>
        )}

        {/* Sản phẩm liên quan */}
        {related.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1 h-7 rounded-full shrink-0" style={{ background: brandColor?.bg ?? '#2c2a7c' }}/>
              <h2 className="text-xl font-extrabold" style={{ color: '#1a1a2e' }}>Sản phẩm liên quan</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              {related.map(r => <ProductCard key={r.id} product={r} />)}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link href="/products"
            className="focus-ring inline-flex items-center gap-1.5 rounded text-sm font-medium hover:underline transition"
            style={{ color: brandColor?.bg ?? '#2c2a7c' }}>
            {t('back')}
          </Link>
        </div>
      </div>

      <StickyCTA contacts={mobileContacts} />
    </div>
  )
}
