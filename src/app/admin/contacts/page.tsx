import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import AdminShell from '@/components/admin/AdminShell'
import ContactsManager from './ContactsManager'
import type { SalesContact } from '@/types'

export default async function ContactsPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data } = await supabase
    .from('sales_contacts')
    .select('*')
    .order('sort_order')

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">Nhân viên kinh doanh</h1>
        <p className="text-sm text-slate-400 mt-1">Quản lý danh sách nhân viên hiển thị trong popup liên hệ trên website.</p>
      </div>
      <ContactsManager initialContacts={(data ?? []) as SalesContact[]} />
    </AdminShell>
  )
}
