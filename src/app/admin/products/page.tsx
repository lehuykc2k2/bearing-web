import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase-server'
import AdminShell from '@/components/admin/AdminShell'
import BearingPlaceholder from '@/components/public/BearingPlaceholder'
import ProductsTable from './ProductsTable'
import { Plus } from 'lucide-react'
import type { Product } from '@/types'

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
        <ProductsTable products={products as Product[]} />
      )}
    </AdminShell>
  )
}
