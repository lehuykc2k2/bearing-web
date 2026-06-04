import { createServerSupabase } from './supabase-server'
import type { Product, Category } from '@/types'

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase.from('categories').select('*').order('sort_order')
    if (error) return []
    return (data ?? []) as Category[]
  } catch {
    return []
  }
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(id,name,slug,sort_order,created_at)')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) return []
    return (data ?? []) as Product[]
  } catch {
    return []
  }
}

export async function getProducts(opts: {
  categorySlug?: string
  q?: string
  sort?: string
  categories?: Category[]
}): Promise<Product[]> {
  try {
    const supabase = await createServerSupabase()
    let query = supabase
      .from('products')
      .select('*, category:categories(id,name,slug,sort_order,created_at)')
      .eq('is_visible', true)

    if (opts.categorySlug && opts.categories) {
      const cat = opts.categories.find(c => c.slug === opts.categorySlug)
      if (!cat) return []
      query = query.eq('category_id', cat.id)
    }
    if (opts.q) query = query.ilike('name', `%${opts.q}%`)

    if (opts.sort === 'price_asc') query = query.order('price', { ascending: true })
    else if (opts.sort === 'price_desc') query = query.order('price', { ascending: false })
    else if (opts.sort === 'name_asc') query = query.order('name', { ascending: true })
    else {
      query = query.order('sort_order').order('created_at', { ascending: false })
    }

    const { data, error } = await query
    if (error) return []
    return (data ?? []) as Product[]
  } catch {
    return []
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(id,name,slug,sort_order,created_at)')
      .eq('id', id)
      .eq('is_visible', true)
      .single()
    if (error || !data) return null
    return data as Product
  } catch {
    return null
  }
}
