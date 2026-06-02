import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Phone, MessageCircle, ChevronRight, Tag } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getSettings } from '@/lib/settings'
import { getProductById, getProducts, getCategories } from '@/lib/data'
import ProductCard from '@/components/public/ProductCard'
import StickyCTA from '@/components/public/StickyCTA'
import ProductImageGallery from '@/components/public/ProductImageGallery'
import type { Product } from '@/types'

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
  const [settings, t, product, categories] = await Promise.all([
    getSettings(),
    getTranslations('product'),
    getProductById(id),
    getCategories(),
  ])

  if (!product) notFound()
  const p = product as Product

  // Sản phẩm liên quan: cùng danh mục, loại bỏ sản phẩm hiện tại
  const related = p.category_id
    ? (await getProducts({ categorySlug: p.category?.slug, categories }))
        .filter(r => r.id !== p.id)
        .slice(0, 4)
    : []

  return (
    <div className="public-page-bg min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white/85 border-b border-sky-100 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 flex-wrap">
            <Link href="/" className="focus-ring rounded hover:text-[#0BADE8] transition">Trang chủ</Link>
            <ChevronRight size={12}/>
            <Link href="/products" className="focus-ring rounded hover:text-[#0BADE8] transition">Sản phẩm</Link>
            {p.category && (
              <>
                <ChevronRight size={12}/>
                <Link href={`/products?category=${p.category.slug}`} className="focus-ring rounded hover:text-[#0BADE8] transition">
                  {p.category.name}
                </Link>
              </>
            )}
            <ChevronRight size={12}/>
            <span className="font-medium line-clamp-1" style={{ color: '#0A2340' }}>{p.name}</span>
          </nav>
        </div>
      </div>

      {/* Nội dung chính — thêm pb-24 md:pb-0 để không bị sticky CTA che */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-10 pb-28 md:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">

          {/* Ảnh / Gallery */}
          <ProductImageGallery
            images={p.images?.length ? p.images : p.image_url ? [p.image_url] : []}
            name={p.name}
          />

          {/* Thông tin */}
          <div className="flex flex-col gap-5">
            {p.category && (
              <Link href={`/products?category=${p.category.slug}`}
                className="focus-ring inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full hover:opacity-80 transition w-fit"
                style={{ background: '#EBF8FE', color: '#0BADE8' }}>
                <Tag size={11}/> {p.category.name}
              </Link>
            )}

            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold leading-tight" style={{ color: '#0A2340' }}>
                {p.name}
              </h1>
              {p.short_description && (
                <p className="text-slate-500 mt-2 leading-relaxed text-sm">{p.short_description}</p>
              )}
            </div>

            {/* Thông số kỹ thuật nhanh */}
            {(p.ma_vong_bi || p.duong_kinh_trong || p.duong_kinh_ngoai || p.chieu_day) && (
              <div className="flex flex-wrap gap-2">
                {p.ma_vong_bi      && <span className="text-xs font-bold px-2.5 py-1 rounded-md" style={{ background: '#0A2340', color: 'white' }}>#{p.ma_vong_bi}</span>}
                {p.duong_kinh_trong && <span className="text-xs px-2.5 py-1 rounded-md border bg-white" style={{ borderColor: '#b8d9ee', color: '#0A2340' }}>ID: {p.duong_kinh_trong}mm</span>}
                {p.duong_kinh_ngoai && <span className="text-xs px-2.5 py-1 rounded-md border bg-white" style={{ borderColor: '#b8d9ee', color: '#0A2340' }}>OD: {p.duong_kinh_ngoai}mm</span>}
                {p.chieu_day        && <span className="text-xs px-2.5 py-1 rounded-md border bg-white" style={{ borderColor: '#b8d9ee', color: '#0A2340' }}>W: {p.chieu_day}mm</span>}
              </div>
            )}

            {/* Variants (nhiều thương hiệu) */}
            {p.variants?.length > 0 ? (
              <div className="detail-panel rounded-lg overflow-hidden">
                <div className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider" style={{ background: 'linear-gradient(90deg,#EBF8FE 0%,#FFF7E8 100%)', color: '#5a8fa8' }}>
                  Bảng giá theo thương hiệu
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b" style={{ borderColor: '#e0f2fe' }}>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Thương hiệu</th>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Giá</th>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Tồn kho</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.variants.map((v, i) => (
                      <tr key={i} className="border-b last:border-0" style={{ borderColor: '#e0f2fe' }}>
                        <td className="px-4 py-2.5 font-bold" style={{ color: '#0A2340' }}>{v.thuong_hieu}</td>
                        <td className="px-4 py-2.5 font-extrabold" style={{ color: '#0BADE8' }}>
                          {v.gia > 0 ? formatPrice(v.gia, locale) : <span className="text-sm font-semibold italic" style={{ color: '#E5197E' }}>Liên hệ</span>}
                        </td>
                        <td className="px-4 py-2.5 text-slate-500 text-xs">{v.ton_kho || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Giá đơn */
              <div className="detail-panel rounded-lg p-5" style={{ background: 'linear-gradient(135deg,#EBF8FE 0%,#ffffff 62%,#FFF7E8 100%)' }}>
                {p.price > 0 ? (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#5a8fa8' }}>{t('priceLabel')}</p>
                    <p className="text-4xl font-black" style={{ color: '#0BADE8' }}>{formatPrice(p.price, locale)}</p>
                    <p className="text-xs mt-2" style={{ color: '#5a8fa8' }}>{t('priceNote')}</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#5a8fa8' }}>{t('priceLabel')}</p>
                    <p className="text-xl font-bold" style={{ color: '#E5197E' }}>{t('contactPrice')}</p>
                  </>
                )}
              </div>
            )}

            {/* Nút liên hệ — ẩn trên mobile, dùng sticky CTA thay */}
            <div className="hidden md:flex flex-col sm:flex-row gap-3">
              {settings.phone && (
                <a href={`tel:${settings.phone.replace(/\s/g,'')}`}
                  className="focus-ring interactive-lift flex-1 flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-lg transition text-sm shadow"
                  style={{ background: 'linear-gradient(135deg,#0A2340 0%,#123b66 100%)' }}>
                  <Phone size={16}/> {t('callBtn', { phone: settings.phone })}
                </a>
              )}
              {settings.zalo && (
                <a href={`https://zalo.me/${settings.zalo}`} target="_blank" rel="noopener noreferrer"
                  className="focus-ring interactive-lift flex-1 flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-lg transition text-sm shadow"
                  style={{ background: 'linear-gradient(135deg,#E5197E 0%,#b90f63 100%)' }}>
                  <MessageCircle size={16}/> {t('zaloBtn')}
                </a>
              )}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              {[t('badge1'), t('badge2'), t('badge3')].map(b => (
                <span key={b} className="text-xs border px-3 py-1 rounded-full font-medium"
                  style={{ borderColor: '#b8d9ee', color: '#0A2340', background: 'white' }}>
                  ✓ {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Mô tả chi tiết */}
        {p.description && (
          <div className="detail-panel mt-10 rounded-lg p-6 md:p-7">
            <h2 className="text-xl font-extrabold mb-5 flex items-center gap-2" style={{ color: '#0A2340' }}>
              <span className="w-1 h-6 rounded-full inline-block" style={{ background: '#0BADE8' }}/>
              {t('descTitle')}
            </h2>
            <div className="text-sm leading-relaxed whitespace-pre-wrap text-slate-600">
              {p.description}
            </div>
          </div>
        )}

        {/* Sản phẩm liên quan */}
        {related.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1 h-7 rounded-full" style={{ background: '#0BADE8' }}/>
              <h2 className="text-xl font-extrabold" style={{ color: '#0A2340' }}>
                Sản phẩm liên quan
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              {related.map(r => <ProductCard key={r.id} product={r} />)}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link href="/products"
            className="focus-ring inline-flex items-center gap-1.5 rounded text-sm font-medium hover:underline transition"
            style={{ color: '#0BADE8' }}>
            {t('back')}
          </Link>
        </div>
      </div>

      {/* Sticky CTA — chỉ hiện trên mobile */}
      <StickyCTA phone={settings.phone} zalo={settings.zalo} />
    </div>
  )
}
