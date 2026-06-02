import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import AdminShell from '@/components/admin/AdminShell'
import { Layers } from 'lucide-react'
import { CategoryFormModal, DeleteCategoryButton } from './CategoryActions'

export default async function AdminCategoriesPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, sort_order, products(count)')
    .order('sort_order')

  const cats = (categories ?? []).map(c => ({
    id:            c.id,
    name:          c.name,
    slug:          c.slug,
    sort_order:    c.sort_order,
    product_count: (c.products as unknown as { count: number }[])?.[0]?.count ?? 0,
  }))

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Danh mục</h1>
          <p className="text-sm text-slate-400 mt-0.5">{cats.length} danh mục</p>
        </div>
        <CategoryFormModal />
      </div>

      {cats.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center bg-slate-100">
            <Layers size={24} className="text-slate-400"/>
          </div>
          <p className="font-semibold text-slate-500 mb-1">Chưa có danh mục nào</p>
          <p className="text-sm text-slate-400 mb-5">Thêm danh mục để phân loại sản phẩm</p>
          <CategoryFormModal />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Tên danh mục</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Slug</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Thứ tự</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Sản phẩm</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cats.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-800">{c.name}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="font-mono text-xs text-slate-400">{c.slug}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-500">{c.sort_order}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700">
                      {c.product_count}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <CategoryFormModal editCategory={c} />
                      <DeleteCategoryButton id={c.id} name={c.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  )
}
