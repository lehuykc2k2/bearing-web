'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Email hoặc mật khẩu không đúng.')
    else { router.push('/admin'); router.refresh() }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: '#0A2340' }}>
      {/* BG pattern */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #0BADE8 1px, transparent 0)', backgroundSize: '28px 28px' }} />
      <div className="absolute -top-40 right-0 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ background: '#0BADE8' }} />
      <div className="absolute bottom-0 -left-20 w-64 h-64 rounded-full blur-3xl opacity-10"
        style={{ background: '#E5197E' }} />

      <div className="relative w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-1 text-4xl font-black leading-none mb-3">
            <span className="text-white">D</span>
            <span style={{ color: '#E5197E' }}>&amp;</span>
            <span className="text-white">X</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#0BADE8' }}>
            Rolling Bearings
          </p>
          <h1 className="text-xl font-extrabold text-white">Đăng nhập quản trị</h1>
          <p className="text-sm mt-1" style={{ color: '#4a7a96' }}>Trang nội bộ – chỉ dành cho quản lý</p>
        </div>

        <div className="rounded-2xl p-7 shadow-2xl border"
          style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(11,173,232,0.15)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#a8cfe0' }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#4a7a96' }} />
                <input
                  type="email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#4a7a96] focus:outline-none transition"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(11,173,232,0.2)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#a8cfe0' }}>Mật khẩu</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#4a7a96' }} />
                <input
                  type={showPw ? 'text' : 'password'} required
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl pl-10 pr-11 py-2.5 text-sm text-white placeholder-[#4a7a96] focus:outline-none transition"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(11,173,232,0.2)' }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 hover:opacity-80 transition"
                  style={{ color: '#4a7a96' }}>
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm px-4 py-2.5 rounded-xl border"
                style={{ background: 'rgba(229,25,126,0.08)', borderColor: 'rgba(229,25,126,0.2)', color: '#E5197E' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full font-bold py-3 rounded-xl transition disabled:opacity-60 text-sm text-white mt-2 hover:opacity-90"
              style={{ background: '#0BADE8' }}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
