import type { MetadataRoute } from 'next'

const BASE = 'https://www.vongbidx.com.vn'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: `${BASE}/sitemap.xml`,
  }
}
