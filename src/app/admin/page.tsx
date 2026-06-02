import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import AdminShell from '@/components/admin/AdminShell'
import Link from 'next/link'
import { Package, Eye, EyeOff, Plus, FileUp, Settings, ArrowRight, Layers } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const [{ count: total }, { count: visible }, { count: hidden }, { count: cats }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_visible', true),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_visible', false),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
  ])

  const { data: recentProducts } = await supabase
    .from('products')
    .select('id, name, price, is_visible')
    .order('created_at', { ascending: false })
    .limit(5)

  const hasProducts = (total ?? 0) > 0

  return (
    <AdminShell>

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
        </div>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 font-semibold px-4 py-2 rounded-lg text-sm text-white transition hover:opacity-90"
          style={{ background: '#0A2340' }}>
          <Plus size={15}/> Thêm sản phẩm
        </Link>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Tổng sản phẩm', value: total ?? 0,  icon: Package, iconBg: '#e8f4fd', iconColor: '#2e7fc1' },
          { label: 'Đang hiển thị', value: visible ?? 0, icon: Eye,     iconBg: '#edf7ed', iconColor: '#2e7d32' },
          { label: 'Đang ẩn',       value: hidden ?? 0,  icon: EyeOff,  iconBg: '#f5f5f5', iconColor: '#757575' },
          { label: 'Danh mục',      value: cats ?? 0,    icon: Layers,  iconBg: '#f3eef8', iconColor: '#7b3fa0' },
        ].map(({ label, value, icon: Icon, iconBg, iconColor }) => (
          <Link key={label} href="/admin/products"
            className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: iconBg }}>
                <Icon size={18} style={{ color: iconColor }}/>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 leading-none">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Body ── */}
      {!hasProducts ? (
        <div className="space-y-4">
          {/* CTA card */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center bg-slate-100">
              <Package size={24} className="text-slate-400"/>
            </div>
            <h3 className="font-semibold text-slate-700 text-base mb-1">Chưa có sản phẩm nào</h3>
            <p className="text-slate-400 text-sm mb-5">Thêm sản phẩm thủ công hoặc import hàng loạt từ Excel</p>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              <Link href="/admin/products/new"
                className="flex items-center justify-center gap-2 font-semibold px-5 py-2.5 rounded-lg text-sm text-white hover:opacity-90 transition"
                style={{ background: '#0A2340' }}>
                <Plus size={14}/> Thêm sản phẩm
              </Link>
              <Link href="/admin/import"
                className="flex items-center justify-center gap-2 font-semibold px-5 py-2.5 rounded-lg text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                <FileUp size={14}/> Import Excel
              </Link>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Thêm sản phẩm', desc: 'Tạo mới',     icon: Plus,     href: '/admin/products/new' },
              { label: 'Import Excel',  desc: 'Hàng loạt',   icon: FileUp,   href: '/admin/import' },
              { label: 'Cài đặt shop', desc: 'Cấu hình',     icon: Settings, href: '/admin/settings' },
            ].map(({ label, desc, icon: Icon, href }) => (
              <Link key={href} href={href}
                className="bg-white rounded-xl border border-slate-200 px-4 py-3.5 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-slate-500"/>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">{label}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
                <ArrowRight size={13} className="ml-auto text-slate-300 group-hover:text-slate-500 transition shrink-0"/>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Quick actions */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Thao tác</p>
            {[
              { label: 'Thêm sản phẩm mới', desc: 'Tạo một sản phẩm',   icon: Plus,     href: '/admin/products/new' },
              { label: 'Import từ Excel',    desc: 'Nhập hàng loạt',     icon: FileUp,   href: '/admin/import' },
              { label: 'Cài đặt shop',       desc: 'Tên, SĐT, địa chỉ', icon: Settings, href: '/admin/settings' },
            ].map(({ label, desc, icon: Icon, href }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:bg-slate-50 hover:border-slate-300 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-slate-500"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700">{label}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
                <ArrowRight size={13} className="text-slate-300 group-hover:text-slate-500 shrink-0 transition"/>
              </Link>
            ))}
          </div>

          {/* Recent products */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mới nhất</p>
              <Link href="/admin/products"
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition">
                Xem tất cả →
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-100">
                  {recentProducts?.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-700 line-clamp-1 text-sm">{p.name}</p>
                      </td>
                      <td className="px-4 py-3 text-right w-32">
                        {p.price > 0
                          ? <span className="text-sm font-semibold text-slate-700">
                              {new Intl.NumberFormat('vi-VN').format(p.price)}đ
                            </span>
                          : <span className="text-xs italic text-slate-400">Liên hệ</span>}
                      </td>
                      <td className="px-4 py-3 w-20 text-right">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          p.is_visible
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${p.is_visible ? 'bg-emerald-500' : 'bg-slate-400'}`}/>
                          {p.is_visible ? 'Hiện' : 'Ẩn'}
                        </span>
                      </td>
                      <td className="px-4 py-3 w-12 text-right">
                        <Link href={`/admin/products/${p.id}`}
                          className="text-xs font-medium text-slate-500 hover:text-slate-800 transition">
                          Sửa
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
