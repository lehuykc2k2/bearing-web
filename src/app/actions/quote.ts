'use server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function submitQuoteRequest(formData: FormData) {
  const name    = (formData.get('name') as string)?.trim()
  const phone   = (formData.get('phone') as string)?.trim()
  const message = (formData.get('message') as string)?.trim()
  const productId   = (formData.get('product_id') as string) || null
  const productName = (formData.get('product_name') as string)?.trim() || null

  if (!name)  return { success: false, error: 'Vui lòng nhập họ tên.' }
  if (!phone) return { success: false, error: 'Vui lòng nhập số điện thoại.' }
  if (!/^[0-9+\s\-()]{7,15}$/.test(phone)) return { success: false, error: 'Số điện thoại không hợp lệ.' }

  try {
    const supabase = await createServerSupabase()
    const { error } = await supabase.from('quote_requests').insert({
      name,
      phone,
      message: message || null,
      product_id: productId || null,
      product_name: productName || null,
    })
    if (error) throw error
    return { success: true, error: null }
  } catch {
    return { success: false, error: 'Có lỗi xảy ra, vui lòng thử lại.' }
  }
}
