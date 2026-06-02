import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import AdminShell from '@/components/admin/AdminShell'
import ImportForm from './ImportForm'

export default async function ImportPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <AdminShell>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-800">Import Excel</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Thêm / cập nhật hàng loạt từ file{' '}
          <code className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-xs">.xlsx</code>.
          Chỉ cần cột{' '}
          <code className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-xs">ten_san_pham</code>,
          mọi trường còn lại tuỳ chọn.
        </p>
      </div>
      <ImportForm />
    </AdminShell>
  )
}
