'use client'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ToggleVisibilityButton, DeleteButton } from './ProductActions'
import BearingPlaceholder from '@/components/public/BearingPlaceholder'
import { Eye, EyeOff, Trash2 } from 'lucide-react'
import type { Product } from '@/types'

function formatPrice(price: number) {
  if (price === 0) return null
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

export default function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()

  const allIds = products.map(p => p.id)
  const allSelected = allIds.length > 0 && allIds.every(id => selected.has(id))

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(allIds))
  }

  function toggleOne(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function bulkAction(action: 'show' | 'hide' | 'delete') {
    if (selected.size === 0) return
    const ids = [...selected]

    if (action === 'delete') {
      if (!confirm(`Xóa ${ids.length} sản phẩm đã chọn? Hành động này không thể hoàn tác.`)) return
    }

    startTransition(async () => {
      const supabase = createClient()
      if (action === 'show') {
        await supabase.from('products').update({ is_visible: true }).in('id', ids)
      } else if (action === 'hide') {
        await supabase.from('products').update({ is_visible: false }).in('id', ids)
      } else {
        await supabase.from('products').delete().in('id', ids)
      }
      setSelected(new Set())
      router.refresh()
    })
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Bulk toolbar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200"
          style={{ background: '#EBF8FE' }}>
          <span className="text-sm font-semibold" style={{ color: '#0A2340' }}>
            Đã chọn {selected.size} sản phẩm
          </span>
          <div className="flex gap-2 ml-auto">
            <button onClick={() => bulkAction('show')} disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition hover:bg-white disabled:opacity-50"
              style={{ borderColor: '#0BADE8', color: '#0BADE8' }}>
              <Eye size={13}/> Hiện
            </button>
            <button onClick={() => bulkAction('hide')} disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 text-slate-600 transition hover:bg-slate-100 disabled:opacity-50">
              <EyeOff size={13}/> Ẩn
            </button>
            <button onClick={() => bulkAction('delete')} disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition hover:bg-red-50 disabled:opacity-50"
              style={{ borderColor: '#ef4444', color: '#ef4444' }}>
              <Trash2 size={13}/> Xóa
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 w-10">
                <input type="checkbox" checked={allSelected} onChange={toggleAll}
                  className="w-4 h-4 rounded accent-cyan-500 cursor-pointer" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Sản phẩm</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Mã / Danh mục</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Giá</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Trạng thái</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map(p => (
              <tr key={p.id} className={`hover:bg-slate-50 transition-colors ${selected.has(p.id) ? 'bg-sky-50/60' : ''}`}>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleOne(p.id)}
                    className="w-4 h-4 rounded accent-cyan-500 cursor-pointer" />
                </td>
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
  )
}
