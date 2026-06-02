import createMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Admin: bảo vệ bằng Supabase auth
  if (pathname.startsWith('/admin')) {
    const response = NextResponse.next({ request })
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(toSet) {
            toSet.forEach(({ name, value }) => request.cookies.set(name, value))
            toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
          },
        },
      }
    )
    const { data: { user } } = await supabase.auth.getUser()

    if (pathname !== '/admin/login' && !user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    if (pathname === '/admin/login' && user) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return response
  }

  // Tất cả route còn lại: xử lý i18n
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/',
    '/(vi|en)/:path*',
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
}
