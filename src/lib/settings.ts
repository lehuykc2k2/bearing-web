import { createServerSupabase } from './supabase-server'
import type { Settings } from '@/types'

const emptySettings: Settings = {
  shop_name: '',
  company_name: '',
  slogan: '',
  company_description: '',
  phone: '',
  email: '',
  tax_code: '',
  address: '',
  business_hours: '',
  zalo: '',
  facebook: '',
  messenger: '',
  banner_title: '',
  banner_sub: '',
}

export async function getSettings(): Promise<Settings> {
  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase.from('settings').select('key, value')
    if (error || !data?.length) return emptySettings

    const map: Record<string, string> = {}
    data.forEach(({ key, value }) => { map[key] = value ?? '' })

    return {
      shop_name: map.shop_name ?? '',
      company_name: map.company_name ?? '',
      slogan: map.slogan ?? '',
      company_description: map.company_description ?? '',
      banner_title: map.banner_title ?? '',
      banner_sub: map.banner_sub ?? '',
      phone: map.phone ?? '',
      email: map.email ?? '',
      tax_code: map.tax_code ?? '',
      zalo: map.zalo ?? '',
      address: map.address ?? '',
      business_hours: map.business_hours ?? '',
      facebook: map.facebook ?? '',
      messenger: map.messenger ?? '',
    }
  } catch {
    return emptySettings
  }
}
