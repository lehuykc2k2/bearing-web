import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import AdminShell from '@/components/admin/AdminShell'
import { MessageSquare } from 'lucide-react'
import { QuotesTable } from './QuoteActions'

export default async function AdminQuotesPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: quotes } = await supabase
    .from('quote_requests')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <AdminShell>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-800">Yêu cầu báo giá</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Click vào hàng để xem chi tiết, đổi trạng thái và ghi chú.
        </p>
      </div>

      {(quotes?.length ?? 0) === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
          <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center bg-slate-100">
            <MessageSquare size={24} className="text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-700 mb-1">Chưa có yêu cầu báo giá</h3>
          <p className="text-slate-400 text-sm">Khi khách hàng gửi form, sẽ xuất hiện ở đây.</p>
        </div>
      ) : (
        <QuotesTable quotes={quotes ?? []} />
      )}
    </AdminShell>
  )
}
