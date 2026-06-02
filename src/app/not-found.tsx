import Link from 'next/link'
import { Search, Home, Package } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(180deg,#fbfdfe 0%,#edf7fb 100%)' }}>
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#EBF8FE 0%,#dff2fc 100%)', border: '1px solid #b8d9ee' }}>
          <Search size={36} style={{ color: '#0BADE8' }} />
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: '#0BADE8' }}>
          404
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold mb-3" style={{ color: '#0A2340' }}>
          Trang không tìm thấy
        </h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Trang bạn đang tìm có thể đã bị xóa, đổi địa chỉ, hoặc chưa tồn tại.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/vi"
            className="flex items-center justify-center gap-2 font-bold px-5 py-3 rounded-lg text-sm text-white transition hover:brightness-105"
            style={{ background: 'linear-gradient(135deg,#0A2340 0%,#123b66 100%)' }}>
            <Home size={15} /> Trang chủ
          </Link>
          <Link href="/vi/products"
            className="flex items-center justify-center gap-2 font-bold px-5 py-3 rounded-lg text-sm text-white transition hover:brightness-105"
            style={{ background: 'linear-gradient(135deg,#0BADE8 0%,#087fb5 100%)' }}>
            <Package size={15} /> Xem sản phẩm
          </Link>
        </div>
      </div>
    </div>
  )
}
