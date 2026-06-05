'use client'
import { useState } from 'react'
import { Plus, Trash2, Save, GripVertical } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { SalesContact } from '@/types'

const INPUT = 'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0BADE8] focus:ring-1 focus:ring-sky-100 transition bg-white text-slate-800 placeholder-slate-400'
const LABEL = 'block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1'

type Draft = Omit<SalesContact, 'created_at'>

function emptyContact(order: number): Draft {
  return { id: crypto.randomUUID(), name: '', phone: '', zalo: '', role: 'Kinh doanh', sort_order: order, is_active: true }
}

export default function ContactsManager({ initialContacts }: { initialContacts: SalesContact[] }) {
  const [contacts, setContacts] = useState<Draft[]>(initialContacts)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function add() { setContacts(v => [...v, emptyContact(v.length + 1)]); setSuccess(false) }
  function remove(id: string) { setContacts(v => v.filter(c => c.id !== id)); setSuccess(false) }
  function update(id: string, field: keyof Draft, value: string | number | boolean) {
    setContacts(v => v.map(c => c.id === id ? { ...c, [field]: value } : c))
    setSuccess(false)
  }

  async function save() {
    setSaving(true); setError(''); setSuccess(false)
    const supabase = createClient()
    const toUpsert = contacts.map((c, i) => ({ ...c, sort_order: i + 1 }))
    const toDelete = initialContacts.filter(orig => !contacts.find(c => c.id === orig.id)).map(c => c.id)
    const [{ error: upErr }, { error: delErr }] = await Promise.all([
      supabase.from('sales_contacts').upsert(toUpsert, { onConflict: 'id' }),
      toDelete.length ? supabase.from('sales_contacts').delete().in('id', toDelete) : Promise.resolve({ error: null }),
    ])
    if (upErr || delErr) setError('Lưu thất bại: ' + (upErr?.message ?? delErr?.message))
    else setSuccess(true)
    setSaving(false)
  }

  return (
    <div className="max-w-2xl space-y-4">

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-700">Danh sách nhân viên</h3>
          <span className="text-xs text-slate-400">{contacts.length} nhân viên</span>
        </div>

        {contacts.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-sm text-slate-400">Chưa có nhân viên nào. Bấm "Thêm" để bắt đầu.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {contacts.map((c, i) => (
              <div key={c.id} className="p-4 space-y-3">

                {/* Hàng trên: số thứ tự + tên + toggle + xóa */}
                <div className="flex items-center gap-2">
                  <GripVertical size={14} className="text-slate-300 shrink-0" />
                  <span className="text-[11px] font-bold text-slate-400 shrink-0">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <label className={LABEL}>Tên hiển thị *</label>
                    <input
                      value={c.name}
                      onChange={e => update(c.id, 'name', e.target.value)}
                      className={INPUT}
                      placeholder="VD: Anh Huy, Chị Linh..."
                    />
                  </div>
                  <div className="shrink-0 flex flex-col items-center gap-1 pt-5">
                    <label className="cursor-pointer" title={c.is_active ? 'Đang trực — hiển thị trên website' : 'Nghỉ phép — ẩn khỏi website'}>
                      <div className="relative">
                        <input type="checkbox" checked={c.is_active}
                          onChange={e => update(c.id, 'is_active', e.target.checked)} className="sr-only peer" />
                        <div className="w-9 h-5 rounded-full transition peer-checked:bg-emerald-500 bg-slate-200" />
                        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition peer-checked:translate-x-4" />
                      </div>
                    </label>
                    <span className="text-[9px] font-semibold text-center leading-tight" style={{ color: c.is_active ? '#10b981' : '#f59e0b' }}>
                      {c.is_active ? 'Đang\ntrực' : 'Nghỉ\nphép'}
                    </span>
                  </div>
                  <button onClick={() => remove(c.id)}
                    className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition mt-5">
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Hàng dưới: vai trò + phone + zalo */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-6">
                  <div>
                    <label className={LABEL}>Vai trò</label>
                    <select value={c.role} onChange={e => update(c.id, 'role', e.target.value)}
                      className={INPUT + ' bg-white'}>
                      <option>Kinh doanh</option>
                      <option>Kỹ thuật</option>
                      <option>Chăm sóc KH</option>
                      <option>Quản lý</option>
                    </select>
                  </div>
                  <div>
                    <label className={LABEL}>Số điện thoại</label>
                    <input value={c.phone} onChange={e => update(c.id, 'phone', e.target.value)}
                      className={INPUT} placeholder="0977 209 391" type="tel" />
                  </div>
                  <div>
                    <label className={LABEL}>Zalo</label>
                    <input value={c.zalo} onChange={e => update(c.id, 'zalo', e.target.value)}
                      className={INPUT} placeholder="Số Zalo (bỏ trống nếu không có)" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={add}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border border-dashed border-slate-300 text-slate-600 hover:bg-slate-50 transition">
          <Plus size={15} /> Thêm nhân viên
        </button>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 text-sm font-bold px-5 py-2 rounded-lg text-white transition disabled:opacity-60 hover:opacity-90"
          style={{ background: '#0BADE8' }}>
          <Save size={14} /> {saving ? 'Đang lưu...' : 'Lưu tất cả'}
        </button>
        {success && <span className="text-sm font-semibold text-emerald-600">✓ Đã lưu</span>}
        {error   && <span className="text-sm text-red-500">{error}</span>}
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"/>
          <b className="text-slate-600">Đang trực</b> — hiển thị trên website
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"/>
          <b className="text-slate-600">Nghỉ phép</b> — ẩn khỏi website, dữ liệu vẫn giữ
        </span>
      </div>
    </div>
  )
}
