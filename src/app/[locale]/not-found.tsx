import { Link } from '@/i18n/navigation'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="public-page-bg min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Bearing SVG minh họa */}
        <div className="flex justify-center mb-6">
          <svg viewBox="0 0 120 120" width="120" height="120" fill="none">
            <circle cx="60" cy="60" r="50" stroke="#b8d9ee" strokeWidth="4" strokeDasharray="8 5"/>
            <circle cx="60" cy="60" r="32" stroke="#0BADE8" strokeWidth="4" opacity="0.4"/>
            <circle cx="60" cy="60" r="14" stroke="#0BADE8" strokeWidth="3" opacity="0.6"/>
            <circle cx="60" cy="60" r="5"  fill="#0A2340"/>
            {/* Balls */}
            {[0,60,120,180,240,300].map(deg => {
              const r = 32, rad = (deg * Math.PI) / 180
              return (
                <circle key={deg}
                  cx={60 + r * Math.cos(rad)} cy={60 + r * Math.sin(rad)}
                  r="4" fill="#0BADE8" opacity="0.5"/>
              )
            })}
          </svg>
        </div>

        <div className="text-8xl font-black mb-2" style={{ color: '#0BADE8' }}>404</div>
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: '#0A2340' }}>
          Không tìm thấy trang
        </h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/"
            className="focus-ring interactive-lift inline-flex items-center justify-center gap-2 text-white font-bold px-6 py-3 rounded-lg text-sm transition"
            style={{ background: 'linear-gradient(135deg,#0A2340 0%,#123b66 100%)' }}>
            <Home size={16}/> Về trang chủ
          </Link>
          <Link href="/products"
            className="focus-ring interactive-lift inline-flex items-center justify-center gap-2 text-white font-bold px-6 py-3 rounded-lg text-sm transition"
            style={{ background: 'linear-gradient(135deg,#0BADE8 0%,#087fb5 100%)' }}>
            <Search size={16}/> Xem sản phẩm
          </Link>
        </div>
      </div>
    </div>
  )
}
