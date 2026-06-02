'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'

function toSlug(text: string) {
  return text.toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a').replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i').replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u').replace(/[ỳýỵỷỹ]/g, 'y').replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

interface Category { id: string; name: string; slug: string; sort_order: number }

const INPUT = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0BADE8] focus:ring-1 focus:ring-[#0BADE8]/20 transition"
const LABEL = "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5"

export function CategoryFormModal({ editCategory }: { editCategory?: Category }) {
  const router = useRouter()
  const [open,      setOpen]      = useState(false)
  const [name,      setName]      = useState(editCategory?.name ?? '')
  const [slug,      setSlug]      = useState(editCategory?.slug ?? '')
  const [sortOrder, setSortOrder] = useState(editCategory?.sort_order?.toString() ?? '0')
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState('')

  function handleNameChange(v: string) {
    setName(v)
    if (!editCategory) setSlug(toSlug(v))
  }

  function handleOpen() {
    setName(editCategory?.name ?? '')
    setSlug(editCategory?.slug ?? '')
    setSortOrder(editCategory?.sort_order?.toString() ?? '0')
    setError('')
    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true); setError('')
    const supabase = createClient()
    const payload = {
      name:       name.trim(),
      slug:       slug.trim() || toSlug(name),
      sort_order: parseInt(sortOrder) || 0,
    }
    const { error: err } = editCategory
      ? await supabase.from('categories').update(payload).eq('id', editCategory.id)
      : await supabase.from('categories').insert(payload)
    if (err) { setError(err.message); setSaving(false); return }
    setOpen(false)
    router.refresh()
    setSaving(false)
  }

  return (
    <>
      {editCategory ? (
        <button onClick={handleOpen}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-100 transition">
          Sửa
        </button>
      ) : (
        <button onClick={handleOpen}
          className="flex items-center gap-2 text-white font-bold px-4 py-2 rounded-lg hover:opacity-90 transition text-sm"
          style={{ background: '#0BADE8' }}>
          <Plus size={15}/> Thêm mới
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-800">
                {editCategory ? 'Sửa danh mục' : 'Thêm danh mục'}
              </h2>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700 transition">
                <X size={18}/>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className={LABEL}>Tên danh mục *</label>
                <input type="text" required value={name} onChange={e => handleNameChange(e.target.value)}
                  className={INPUT} placeholder="VD: Vòng bi cầu" autoFocus/>
              </div>
              <div>
                <label className={LABEL}>Slug</label>
                <input type="text" value={slug} onChange={e => setSlug(e.target.value)}
                  className={INPUT + ' font-mono text-slate-500'} placeholder="vong-bi-cau"/>
                <p className="text-xs text-slate-400 mt-1">Tự động tạo từ tên, dùng trong URL lọc</p>
              </div>
              <div>
                <label className={LABEL}>Thứ tự hiển thị</label>
                <input type="number" min="0" value={sortOrder} onChange={e => setSortOrder(e.target.value)}
                  className={INPUT} placeholder="0"/>
                <p className="text-xs text-slate-400 mt-1">Số nhỏ hơn = hiển thị trước</p>
              </div>

              {error && (
                <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={saving}
                  className="flex-1 text-white font-bold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-60 text-sm"
                  style={{ background: '#0BADE8' }}>
                  {saving ? 'Đang lưu...' : editCategory ? 'Cập nhật' : 'Thêm'}
                </button>
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 border border-slate-200 text-slate-600 font-medium py-2.5 rounded-lg hover:bg-slate-50 transition text-sm">
                  Huỷ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`Xóa danh mục "${name}"?\nCác sản phẩm thuộc danh mục này sẽ không còn danh mục.`)) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('categories').delete().eq('id', id)
    router.refresh()
    setLoading(false)
  }

  return (
    <button onClick={handleDelete} disabled={loading}
      className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-100 text-red-500 hover:bg-red-50 transition disabled:opacity-50">
      {loading ? '...' : 'Xóa'}
    </button>
  )
}
