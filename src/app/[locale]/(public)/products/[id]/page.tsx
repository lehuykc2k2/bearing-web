import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Phone, MessageCircle, ChevronRight, Tag, FileText, Share2 } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getSettings } from '@/lib/settings'
import { getProductById, getProducts, getCategories } from '@/lib/data'
import ProductCard from '@/components/public/ProductCard'
import StickyCTA from '@/components/public/StickyCTA'
import ProductImageGallery from '@/components/public/ProductImageGallery'
import ProductSpecSheet from '@/components/public/ProductSpecSheet'
import RichContentViewer from '@/components/public/RichContentViewer'
import BrandLogo from '@/components/BrandLogo'
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

  const dxVariant   = p.variants?.find(v => /^d&x/i.test(v.thuong_hieu))
  const agaVariant  = p.variants?.find(v => /^aga$/i.test(v.thuong_hieu))
  const otherVariants = p.variants?.filter(v => !/^d&x|^aga$/i.test(v.thuong_hieu)) ?? []
  const dxOutOfStock  = !!dxVariant && dxVariant.ton_kho === 'Hết hàng'

  const BASE = 'https://bearing-web.vercel.app'
  const productUrl = `${BASE}/${locale}/products/${p.id}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.short_description || p.description || '',
    sku: p.ma_vong_bi || p.ma_san_pham || p.id,
    image: p.images?.length ? p.images : p.image_url ? [p.image_url] : [],
    url: productUrl,
    brand: { '@type': 'Brand', name: 'D&X Bearings' },
    category: p.category?.name ?? '',
    offers: p.variants?.length
      ? p.variants.map(v => ({
          '@type': 'Offer',
          priceCurrency: 'VND',
          price: v.gia > 0 ? v.gia : undefined,
          availability: 'https://schema.org/InStock',
          seller: { '@type': 'Organization', name: v.thuong_hieu },
        }))
      : [{
          '@type': 'Offer',
          priceCurrency: 'VND',
          price: p.price > 0 ? p.price : undefined,
          availability: 'https://schema.org/InStock',
          url: productUrl,
        }],
  }

  return (
    <div className="public-page-bg min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <div className="bg-white/85 border-b backdrop-blur" style={{ borderColor: '#e5e8ea' }}>
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 flex-wrap">
            <Link href="/" className="focus-ring rounded hover:text-[#2c2a7c] transition">Trang chủ</Link>
            <ChevronRight size={12}/>
            <Link href="/products" className="focus-ring rounded hover:text-[#2c2a7c] transition">Sản phẩm</Link>
            {p.category && (
              <>
                <ChevronRight size={12}/>
                <Link href={`/products?category=${p.category.slug}`} className="focus-ring rounded hover:text-[#2c2a7c] transition">
                  {p.category.name}
                </Link>
              </>
            )}
            <ChevronRight size={12}/>
            <span className="font-medium line-clamp-1" style={{ color: '#303030' }}>{p.name}</span>
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
                style={{ background: '#f7fafc', color: '#2c2a7c' }}>
                <Tag size={11}/> {p.category.name}
              </Link>
            )}

            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold leading-tight" style={{ color: '#303030' }}>
                {p.name}
              </h1>
              {p.short_description && (
                <p className="text-slate-500 mt-2 leading-relaxed text-sm">{p.short_description}</p>
              )}
            </div>

            {/* Thông số kỹ thuật nhanh */}
            {(p.ma_vong_bi || p.duong_kinh_trong || p.duong_kinh_ngoai || p.chieu_day) && (
              <div className="flex flex-wrap gap-2">
                {p.ma_vong_bi      && <span className="text-xs font-bold px-2.5 py-1 rounded-md" style={{ background: '#2c2a7c', color: 'white' }}>#{p.ma_vong_bi}</span>}
                {p.duong_kinh_trong && <span className="text-xs px-2.5 py-1 rounded-md border bg-white" style={{ borderColor: '#dcdee0', color: '#303030' }}>ID: {p.duong_kinh_trong}mm</span>}
                {p.duong_kinh_ngoai && <span className="text-xs px-2.5 py-1 rounded-md border bg-white" style={{ borderColor: '#dcdee0', color: '#303030' }}>OD: {p.duong_kinh_ngoai}mm</span>}
                {p.chieu_day        && <span className="text-xs px-2.5 py-1 rounded-md border bg-white" style={{ borderColor: '#dcdee0', color: '#303030' }}>W: {p.chieu_day}mm</span>}
              </div>
            )}

            {/* Brand blocks — D&X chính / AGA thay thế / brands khác */}
            {p.variants?.length > 0 ? (
              <div className="flex flex-col gap-3">

                {/* D&X block */}
                {dxVariant && (
                  <div className="rounded-xl border-2 overflow-hidden transition-all"
                    style={{ borderColor: dxOutOfStock ? '#e5e8ea' : '#2c2a7c' }}>
                    <div className="px-4 py-2.5 flex items-center justify-between"
                      style={{ background: dxOutOfStock ? '#f7fafc' : '#2c2a7c' }}>
                      <div className="flex items-center gap-2.5">
                        <BrandLogo
                          variant={dxOutOfStock ? 'dark' : 'light'}
                          size="sm"
                        />
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: dxOutOfStock ? '#f1f5f9' : 'rgba(255,255,255,0.18)', color: dxOutOfStock ? '#767778' : 'rgba(255,255,255,0.9)' }}>
                          Phân phối chính hãng
                        </span>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{
                          background: dxOutOfStock ? '#fee2e2' : 'rgba(255,255,255,0.2)',
                          color: dxOutOfStock ? '#c51c23' : 'white',
                        }}>
                        {dxOutOfStock ? 'Tạm hết hàng' : (dxVariant.ton_kho || 'Còn hàng')}
                      </span>
                    </div>
                    <div className="px-4 py-3.5" style={{ background: dxOutOfStock ? '#fafafa' : '#f0f4ff' }}>
                      {dxVariant.gia > 0 ? (
                        <span className="text-3xl font-black" style={{ color: dxOutOfStock ? '#94a3b8' : '#2c2a7c' }}>
                          {formatPrice(dxVariant.gia, locale)}
                        </span>
                      ) : (
                        <span className="font-semibold italic text-sm" style={{ color: dxOutOfStock ? '#94a3b8' : '#c51c23' }}>
                          Liên hệ để có giá tốt nhất
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* AGA block */}
                {agaVariant && (
                  <div className="rounded-xl border-2 overflow-hidden transition-all"
                    style={{ borderColor: dxOutOfStock ? '#ea580c' : '#e5e8ea' }}>
                    <div className="px-4 py-2.5 flex items-center justify-between"
                      style={{ background: dxOutOfStock ? '#ea580c' : '#f7fafc' }}>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm" style={{ color: dxOutOfStock ? 'white' : '#475569' }}>
                          AGA
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: dxOutOfStock ? 'rgba(255,255,255,0.22)' : '#f1f5f9',
                            color: dxOutOfStock ? 'white' : '#64748b',
                          }}>
                          {dxOutOfStock ? 'Sẵn hàng thay thế' : 'Tùy chọn thay thế'}
                        </span>
                      </div>
                      <span className="text-xs font-medium" style={{ color: dxOutOfStock ? 'rgba(255,255,255,0.85)' : '#94a3b8' }}>
                        {agaVariant.ton_kho || '—'}
                      </span>
                    </div>
                    <div className="px-4 py-3.5 flex items-center justify-between"
                      style={{ background: dxOutOfStock ? '#fff7ed' : 'white' }}>
                      {agaVariant.gia > 0 ? (
                        <span className="text-2xl font-bold" style={{ color: dxOutOfStock ? '#ea580c' : '#64748b' }}>
                          {formatPrice(agaVariant.gia, locale)}
                        </span>
                      ) : (
                        <span className="text-sm font-semibold italic" style={{ color: '#94a3b8' }}>Liên hệ</span>
                      )}
                      {dxOutOfStock && (
                        <span className="text-xs px-2 py-1 rounded-md font-medium"
                          style={{ background: '#fde68a', color: '#92400e' }}>
                          Chất lượng tương đương
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Brands khác: NSK, SKF, FAG... */}
                {otherVariants.length > 0 && (
                  <div className="detail-panel rounded-xl overflow-hidden">
                    <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider"
                      style={{ background: '#f7fafc', color: '#94a3b8' }}>
                      Thương hiệu khác
                    </div>
                    <table className="w-full text-sm">
                      <tbody>
                        {otherVariants.map((v, i) => (
                          <tr key={i} className="border-b last:border-0" style={{ borderColor: '#e5e8ea' }}>
                            <td className="px-4 py-2.5 font-bold" style={{ color: '#303030' }}>{v.thuong_hieu}</td>
                            <td className="px-4 py-2.5 font-extrabold" style={{ color: '#2c2a7c' }}>
                              {v.gia > 0 ? formatPrice(v.gia, locale) : <span className="text-sm font-semibold italic" style={{ color: '#c51c23' }}>Liên hệ</span>}
                            </td>
                            <td className="px-4 py-2.5 text-xs text-slate-400">{v.ton_kho || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Fallback: variants không phải D&X/AGA và không có block riêng */}
                {!dxVariant && !agaVariant && otherVariants.length === 0 && (
                  <div className="detail-panel rounded-xl overflow-hidden">
                    <div className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider"
                      style={{ background: 'linear-gradient(90deg,#f7fafc 0%,#fff5f5 100%)', color: '#767778' }}>
                      Bảng giá theo thương hiệu
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b" style={{ borderColor: '#e5e8ea' }}>
                          <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Thương hiệu</th>
                          <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Giá</th>
                          <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Tồn kho</th>
                        </tr>
                      </thead>
                      <tbody>
                        {p.variants.map((v, i) => (
                          <tr key={i} className="border-b last:border-0" style={{ borderColor: '#e5e8ea' }}>
                            <td className="px-4 py-2.5 font-bold" style={{ color: '#303030' }}>{v.thuong_hieu}</td>
                            <td className="px-4 py-2.5 font-extrabold" style={{ color: '#2c2a7c' }}>
                              {v.gia > 0 ? formatPrice(v.gia, locale) : <span className="text-sm font-semibold italic" style={{ color: '#c51c23' }}>Liên hệ</span>}
                            </td>
                            <td className="px-4 py-2.5 text-slate-500 text-xs">{v.ton_kho || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              /* Giá đơn */
              <div className="detail-panel rounded-lg p-5" style={{ background: 'linear-gradient(135deg,#f7fafc 0%,#ffffff 62%,#fff5f5 100%)' }}>
                {p.price > 0 ? (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#767778' }}>{t('priceLabel')}</p>
                    <p className="text-4xl font-black" style={{ color: '#2c2a7c' }}>{formatPrice(p.price, locale)}</p>
                    <p className="text-xs mt-2" style={{ color: '#767778' }}>{t('priceNote')}</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#767778' }}>{t('priceLabel')}</p>
                    <p className="text-xl font-bold" style={{ color: '#c51c23' }}>{t('contactPrice')}</p>
                  </>
                )}
              </div>
            )}

            {/* Nút liên hệ — ẩn trên mobile, dùng sticky CTA thay */}
            <div className="hidden md:flex flex-col gap-2.5">
              <div className="flex gap-2.5">
                {settings.phone && (
                  <a href={`tel:${settings.phone.replace(/\s/g,'')}`}
                    className="focus-ring interactive-lift flex-1 flex items-center justify-center gap-2 text-white font-bold py-3 rounded-lg transition text-sm shadow"
                    style={{ background: 'linear-gradient(135deg,#2c2a7c 0%,#0c3263 100%)' }}>
                    <Phone size={15}/> {t('callBtn', { phone: settings.phone })}
                  </a>
                )}
                {settings.zalo && (
                  <a href={`https://zalo.me/${settings.zalo}`} target="_blank" rel="noopener noreferrer"
                    className="focus-ring interactive-lift flex-1 flex items-center justify-center gap-2 text-white font-bold py-3 rounded-lg transition text-sm shadow"
                    style={{ background: 'linear-gradient(135deg,#c51c23 0%,#94151a 100%)' }}>
                    <MessageCircle size={15}/> {t('zaloBtn')}
                  </a>
                )}
              </div>
              <div className="flex gap-2.5">
                <Link
                  href={`/contact?product=${p.id}&name=${encodeURIComponent(p.name)}`}
                  className="focus-ring interactive-lift flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-lg transition text-sm border"
                  style={{ borderColor: '#2c2a7c', color: '#2c2a7c', background: '#f7fafc' }}>
                  <FileText size={15}/> Yêu cầu báo giá
                </Link>
                <a
                  href={`https://zalo.me/share?url=${encodeURIComponent(productUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="focus-ring interactive-lift flex items-center justify-center gap-2 font-bold px-4 py-3 rounded-lg transition text-sm border"
                  style={{ borderColor: '#e5e8ea', color: '#767778', background: 'white' }}>
                  <Share2 size={15}/> Chia sẻ
                </a>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              {[t('badge1'), t('badge2'), t('badge3')].map(b => (
                <span key={b} className="text-xs border px-3 py-1 rounded-full font-medium"
                  style={{ borderColor: '#dcdee0', color: '#303030', background: 'white' }}>
                  ✓ {b}
                </span>
              ))}
            </div>
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
          <div className="detail-panel mt-6 rounded-lg p-6 md:p-7">
            <h2 className="text-xl font-extrabold mb-5 flex items-center gap-2" style={{ color: '#303030' }}>
              <span className="w-1 h-6 rounded-full inline-block" style={{ background: '#2c2a7c' }}/>
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
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1 h-7 rounded-full" style={{ background: '#2c2a7c' }}/>
              <h2 className="text-xl font-extrabold" style={{ color: '#303030' }}>
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
            style={{ color: '#2c2a7c' }}>
            {t('back')}
          </Link>
        </div>
      </div>

      {/* Sticky CTA — chỉ hiện trên mobile */}
      <StickyCTA phone={settings.phone} zalo={settings.zalo} />
    </div>
  )
}
