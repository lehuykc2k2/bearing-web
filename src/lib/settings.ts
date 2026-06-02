import { createServerSupabase } from './supabase-server'
import { mockSettings } from './mock-fallback'
import type { Settings } from '@/types'

export async function getSettings(): Promise<Settings> {
  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase.from('settings').select('key, value')
    if (error || !data?.length) return mockSettings

    const map: Record<string, string> = {}
    data.forEach(({ key, value }) => { map[key] = value })

    return {
      shop_name:    map.shop_name    || mockSettings.shop_name,
      slogan:       map.slogan       || mockSettings.slogan,
      banner_title: map.banner_title || mockSettings.banner_title,
      banner_sub:   map.banner_sub   || mockSettings.banner_sub,
      phone:        map.phone        || mockSettings.phone,
      zalo:         map.zalo         || mockSettings.zalo,
      address:      map.address      || mockSettings.address,
      facebook:     map.facebook     || mockSettings.facebook,
      messenger:    map.messenger    || mockSettings.messenger,
    }
  } catch {
    return mockSettings
  }
}
