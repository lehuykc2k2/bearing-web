'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, Settings, LogOut, Menu, X, ExternalLink, FileUp, Layers } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import BrandLogo from '@/components/BrandLogo'

const nav = [
  { href: '/admin',             label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/admin/products',    label: 'Sản phẩm',     icon: Package },
  { href: '/admin/categories',  label: 'Danh mục',     icon: Layers },
  { href: '/admin/import',      label: 'Import Excel',  icon: FileUp },
  { href: '/admin/settings',    label: 'Cài đặt shop', icon: Settings },
]

function Sidebar({ onClose, pathname, onLogout }: {
  onClose: () => void
  pathname: string
  onLogout: () => void
}) {
  return (
    <aside className="flex flex-col h-full w-56" style={{ background: '#0A2340' }}>
      {/* Logo */}
      <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <BrandLogo variant="light" size="sm" />
        <p className="text-[9px] font-semibold uppercase tracking-widest mt-1.5 pl-0.5" style={{ color: '#6b9ab5' }}>
          Quản trị nội bộ
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active ? 'text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              style={active ? { background: '#0BADE8' } : {}}>
              <Icon size={16} className={active ? 'text-white' : 'text-slate-400'}/>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t space-y-0.5" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <Link href="/" target="_blank" onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all">
          <ExternalLink size={16} className="text-slate-400"/>
          Xem trang web
        </Link>
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut size={16} className="text-slate-400"/>
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [open, setOpen] = useState(false)

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#eef0f3' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col h-full shrink-0">
        <Sidebar onClose={() => {}} pathname={pathname} onLogout={logout} />
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="flex flex-col h-full shrink-0">
            <Sidebar onClose={() => setOpen(false)} pathname={pathname} onLogout={logout} />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden px-4 py-3 flex items-center gap-3 shrink-0 border-b border-slate-200 bg-white">
          <button onClick={() => setOpen(!open)} className="text-slate-600">
            {open ? <X size={20}/> : <Menu size={20}/>}
          </button>
          <div className="flex items-center gap-2">
            <div className="rounded-lg px-1 py-0.5" style={{ background: '#0A2340' }}>
              <BrandLogo variant="light" size="sm" showText={false} />
            </div>
            <span className="font-bold text-sm text-slate-800">D&amp;X Admin</span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          {children}
        </main>
      </div>
    </div>
  )
}
