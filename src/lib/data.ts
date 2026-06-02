import { createServerSupabase } from './supabase-server'
import { mockProducts, mockCategories } from './mock-fallback'
import type { Product, Category } from '@/types'

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase.from('categories').select('*').order('sort_order')
    if (error || !data?.length) return mockCategories
    return data as Category[]
  } catch {
    return mockCategories
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
    if (error || !data?.length) return mockProducts.slice(0, limit)
    return data as Product[]
  } catch {
    return mockProducts.slice(0, limit)
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
      if (cat) query = query.eq('category_id', cat.id)
    }
    if (opts.q) query = query.ilike('name', `%${opts.q}%`)

    if (opts.sort === 'price_asc')  query = query.order('price', { ascending: true })
    else if (opts.sort === 'price_desc') query = query.order('price', { ascending: false })
    else if (opts.sort === 'name_asc')   query = query.order('name',  { ascending: true })
    else {
      query = query.order('sort_order').order('created_at', { ascending: false })
    }

    const { data, error } = await query
    if (error || !data?.length) return filterMock(opts)
    return data as Product[]
  } catch {
    return filterMock(opts)
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
    if (error || !data) return mockProducts.find(p => p.id === id) ?? null
    return data as Product
  } catch {
    return mockProducts.find(p => p.id === id) ?? null
  }
}

function filterMock(opts: { categorySlug?: string; q?: string; sort?: string }): Product[] {
  let list = [...mockProducts]
  if (opts.categorySlug) {
    const cat = mockCategories.find(c => c.slug === opts.categorySlug)
    if (cat) list = list.filter(p => p.category_id === cat.id)
  }
  if (opts.q) {
    const q = opts.q.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(q))
  }
  return list
}
