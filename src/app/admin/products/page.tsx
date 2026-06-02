import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createServerSupabase } from '@/lib/supabase-server'
import AdminShell from '@/components/admin/AdminShell'
import { ToggleVisibilityButton, DeleteButton } from './ProductActions'
import BearingPlaceholder from '@/components/public/BearingPlaceholder'
import { Plus } from 'lucide-react'
import type { Product } from '@/types'

function formatPrice(price: number) {
  if (price === 0) return null
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

export default async function AdminProductsPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug,sort_order,created_at)')
    .order('sort_order')
    .order('created_at', { ascending: false })

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Sản phẩm</h1>
          <p className="text-sm text-slate-400 mt-0.5">{products?.length ?? 0} sản phẩm</p>
        </div>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 text-white font-bold px-4 py-2 rounded-lg hover:opacity-90 transition text-sm"
          style={{ background: '#0BADE8' }}>
          <Plus size={15}/> Thêm mới
        </Link>
      </div>

      {(products?.length ?? 0) === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <div className="flex justify-center mb-3 opacity-20">
            <BearingPlaceholder size={56}/>
          </div>
          <p className="font-semibold text-slate-500 mb-1">Chưa có sản phẩm</p>
          <Link href="/admin/products/new"
            className="mt-4 inline-flex items-center gap-2 text-white font-bold px-5 py-2 rounded-lg text-sm hover:opacity-90"
            style={{ background: '#0BADE8' }}>
            <Plus size={14}/> Thêm sản phẩm
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Sản phẩm</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Mã / Danh mục</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Giá</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Trạng thái</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(products as Product[]).map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-slate-100"
                          style={{ background: 'linear-gradient(135deg,#EBF8FE,#dbeafe)' }}>
                          {p.image_url
                            ? <Image src={p.image_url} alt={p.name} width={40} height={40} className="object-contain p-1"/>
                            : <BearingPlaceholder size={32}/>}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 line-clamp-1 text-sm">{p.name}</p>
                          {p.short_description && (
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{p.short_description}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex flex-col gap-1">
                        {p.ma_vong_bi && (
                          <span className="inline-block w-fit text-xs font-bold px-2 py-0.5 rounded text-white"
                            style={{ background: '#0A2340' }}>#{p.ma_vong_bi}</span>
                        )}
                        {p.category?.name && <span className="text-xs text-slate-400">{p.category.name}</span>}
                        {(p.variants?.length ?? 0) > 0 && (
                          <span className="inline-block w-fit text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-600">
                            {p.variants.length} biến thể
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {(p.variants?.length ?? 0) > 0
                        ? <span className="text-xs text-slate-400 italic">Xem biến thể</span>
                        : formatPrice(p.price)
                          ? <span className="font-bold text-sm" style={{ color: '#0BADE8' }}>{formatPrice(p.price)}</span>
                          : <span className="text-xs italic font-medium" style={{ color: '#E5197E' }}>Liên hệ</span>}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <ToggleVisibilityButton id={p.id} isVisible={p.is_visible}/>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/admin/products/${p.id}`}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-100 transition">
                          Sửa
                        </Link>
                        <DeleteButton id={p.id} name={p.name}/>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
