'use client'
import { useState } from 'react'
import Image from 'next/image'
import { X, ZoomIn, ZoomOut } from 'lucide-react'

interface Props {
  src: string
  alt?: string
  width?: number
  height?: number
  className?: string
  imgClassName?: string
}

export default function ZoomableImage({ src, alt = '', width = 600, height = 400, className, imgClassName }: Props) {
  const [open, setOpen] = useState(false)
  const [zoomed, setZoomed] = useState(false)

  return (
    <>
      <div className={className} onClick={() => setOpen(true)} style={{ cursor: 'zoom-in' }}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={imgClassName}
          style={{ transition: 'opacity 150ms' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        />
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.88)' }}
          onClick={() => setOpen(false)}
        >
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              onClick={e => { e.stopPropagation(); setZoomed(v => !v) }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
              title={zoomed ? 'Thu nhỏ' : 'Phóng to'}
            >
              {zoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
              title="Đóng"
            >
              <X size={18} />
            </button>
          </div>

          <div
            style={{ cursor: zoomed ? 'zoom-out' : 'zoom-in', transition: 'all .3s' }}
            onClick={e => { e.stopPropagation(); setZoomed(v => !v) }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              style={{
                maxWidth: zoomed ? '92vw' : 'min(900px, 90vw)',
                maxHeight: zoomed ? '92vh' : '82vh',
                objectFit: 'contain',
                borderRadius: 8,
                display: 'block',
                transition: 'max-width .3s, max-height .3s',
              }}
            />
          </div>

          {alt && (
            <p className="absolute bottom-5 left-0 right-0 text-center text-sm text-white/70 pointer-events-none">
              {alt}
            </p>
          )}
        </div>
      )}
    </>
  )
}
