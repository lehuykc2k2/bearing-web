import type { MetadataRoute } from 'next'
import { getProducts, getCategories } from '@/lib/data'

const BASE = 'https://bearing-web.vercel.app'
const LOCALES = ['vi', 'en']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getProducts({}), getCategories()])

  const staticRoutes: MetadataRoute.Sitemap = LOCALES.flatMap(locale => [
    {
      url: `${BASE}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE}/${locale}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE}/${locale}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ])

  const categoryRoutes: MetadataRoute.Sitemap = LOCALES.flatMap(locale =>
    categories.map(cat => ({
      url: `${BASE}/${locale}/products?category=${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  )

  const productRoutes: MetadataRoute.Sitemap = LOCALES.flatMap(locale =>
    products.map(p => ({
      url: `${BASE}/${locale}/products/${p.id}`,
      lastModified: new Date(p.updated_at ?? p.created_at ?? new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }))
  )

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
