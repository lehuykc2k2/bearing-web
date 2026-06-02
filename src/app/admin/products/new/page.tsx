import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase-server'
import AdminShell from '@/components/admin/AdminShell'
import ProductForm from '@/components/admin/ProductForm'
import { ChevronRight } from 'lucide-react'
import type { Category } from '@/types'

export default async function NewProductPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: categories } = await supabase.from('categories').select('*').order('sort_order')

  return (
    <AdminShell>
      <div className="mb-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
          <Link href="/admin/products" className="hover:text-[#0BADE8] transition">Sản phẩm</Link>
          <ChevronRight size={12}/>
          <span className="text-slate-600">Thêm mới</span>
        </nav>
        <h1 className="text-xl font-bold text-slate-800">Thêm sản phẩm mới</h1>
      </div>
      <ProductForm categories={(categories ?? []) as Category[]} />
    </AdminShell>
  )
}
