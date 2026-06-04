import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import AdminShell from '@/components/admin/AdminShell'
import SettingsForm from './SettingsForm'

export default async function AdminSettingsPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data } = await supabase.from('settings').select('key, value')
  const map: Record<string, string> = {}
  data?.forEach(({ key, value }) => { map[key] = value })

  return (
    <AdminShell>
      <div className="max-w-6xl">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-slate-800">Cài đặt shop</h1>
          <p className="text-sm text-slate-400 mt-0.5">Thay đổi hiển thị ngay trên trang khách hàng</p>
        </div>
        <SettingsForm initialValues={map} />
      </div>
    </AdminShell>
  )
}
