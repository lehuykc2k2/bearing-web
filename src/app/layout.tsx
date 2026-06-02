import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vòng Bi',
  description: 'Chuyên cung cấp vòng bi chính hãng',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" data-scroll-behavior="smooth" className={`h-full ${inter.variable}`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  )
}
