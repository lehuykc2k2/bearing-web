import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { getCategories, getProducts } from '@/lib/data'
import { getSettings } from '@/lib/settings'
import ProductCard from '@/components/public/ProductCard'
import { Search, SlidersHorizontal } from 'lucide-react'
import type { Product } from '@/types'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  return {
    title: `Sản phẩm – ${s.shop_name}`,
    description: `Danh sách vòng bi chính hãng tại ${s.shop_name}. ${s.slogan}`,
  }
}

export const revalidate = 60

function buildUrl(base: Record<string, string | undefined>, overrides: Record<string, string | undefined>) {
  const merged = { ...base, ...overrides }
  const qs = Object.entries(merged)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
    .join('&')
  return qs ? `?${qs}` : '?'
}

const SORT_OPTIONS = [
  { value: '',           label: 'Mặc định' },
  { value: 'name_asc',   label: 'Tên A → Z' },
  { value: 'price_asc',  label: 'Giá thấp → cao' },
  { value: 'price_desc', label: 'Giá cao → thấp' },
]

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>
}) {
  const [params, t] = await Promise.all([searchParams, getTranslations('products')])
  const categories = await getCategories()
  const products = await getProducts({
    categorySlug: params.category,
    q:    params.q,
    sort: params.sort,
    categories,
  })

  const currentCat = categories.find(c => c.slug === params.category)
  const count = products.length
  const baseParams = { q: params.q, sort: params.sort }
  const hasFilter = !!(params.category || params.q)

  return (
    <div className="public-page-bg min-h-screen">

      {/* Banner */}
      <div className="hero-shell relative overflow-hidden text-white">
        <Image
          src="/hero-bearings-showroom.png"
          alt="Vòng bi công nghiệp"
          fill
          priority
          sizes="100vw"
          className="hero-media object-cover object-center"
        />
        <div className="hero-vignette absolute inset-0" />
        <div className="hero-mesh absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#fbfdfe] to-transparent" />

        <div className="soft-enter relative max-w-5xl mx-auto px-5 py-9 md:py-12 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2" style={{ color: '#8de4ff' }}>
            {t('bannerLabel')}
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-1 drop-shadow">
            {currentCat ? currentCat.name : params.q ? `"${params.q}"` : t('pageTitle')}
          </h1>
          {(currentCat || params.q) && (
            <p className="text-xs md:text-sm" style={{ color: '#b7d7e5' }}>{t('count', { count })}</p>
          )}
        </div>
      </div>

      {/* Filter card — nổi lên đè lên hero */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 -mt-7">
        <div className="filter-panel rounded-lg overflow-hidden">

          {/* Search row */}
          <form className="border-b border-slate-100">
            {params.category && <input type="hidden" name="category" value={params.category}/>}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] md:items-stretch">
              <div className="flex min-w-0 items-center px-4 py-3.5 gap-3">
                <Search size={17} className="shrink-0 text-slate-400"/>
                <input
                  type="text" name="q" defaultValue={params.q}
                  placeholder={t('searchPlaceholder')}
                  className="min-w-0 flex-1 text-sm bg-transparent focus:outline-none text-slate-700 placeholder-slate-400"
                />
              </div>
              {/* Sort */}
              <div className="flex min-w-0 items-center gap-2 px-4 py-3 border-t border-slate-100 md:border-t-0 md:border-l md:py-0">
                <SlidersHorizontal size={14} className="text-slate-400 shrink-0"/>
                <select
                  name="sort"
                  defaultValue={params.sort ?? ''}
                  className="focus-ring min-w-0 w-full md:w-auto text-xs font-medium bg-transparent cursor-pointer py-1 pr-1 rounded-md"
                  style={{ color: '#0A2340' }}>
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <button type="submit"
                className="focus-ring text-white font-bold px-5 py-3.5 text-sm transition hover:brightness-105 md:self-stretch"
                style={{ background: 'linear-gradient(135deg,#0BADE8 0%,#087fb5 100%)' }}>
                Tìm
              </button>
            </div>
          </form>

          {/* Category pills */}
          <div className="flex gap-1.5 px-3 py-3 md:px-4 overflow-x-auto scrollbar-none">
            <a href={buildUrl(baseParams, { category: undefined })}
              className="focus-ring shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap"
              style={!params.category
                ? { background: '#0A2340', color: 'white' }
                : { background: '#f1f5f9', color: '#475569' }}>
              {t('all')}
            </a>
            {categories.map(cat => (
              <a key={cat.id} href={buildUrl(baseParams, { category: cat.slug })}
                className="focus-ring shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap"
                style={params.category === cat.slug
                  ? { background: '#0BADE8', color: 'white' }
                  : { background: '#f1f5f9', color: '#475569' }}>
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="max-w-6xl mx-auto px-4 py-9 md:py-11">
        {count === 0 ? (
          <div className="text-center py-20">
            <Search size={46} className="mx-auto mb-4 text-slate-300" />
            <p className="font-bold text-lg mb-1" style={{ color: '#0A2340' }}>{t('notFound')}</p>
            <p className="text-sm text-slate-400 mb-6">{t('notFoundSub')}</p>
            {hasFilter && (
              <a href="?"
                className="focus-ring inline-flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:brightness-105 transition"
                style={{ background: 'linear-gradient(135deg,#0BADE8 0%,#087fb5 100%)' }}>
                {t('backToAll')}
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {(products as Product[]).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
