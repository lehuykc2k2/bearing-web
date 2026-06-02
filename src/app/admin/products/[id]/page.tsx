import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase-server'
import AdminShell from '@/components/admin/AdminShell'
import ProductForm from '@/components/admin/ProductForm'
import { ChevronRight } from 'lucide-react'
import type { Category, Product } from '@/types'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*, category:categories(id,name,slug,sort_order,created_at)').eq('id', id).single(),
    supabase.from('categories').select('*').order('sort_order'),
  ])

  if (!product) notFound()

  return (
    <AdminShell>
      <div className="mb-5">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
          <Link href="/admin/products" className="hover:text-[#0BADE8] transition">Sản phẩm</Link>
          <ChevronRight size={12}/>
          <span className="text-slate-600 line-clamp-1">{(product as Product).name}</span>
        </nav>
        <h1 className="text-xl font-bold text-slate-800 line-clamp-1">
          Sửa: {(product as Product).name}
        </h1>
      </div>
      <ProductForm
        categories={(categories ?? []) as Category[]}
        product={product as Product}
      />
    </AdminShell>
  )
}
