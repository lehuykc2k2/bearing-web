import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import * as XLSX from 'xlsx'

function toSlug(text: string): string {
  return text.toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')
}

function buildDescription(row: Record<string, unknown>): string {
  const parts: string[] = []
  if (row.ma_vong_bi)           parts.push(`Mã vòng bi: ${row.ma_vong_bi}`)
  if (row.thuong_hieu)          parts.push(`Thương hiệu: ${row.thuong_hieu}`)
  if (row.duong_kinh_trong_mm)  parts.push(`Đường kính trong: ${row.duong_kinh_trong_mm}mm`)
  if (row.duong_kinh_ngoai_mm)  parts.push(`Đường kính ngoài: ${row.duong_kinh_ngoai_mm}mm`)
  if (row.chieu_day_mm)         parts.push(`Chiều dày: ${row.chieu_day_mm}mm`)
  if (row.ton_kho !== undefined && row.ton_kho !== null && row.ton_kho !== '')
    parts.push(`Tồn kho: ${row.ton_kho}`)
  return parts.join('\n')
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'Không có file' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const wb = XLSX.read(buffer, { type: 'buffer' })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const raw = XLSX.utils.sheet_to_json(ws, { header: 1 }) as unknown[][]

  // Tìm dòng header (dòng có 'ten_san_pham')
  let headerIdx = -1
  for (let i = 0; i < raw.length; i++) {
    if (Array.isArray(raw[i]) && raw[i].includes('ten_san_pham')) {
      headerIdx = i
      break
    }
  }
  if (headerIdx === -1) {
    return NextResponse.json({ error: 'Không tìm thấy header. Đảm bảo file có cột "ten_san_pham".' }, { status: 400 })
  }

  const headers = raw[headerIdx] as string[]
  const dataRows = raw.slice(headerIdx + 1).filter(r => Array.isArray(r) && r.some(c => c !== null && c !== undefined && c !== ''))

  // Lấy danh mục hiện có
  const { data: existingCats } = await supabase.from('categories').select('id, name, slug')
  const catMap = new Map<string, string>((existingCats ?? []).map(c => [c.name.toLowerCase().trim(), c.id]))

  const results = { created: 0, updated: 0, skipped: 0, errors: [] as string[] }

  for (const rawRow of dataRows) {
    const row: Record<string, unknown> = {}
    headers.forEach((h, i) => { if (h) row[h] = (rawRow as unknown[])[i] })

    const name = String(row.ten_san_pham ?? '').trim()
    if (!name) { results.skipped++; continue }

    // Resolve/create category
    let categoryId: string | null = null
    const catName = String(row.loai_vong_bi ?? '').trim()
    if (catName) {
      const key = catName.toLowerCase()
      if (catMap.has(key)) {
        categoryId = catMap.get(key)!
      } else {
        const { data: newCat } = await supabase
          .from('categories')
          .insert({ name: catName, slug: toSlug(catName) + '-' + Date.now(), sort_order: 99 })
          .select('id').single()
        if (newCat) { categoryId = newCat.id; catMap.set(key, newCat.id) }
      }
    }

    const price     = Number(row.gia_le) || 0
    const isVisible = row.trang_thai === undefined ? true : Number(row.trang_thai) !== 0
    const sortOrder = Number(row.noi_bat) === 1 ? 0 : 10
    const imageUrl  = String(row.anh_1 ?? '').trim()
    const shortDesc = String(row.mo_ta_ngan ?? '').trim()
    const desc      = buildDescription(row)

    // Slug dựa trên tên + mã (nếu có)
    const slugBase = toSlug(name) + (row.ma_san_pham ? '-' + toSlug(String(row.ma_san_pham)) : '')

    // Kiểm tra product tồn tại theo slug prefix hoặc tên chính xác
    const { data: existing } = await supabase
      .from('products')
      .select('id, slug')
      .eq('name', name)
      .maybeSingle()

    const payload = {
      name,
      category_id:       categoryId,
      price,
      short_description: shortDesc,
      description:       desc,
      image_url:         imageUrl,
      is_visible:        isVisible,
      sort_order:        sortOrder,
    }

    if (existing) {
      const { error } = await supabase.from('products').update(payload).eq('id', existing.id)
      if (error) results.errors.push(`Lỗi cập nhật "${name}": ${error.message}`)
      else results.updated++
    } else {
      const slug = slugBase + '-' + Date.now()
      const { error } = await supabase.from('products').insert({ ...payload, slug })
      if (error) results.errors.push(`Lỗi tạo "${name}": ${error.message}`)
      else results.created++
    }
  }

  return NextResponse.json({ ...results, total: dataRows.length })
}
