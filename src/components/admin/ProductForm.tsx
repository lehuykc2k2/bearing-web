'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Plus, Trash2, ImageIcon, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { Category, Product, ProductVariant } from '@/types'

interface Props { categories: Category[]; product?: Product }

function toSlug(text: string) {
  return text.toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a').replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i').replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u').replace(/[ỳýỵỷỹ]/g, 'y').replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-') + '-' + Date.now()
}

const INPUT = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0BADE8] focus:ring-1 focus:ring-[#0BADE8]/20 transition bg-white text-slate-800 placeholder-slate-400"
const LABEL = "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5"

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
        <h3 className="text-sm font-bold text-slate-700">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

export default function ProductForm({ categories, product }: Props) {
  const router = useRouter()
  const isEdit = !!product

  const [name,        setName]        = useState(product?.name ?? '')
  const [categoryId,  setCategoryId]  = useState(product?.category_id ?? '')
  const [shortDesc,   setShortDesc]   = useState(product?.short_description ?? '')
  const [description, setDesc]        = useState(product?.description ?? '')
  const [images,      setImages]      = useState<string[]>(
    product?.images?.length
      ? product.images
      : product?.image_url ? [product.image_url] : []
  )
  const [isVisible,   setIsVisible]   = useState(product?.is_visible ?? true)
  const [sortOrder,   setSortOrder]   = useState(product?.sort_order?.toString() ?? '0')
  const [maSP,        setMaSP]        = useState(product?.ma_san_pham ?? '')
  const [maVB,        setMaVB]        = useState(product?.ma_vong_bi ?? '')
  const [dkTrong,     setDkTrong]     = useState(product?.duong_kinh_trong?.toString() ?? '')
  const [dkNgoai,     setDkNgoai]     = useState(product?.duong_kinh_ngoai?.toString() ?? '')
  const [chieuDay,    setChieuDay]    = useState(product?.chieu_day?.toString() ?? '')
  const [price,       setPrice]       = useState(product?.price?.toString() ?? '0')
  const [variants,    setVariants]    = useState<ProductVariant[]>(product?.variants ?? [])
  const [uploading,   setUploading]   = useState(false)
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState('')

  async function uploadImages(files: FileList) {
    setUploading(true); setError('')
    const supabase = createClient()
    const urls: string[] = []
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: upErr } = await supabase.storage.from('products').upload(path, file, { upsert: true })
      if (upErr) { setError('Upload ảnh thất bại'); setUploading(false); return }
      const { data } = supabase.storage.from('products').getPublicUrl(path)
      urls.push(data.publicUrl)
    }
    setImages(prev => [...prev, ...urls])
    setUploading(false)
  }

  function removeImage(index: number) {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  function addVariant()    { setVariants(v => [...v, { thuong_hieu: '', gia: 0, ton_kho: '' }]) }
  function removeVariant(i: number) { setVariants(v => v.filter((_, idx) => idx !== i)) }
  function updateVariant(i: number, field: keyof ProductVariant, value: string | number) {
    setVariants(v => v.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Tên sản phẩm không được để trống'); return }
    setSaving(true); setError('')
    const payload = {
      name: name.trim(),
      slug: isEdit ? product!.slug : toSlug(name),
      price: parseInt(price) || 0,
      short_description: shortDesc.trim(),
      description: description.trim(),
      category_id: categoryId || null,
      image_url: images[0] ?? '',
      images,
      is_visible: isVisible,
      sort_order: parseInt(sortOrder) || 0,
      ma_san_pham: maSP.trim(),
      ma_vong_bi: maVB.trim(),
      duong_kinh_trong: dkTrong ? parseFloat(dkTrong) : null,
      duong_kinh_ngoai: dkNgoai ? parseFloat(dkNgoai) : null,
      chieu_day: chieuDay ? parseFloat(chieuDay) : null,
      variants: variants.filter(v => v.thuong_hieu.trim()),
    }
    const supabase = createClient()
    const { error: err } = isEdit
      ? await supabase.from('products').update(payload).eq('id', product!.id)
      : await supabase.from('products').insert(payload)
    if (err) { setError('Lưu thất bại: ' + err.message); setSaving(false); return }
    router.push('/admin/products'); router.refresh()
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Layout 2 cột */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* ── Cột trái (nội dung chính) ── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Tên sản phẩm */}
          <Card title="Thông tin cơ bản">
            <div className="space-y-3">
              <div>
                <label className={LABEL}>Tên sản phẩm *</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)}
                  className={INPUT} placeholder="VD: Vòng bi 6205 NSK"/>
              </div>
              <div>
                <label className={LABEL}>Mô tả ngắn</label>
                <input type="text" value={shortDesc} onChange={e => setShortDesc(e.target.value)}
                  className={INPUT} placeholder="1–2 dòng tóm tắt hiển thị trên card"/>
              </div>
              <div>
                <label className={LABEL}>Mô tả chi tiết</label>
                <textarea rows={4} value={description} onChange={e => setDesc(e.target.value)}
                  className={INPUT + ' resize-y'} placeholder="Ứng dụng, tiêu chuẩn, thông số thêm..."/>
              </div>
            </div>
          </Card>

          {/* Thông số kỹ thuật */}
          <Card title="Thông số kỹ thuật">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className={LABEL}>Mã SP</label>
                <input type="text" value={maSP} onChange={e => setMaSP(e.target.value)}
                  className={INPUT} placeholder="VB001"/>
              </div>
              <div>
                <label className={LABEL}>Mã vòng bi</label>
                <input type="text" value={maVB} onChange={e => setMaVB(e.target.value)}
                  className={INPUT} placeholder="6205"/>
              </div>
              <div>
                <label className={LABEL}>ĐK trong (mm)</label>
                <input type="number" value={dkTrong} onChange={e => setDkTrong(e.target.value)}
                  className={INPUT} placeholder="25"/>
              </div>
              <div>
                <label className={LABEL}>ĐK ngoài (mm)</label>
                <input type="number" value={dkNgoai} onChange={e => setDkNgoai(e.target.value)}
                  className={INPUT} placeholder="52"/>
              </div>
              <div>
                <label className={LABEL}>Chiều dày (mm)</label>
                <input type="number" value={chieuDay} onChange={e => setChieuDay(e.target.value)}
                  className={INPUT} placeholder="15"/>
              </div>
            </div>
          </Card>

          {/* Biến thể */}
          <Card title="Biến thể theo thương hiệu">
            {variants.length === 0 ? (
              <p className="text-sm text-slate-400 mb-3">
                Nếu sản phẩm có nhiều thương hiệu (NSK, SKF, FAG...) với giá khác nhau, thêm biến thể tại đây.
              </p>
            ) : (
              <div className="mb-3">
                <div className="grid grid-cols-[1fr_110px_120px_36px] gap-2 px-1 mb-1.5">
                  <span className="text-xs font-semibold text-slate-400">Thương hiệu</span>
                  <span className="text-xs font-semibold text-slate-400">Giá (VND)</span>
                  <span className="text-xs font-semibold text-slate-400">Tồn kho</span>
                </div>
                <div className="space-y-2">
                  {variants.map((v, i) => (
                    <div key={i} className="grid grid-cols-[1fr_110px_120px_36px] gap-2 items-center bg-slate-50 rounded-lg px-2.5 py-2">
                      <input type="text" value={v.thuong_hieu}
                        onChange={e => updateVariant(i, 'thuong_hieu', e.target.value)}
                        className={INPUT} placeholder="NSK, SKF, FAG..."/>
                      <input type="number" min="0" value={v.gia || ''}
                        onChange={e => updateVariant(i, 'gia', parseInt(e.target.value) || 0)}
                        className={INPUT} placeholder="35000"/>
                      <input type="text" value={v.ton_kho}
                        onChange={e => updateVariant(i, 'ton_kho', e.target.value)}
                        className={INPUT} placeholder="100"/>
                      <button type="button" onClick={() => removeVariant(i)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition border border-transparent hover:border-red-100">
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button type="button" onClick={addVariant}
              className="flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg border border-dashed transition hover:bg-slate-50"
              style={{ borderColor: '#b8d9ee', color: '#0BADE8' }}>
              <Plus size={15}/> Thêm biến thể
            </button>
          </Card>
        </div>

        {/* ── Cột phải (settings) ── */}
        <div className="w-full lg:w-64 xl:w-72 space-y-4 shrink-0">

          {/* Ảnh */}
          <Card title="Ảnh sản phẩm">
            <div className="space-y-3">
              {/* Preview ảnh đầu tiên */}
              <div className="w-full aspect-square rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-50 relative">
                {images[0] ? (
                  <Image src={images[0]} alt="preview" fill className="object-contain p-3" sizes="280px"/>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-300">
                    <ImageIcon size={32}/>
                    <span className="text-xs">Chưa có ảnh</span>
                  </div>
                )}
              </div>

              {/* Grid thumbnail các ảnh phụ */}
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-1.5">
                  {images.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-md overflow-hidden border border-slate-200 group">
                      <Image src={url} alt={`ảnh ${i + 1}`} fill className="object-contain p-1" sizes="70px"/>
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <X size={10}/>
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-0.5 left-0.5 text-[9px] bg-black/60 text-white px-1 rounded">Chính</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <label className="flex items-center justify-center gap-2 w-full py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer transition">
                <input type="file" accept="image/*" multiple className="hidden"
                  onChange={e => e.target.files?.length && uploadImages(e.target.files)}/>
                {uploading ? 'Đang upload...' : images.length > 0 ? 'Thêm ảnh' : 'Chọn ảnh'}
              </label>
            </div>
          </Card>

          {/* Phân loại & Giá */}
          <Card title="Phân loại & Giá">
            <div className="space-y-3">
              <div>
                <label className={LABEL}>Danh mục</label>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
                  className={INPUT + ' bg-white'}>
                  <option value="">— Chọn danh mục —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              {variants.length === 0 && (
                <div>
                  <label className={LABEL}>Giá (VND)</label>
                  <input type="number" min="0" value={price} onChange={e => setPrice(e.target.value)}
                    className={INPUT} placeholder="0 = Liên hệ"/>
                </div>
              )}
              {variants.length > 0 && (
                <p className="text-xs text-slate-400 italic">Giá lấy từ biến thể</p>
              )}
            </div>
          </Card>

          {/* Cài đặt */}
          <Card title="Cài đặt">
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" checked={isVisible} onChange={e => setIsVisible(e.target.checked)}
                    className="sr-only peer"/>
                  <div className="w-10 h-5 rounded-full transition peer-checked:bg-[#0BADE8] bg-slate-200"/>
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition peer-checked:translate-x-5"/>
                </div>
                <span className="text-sm text-slate-700">Hiển thị cho khách</span>
              </label>
              <div>
                <label className={LABEL}>Thứ tự ưu tiên</label>
                <input type="number" min="0" value={sortOrder} onChange={e => setSortOrder(e.target.value)}
                  className={INPUT} placeholder="0"/>
                <p className="text-xs text-slate-400 mt-1">Số nhỏ hơn = hiển thị trước</p>
              </div>
            </div>
          </Card>

          {/* Action buttons */}
          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
          <div className="flex flex-col gap-2">
            <button type="submit" disabled={saving || uploading}
              className="w-full text-white font-bold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-60 text-sm"
              style={{ background: '#0BADE8' }}>
              {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
            </button>
            <button type="button" onClick={() => router.back()}
              className="w-full border border-slate-200 text-slate-600 font-medium py-2.5 rounded-lg hover:bg-slate-50 transition text-sm">
              Huỷ
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
