'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut } from 'lucide-react'
import BearingPlaceholder from './BearingPlaceholder'

interface Props {
  images: string[]
  name: string
}

export default function ProductImageGallery({ images, name }: Props) {
  const [active, setActive] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [zoomed, setZoomed] = useState(false)

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
    setZoomed(false)
  }, [])

  const showPrevious = useCallback(() => {
    setActive(current => (current + images.length - 1) % images.length)
    setZoomed(false)
  }, [images.length])

  const showNext = useCallback(() => {
    setActive(current => (current + 1) % images.length)
    setZoomed(false)
  }, [images.length])

  useEffect(() => {
    if (!lightboxOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox()
      if (images.length > 1 && event.key === 'ArrowLeft') showPrevious()
      if (images.length > 1 && event.key === 'ArrowRight') showNext()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [closeLightbox, images.length, lightboxOpen, showNext, showPrevious])

  if (images.length === 0) {
    return (
      <div className="gallery-card rounded-lg overflow-hidden">
        <div className="aspect-square flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#ffffff 0%,#eef1f3 55%,#fff5f5 100%)' }}>
          <BearingPlaceholder size={220}/>
        </div>
      </div>
    )
  }

  const activeIndex = active < images.length ? active : 0

  return (
    <>
      <div className="gallery-card rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="focus-ring group relative block aspect-square w-full"
          style={{ background: 'linear-gradient(135deg,#ffffff 0%,#eef1f3 55%,#fff5f5 100%)' }}
          aria-label="Xem ảnh sản phẩm lớn hơn"
        >
          <Image
            src={images[activeIndex]}
            alt={name}
            fill
            className="object-contain p-8 transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-slate-950/75 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition group-hover:opacity-100">
            <Maximize2 size={13}/> Xem lớn
          </span>
        </button>

        {images.length > 1 && (
          <div className="flex gap-2 p-3 border-t overflow-x-auto" style={{ borderColor: '#e5e8ea' }}>
            {images.map((url, i) => (
              <button
                key={`${url}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                className={`focus-ring shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition ${
                  i === activeIndex ? 'border-[#2c2a7c]' : 'border-transparent hover:border-[#dcdee0]'
                }`}
                aria-label={`Chọn ảnh sản phẩm ${i + 1}`}
              >
                <div className="relative w-full h-full">
                  <Image src={url} alt={`${name} ảnh ${i + 1}`} fill className="object-contain p-1" sizes="56px"/>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && typeof document !== 'undefined' && createPortal((
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{
            background: 'rgba(0,0,0,0.9)',
            backdropFilter: 'blur(4px)',
            zIndex: 2147483647,
          }}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh sản phẩm"
        >
          <div
            className="absolute right-4 flex gap-2"
            style={{ top: 'calc(1rem + env(safe-area-inset-top))', zIndex: 1 }}
            onClick={event => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomed(value => !value)}
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
              aria-label={zoomed ? 'Thu nhỏ ảnh' : 'Phóng to ảnh'}
              title={zoomed ? 'Thu nhỏ' : 'Phóng to'}
            >
              {zoomed ? <ZoomOut size={18}/> : <ZoomIn size={18}/>}
            </button>
            <button
              type="button"
              onClick={closeLightbox}
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
              aria-label="Đóng ảnh"
              title="Đóng"
            >
              <X size={18}/>
            </button>
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={event => { event.stopPropagation(); showPrevious() }}
                className="focus-ring absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 md:left-5"
                aria-label="Ảnh trước"
              >
                <ChevronLeft size={24}/>
              </button>
              <button
                type="button"
                onClick={event => { event.stopPropagation(); showNext() }}
                className="focus-ring absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 md:right-5"
                aria-label="Ảnh tiếp theo"
              >
                <ChevronRight size={24}/>
              </button>
            </>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[activeIndex]}
            alt={name}
            onClick={event => { event.stopPropagation(); setZoomed(value => !value) }}
            style={{
              maxWidth: zoomed ? '96vw' : 'min(980px, 90vw)',
              maxHeight: zoomed ? '96vh' : '84vh',
              objectFit: 'contain',
              borderRadius: 10,
              cursor: zoomed ? 'zoom-out' : 'zoom-in',
              transition: 'max-width .25s ease, max-height .25s ease',
              boxShadow: '0 10px 54px rgba(0,0,0,0.65)',
            }}
          />

          <div
            className="pointer-events-none absolute left-0 right-0 px-6 text-center"
            style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
          >
            <p className="text-sm font-semibold text-white/75">{name}</p>
            {images.length > 1 && (
              <p className="mt-1 text-xs text-white/50">{activeIndex + 1} / {images.length}</p>
            )}
          </div>
        </div>
      ), document.body)}
    </>
  )
}
