'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { X, Phone, MessageCircle, Package, Clock, Save } from 'lucide-react'

export const STATUS_OPTIONS = [
  { value: 'new',        label: 'Mới',           bg: '#EBF8FE', color: '#0BADE8' },
  { value: 'contacted',  label: 'Đã liên hệ',    bg: '#FFF7E8', color: '#d97706' },
  { value: 'consulting', label: 'Đang tư vấn',   bg: '#f3e8ff', color: '#7c3aed' },
  { value: 'quoted',     label: 'Đã báo giá',    bg: '#e0f2fe', color: '#0369a1' },
  { value: 'done',       label: 'Chốt đơn ✓',    bg: '#edf7ed', color: '#2e7d32' },
  { value: 'skipped',    label: 'Bỏ qua',        bg: '#f5f5f5', color: '#757575' },
]

export interface Quote {
  id: string
  name: string
  phone: string
  product_name?: string | null
  message?: string | null
  status: string
  notes?: string | null
  created_at: string
}

function QuoteModal({ quote, onClose }: { quote: Quote; onClose: () => void }) {
  const router = useRouter()
  const [status, setStatus]         = useState(quote.status)
  const [notes, setNotes]           = useState(quote.notes ?? '')
  const [isPending, startTransition] = useTransition()
  const [saveState, setSaveState] = useState<'idle' | 'ok' | 'err'>('idle')
  const [errMsg, setErrMsg]       = useState('')

  function save() {
    setSaveState('idle')
    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase
        .from('quote_requests')
        .update({ status, notes: notes || null })
        .eq('id', quote.id)
      if (error) {
        setErrMsg(error.message)
        setSaveState('err')
      } else {
        setSaveState('ok')
        setTimeout(() => setSaveState('idle'), 2500)
        router.refresh()
      }
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(6,26,48,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100"
          style={{ background: 'linear-gradient(90deg,#EBF8FE 0%,#f8fcfe 100%)' }}>
          <div>
            <h3 className="font-extrabold text-base" style={{ color: '#0A2340' }}>{quote.name}</h3>
            <a href={`tel:${quote.phone.replace(/\s/g, '')}`}
              className="text-sm font-medium hover:underline" style={{ color: '#0BADE8' }}>
              {quote.phone}
            </a>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition text-slate-400">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Thông tin yêu cầu */}
          <div className="flex flex-col gap-2">
            {quote.product_name && (
              <div className="flex items-start gap-2.5 text-sm">
                <Package size={15} className="mt-0.5 shrink-0" style={{ color: '#0BADE8' }} />
                <span className="text-slate-700">{quote.product_name}</span>
              </div>
            )}
            {quote.message && (
              <div className="flex items-start gap-2.5 text-sm">
                <MessageCircle size={15} className="mt-0.5 shrink-0 text-slate-400" />
                <span className="text-slate-500 leading-relaxed">{quote.message}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock size={13} />
              {new Date(quote.created_at).toLocaleString('vi-VN', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </div>
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#0A2340' }}>
              Trạng thái
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setStatus(opt.value)}
                  className="py-2 px-2 rounded-lg text-xs font-bold border-2 transition"
                  style={status === opt.value
                    ? { background: opt.bg, color: opt.color, borderColor: opt.color }
                    : { background: '#f8fafc', color: '#94a3b8', borderColor: 'transparent' }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#0A2340' }}>
              Ghi chú nội bộ
            </label>
            <textarea
              value={notes} onChange={e => setNotes(e.target.value)}
              rows={3} placeholder="Ghi chú cuộc gọi, yêu cầu đặc biệt, lý do bỏ qua..."
              className="w-full px-3.5 py-2.5 rounded-lg text-sm border resize-none focus:outline-none transition"
              style={{ borderColor: '#cfe7f1', background: '#f8fcfe', color: '#0A2340' }}
              onFocus={e => e.target.style.borderColor = '#0BADE8'}
              onBlur={e => e.target.style.borderColor = '#cfe7f1'}
            />
          </div>

          {/* Save / Close */}
          <div className="flex flex-col gap-2">
            {saveState === 'err' && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                ⚠ Lỗi: {errMsg}. Hãy chắc đã chạy migration SQL thêm cột <code>notes</code>.
              </p>
            )}
            <div className="flex gap-3">
              <button onClick={onClose}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                Đóng
              </button>
              <button onClick={save} disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-white transition hover:brightness-105 disabled:opacity-60"
                style={{ background: saveState === 'ok' ? '#2e7d32' : 'linear-gradient(135deg,#0BADE8 0%,#087fb5 100%)' }}>
                <Save size={14} />
                {saveState === 'ok' ? 'Đã lưu!' : isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>

          {/* Quick contact */}
          <div className="flex gap-2 border-t border-slate-100 pt-4">
            <a href={`tel:${quote.phone.replace(/\s/g, '')}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-white"
              style={{ background: '#0A2340' }}>
              <Phone size={13} /> Gọi ngay
            </a>
            <a href={`https://zalo.me/${quote.phone.replace(/\D/g, '')}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-white"
              style={{ background: '#0068FF' }}>
              <MessageCircle size={13} /> Nhắn Zalo
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export function QuotesTable({ quotes }: { quotes: Quote[] }) {
  const [active, setActive]     = useState<string>('all')
  const [openQuote, setOpenQuote] = useState<Quote | null>(null)

  const filtered = active === 'all' ? quotes : quotes.filter(q => q.status === active)

  const counts: Record<string, number> = { all: quotes.length }
  STATUS_OPTIONS.forEach(o => { counts[o.value] = quotes.filter(q => q.status === o.value).length })

  return (
    <>
      {/* Filter tabs */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        {[{ value: 'all', label: 'Tất cả', bg: '#0A2340', color: 'white' }, ...STATUS_OPTIONS].map(opt => {
          const isActive = active === opt.value
          const cnt = counts[opt.value] ?? 0
          return (
            <button key={opt.value} onClick={() => setActive(opt.value)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition"
              style={isActive
                ? { background: opt.bg ?? opt.color, color: opt.color === 'white' ? 'white' : opt.bg }
                : { background: '#f1f5f9', color: '#64748b' }}>
              {opt.label}
              <span className="text-[10px] font-black opacity-70">{cnt}</span>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-12 text-center text-sm text-slate-400">
          Không có yêu cầu nào trong mục này.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <th className="text-left px-4 py-3">Khách hàng</th>
                  <th className="text-left px-4 py-3">Sản phẩm</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Nội dung</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Ghi chú</th>
                  <th className="text-left px-4 py-3">Trạng thái</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(q => {
                  const opt = STATUS_OPTIONS.find(o => o.value === q.status) ?? STATUS_OPTIONS[0]
                  return (
                    <tr key={q.id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setOpenQuote(q)}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800">{q.name}</p>
                        <p className="text-xs text-sky-600">{q.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-slate-600 text-xs line-clamp-2 max-w-[160px]">
                          {q.product_name ?? <span className="italic text-slate-300">—</span>}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-slate-400 text-xs line-clamp-2 max-w-[180px]">
                          {q.message ?? <span className="italic">—</span>}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <p className="text-slate-400 text-xs line-clamp-2 max-w-[160px]">
                          {q.notes ?? <span className="italic">—</span>}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ background: opt.bg, color: opt.color }}>
                          {opt.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <p className="text-xs text-slate-400">
                          {new Date(q.created_at).toLocaleString('vi-VN', {
                            day: '2-digit', month: '2-digit',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </p>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {openQuote && (
        <QuoteModal
          quote={openQuote}
          onClose={() => setOpenQuote(null)}
        />
      )}
    </>
  )
}
