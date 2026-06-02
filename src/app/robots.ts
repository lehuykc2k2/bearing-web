import type { MetadataRoute } from 'next'

const BASE = 'https://bearing-web.vercel.app'

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
