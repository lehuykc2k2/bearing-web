'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { CheckCircle, AlertCircle, Save } from 'lucide-react'

const SECTIONS = [
  {
    title: 'Thông tin shop',
    fields: [
      { key: 'shop_name',    label: 'Tên shop',       placeholder: 'VD: D&X Bearings', span: 1 },
      { key: 'slogan',       label: 'Slogan',          placeholder: 'More Stable – More Efficient', span: 1 },
    ],
  },
  {
    title: 'Banner trang chủ',
    fields: [
      { key: 'banner_title', label: 'Tiêu đề lớn',    placeholder: 'D&X Rolling Bearings', span: 2 },
      { key: 'banner_sub',   label: 'Phụ đề',          placeholder: 'Chuyên cung cấp vòng bi chính hãng...', span: 2 },
    ],
  },
  {
    title: 'Liên hệ',
    fields: [
      { key: 'phone',     label: 'Số điện thoại',  placeholder: '0909 000 000', span: 1 },
      { key: 'zalo',      label: 'Zalo (số ĐT)',   placeholder: '0909000000',   span: 1 },
      { key: 'address',   label: 'Địa chỉ',        placeholder: '123 Đường ABC, Quận 1, TP.HCM', span: 2 },
    ],
  },
  {
    title: 'Mạng xã hội',
    fields: [
      { key: 'facebook',  label: 'Link Facebook',  placeholder: 'https://facebook.com/...', span: 1 },
      { key: 'messenger', label: 'Link Messenger', placeholder: 'https://m.me/ten-trang',   span: 1 },
    ],
  },
]

const INPUT = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0BADE8] transition bg-white"

export default function SettingsForm({ initialValues }: { initialValues: Record<string, string> }) {
  const [values,  setValues]  = useState<Record<string, string>>(initialValues)
  const [saving,  setSaving]  = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  function set(key: string, value: string) {
    setValues(v => ({ ...v, [key]: value }))
    setSuccess(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(''); setSuccess(false)
    const supabase = createClient()
    const upserts = Object.entries(values).map(([key, value]) => ({ key, value }))
    const { error: err } = await supabase.from('settings').upsert(upserts, { onConflict: 'key' })
    if (err) setError('Lưu thất bại: ' + err.message)
    else setSuccess(true)
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {SECTIONS.map(({ title, fields }) => (
        <div key={title} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2"
            style={{ background: '#f8fafc' }}>
            <span className="w-1 h-4 rounded-full" style={{ background: '#0BADE8' }}/>
            <h3 className="text-sm font-bold" style={{ color: '#0A2340' }}>{title}</h3>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4">
            {fields.map(({ key, label, placeholder, span }) => (
              <div key={key} className={span === 2 ? 'col-span-2' : 'col-span-2 sm:col-span-1'}>
                <label className="block text-xs font-semibold mb-1.5 text-slate-500 uppercase tracking-wide">
                  {label}
                </label>
                <input
                  type="text"
                  value={values[key] ?? ''}
                  onChange={e => set(key, e.target.value)}
                  placeholder={placeholder}
                  className={INPUT}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          <AlertCircle size={15}/> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-green-700"
          style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <CheckCircle size={15}/> Đã lưu thành công!
        </div>
      )}

      <button type="submit" disabled={saving}
        className="flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-60 text-sm"
        style={{ background: '#0BADE8' }}>
        <Save size={15}/>
        {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
      </button>
    </form>
  )
}
