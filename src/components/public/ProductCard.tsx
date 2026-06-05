import Link from 'next/link'
import Image from 'next/image'
import { Phone } from 'lucide-react'
import BearingPlaceholder from './BearingPlaceholder'
import type { Product } from '@/types'

function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}
      className="product-card focus-ring group rounded-lg overflow-hidden flex flex-col active:scale-[0.98]">

      {/* Ảnh */}
      <div className="relative w-full aspect-square overflow-hidden" style={{ background: 'linear-gradient(135deg,#ffffff 0%,#eef1f3 55%,#fff5f5 100%)' }}>
        {product.image_url ? (
          <Image
            src={product.image_url} alt={product.name} fill
            className="object-contain p-3 group-hover:scale-[1.04] transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BearingPlaceholder size={110}/>
          </div>
        )}
        {product.category && (
          <span className="absolute top-1.5 left-1.5 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-tight"
            style={{ background: 'rgba(44,42,124,0.88)' }}>
            {product.category.name}
          </span>
        )}
        {product.brand && (
          <span className="absolute top-1.5 right-1.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md leading-tight"
            style={product.brand === 'D&X'
              ? { background: '#2c2a7c', color: 'white' }
              : product.brand === 'AGA'
              ? { background: '#ea580c', color: 'white' }
              : { background: '#f1f5f9', color: '#475569' }}>
            {product.brand}
          </span>
        )}
      </div>

      {/* Nội dung */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
        <h3 className="font-bold text-[11px] sm:text-sm line-clamp-2 leading-snug mb-1 group-hover:text-[#2c2a7c] transition-colors"
          style={{ color: '#303030' }}>
          {product.name}
        </h3>
        {product.short_description && (
          <p className="text-[10px] sm:text-xs line-clamp-1 mb-1.5 text-slate-400 leading-snug hidden sm:block">
            {product.short_description}
          </p>
        )}
        <div className="mt-auto pt-1.5 border-t" style={{ borderColor: '#e5e8ea' }}>
          {product.price > 0 ? (
            <span className="font-extrabold text-[11px] sm:text-sm" style={{ color: '#2c2a7c' }}>
              {formatPrice(product.price)}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold" style={{ color: '#c51c23' }}>
              <Phone size={9}/> Liên hệ
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
