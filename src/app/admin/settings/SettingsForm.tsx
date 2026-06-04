'use client'
import { useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase'
import {
  AlertCircle,
  Building2,
  CheckCircle,
  ImageIcon,
  Phone,
  Save,
  Share2,
  type LucideIcon,
} from 'lucide-react'

type SettingField = {
  key: string
  label: string
  placeholder: string
  span?: 1 | 2
  multiline?: boolean
}

type SettingSection = {
  title: string
  icon: LucideIcon
  fields: SettingField[]
}

const SECTIONS: SettingSection[] = [
  {
    title: 'Thông tin công ty',
    icon: Building2,
    fields: [
      { key: 'shop_name', label: 'Tên thương hiệu', placeholder: 'VD: D&X Bearings' },
      { key: 'company_name', label: 'Tên công ty', placeholder: 'VD: CÔNG TY TNHH THƯƠNG MẠI & KỸ THUẬT HD VIETNAM' },
      { key: 'slogan', label: 'Slogan', placeholder: 'More Stable - More Efficient', span: 2 },
      { key: 'company_description', label: 'Mô tả công ty', placeholder: 'Chuyên kinh doanh và phân phối các thiết bị công nghiệp...', span: 2, multiline: true },
    ],
  },
  {
    title: 'Banner trang chủ',
    icon: ImageIcon,
    fields: [
      { key: 'banner_title', label: 'Tiêu đề lớn', placeholder: 'D&X Rolling Bearings' },
      { key: 'banner_sub', label: 'Phụ đề', placeholder: 'Chuyên cung cấp vòng bi chính hãng...', multiline: true },
    ],
  },
  {
    title: 'Liên hệ',
    icon: Phone,
    fields: [
      { key: 'tax_code', label: 'Mã số thuế', placeholder: '0319139983' },
      { key: 'phone', label: 'Số điện thoại', placeholder: '0909 000 000' },
      { key: 'email', label: 'Email', placeholder: 'contact@domain.vn' },
      { key: 'zalo', label: 'Zalo', placeholder: '0909000000' },
      { key: 'business_hours', label: 'Giờ làm việc', placeholder: '8h-17h Thứ 2 - Thứ 7' },
      { key: 'address', label: 'Địa chỉ', placeholder: '123 Đường ABC, Quận 1, TP.HCM', multiline: true },
    ],
  },
  {
    title: 'Mạng xã hội',
    icon: Share2,
    fields: [
      { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
      { key: 'messenger', label: 'Messenger', placeholder: 'https://m.me/ten-trang' },
    ],
  },
]

const ALL_KEYS = SECTIONS.flatMap(section => section.fields.map(field => field.key))
const INPUT = 'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#0BADE8] focus:ring-2 focus:ring-sky-100 transition bg-white placeholder:text-slate-300'
const TEXTAREA = `${INPUT} min-h-20 resize-y leading-relaxed`

function normalizeInitialValues(initialValues: Record<string, string>) {
  return Object.fromEntries(ALL_KEYS.map(key => [key, initialValues[key] ?? '']))
}

export default function SettingsForm({ initialValues }: { initialValues: Record<string, string> }) {
  const normalizedInitialValues = useMemo(() => normalizeInitialValues(initialValues), [initialValues])
  const [values, setValues] = useState<Record<string, string>>(normalizedInitialValues)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function set(key: string, value: string) {
    setValues(v => ({ ...v, [key]: value }))
    setSuccess(false)
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    const supabase = createClient()
    const upserts = ALL_KEYS.map(key => ({ key, value: values[key] ?? '' }))
    const { error: err } = await supabase.from('settings').upsert(upserts, { onConflict: 'key' })

    if (err) setError('Lưu thất bại: ' + err.message)
    else setSuccess(true)
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white">
          <div>
            <h2 className="text-base font-bold text-slate-800">Thông tin hiển thị</h2>
            <p className="text-xs text-slate-400 mt-0.5">Tên shop, banner, liên hệ và mạng xã hội</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
            {(error || success) && (
              <div
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
                style={error
                  ? { background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c' }
                  : { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d' }}
              >
                {error ? <AlertCircle size={15} /> : <CheckCircle size={15} />}
                <span>{error || 'Đã lưu thành công!'}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 text-white font-bold px-5 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-60 text-sm"
              style={{ background: '#0BADE8' }}
            >
              <Save size={15} />
              {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {SECTIONS.map(({ title, icon: Icon, fields }) => (
            <section key={title} className="p-5 grid grid-cols-1 lg:grid-cols-[190px_minmax(0,1fr)] gap-4 lg:gap-6">
              <div className="flex items-center gap-3 lg:items-start">
                <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-sky-50 border border-sky-100 shrink-0">
                  <Icon size={17} style={{ color: '#0BADE8' }} />
                </span>
                <h3 className="text-sm font-bold text-slate-800 pt-0.5">{title}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {fields.map(({ key, label, placeholder, span, multiline }) => (
                  <div key={key} className={span === 2 ? 'md:col-span-2' : ''}>
                    <label className="block text-[11px] font-bold mb-1.5 text-slate-500 uppercase tracking-wide">
                      {label}
                    </label>
                    {multiline ? (
                      <textarea
                        value={values[key] ?? ''}
                        onChange={e => set(key, e.target.value)}
                        placeholder={placeholder}
                        className={TEXTAREA}
                      />
                    ) : (
                      <input
                        type="text"
                        value={values[key] ?? ''}
                        onChange={e => set(key, e.target.value)}
                        placeholder={placeholder}
                        className={INPUT}
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </form>
  )
}
