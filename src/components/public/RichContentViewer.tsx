'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { X, ZoomIn, ZoomOut } from 'lucide-react'

interface Props {
  html: string
  className?: string
}

interface LightboxState {
  src: string
  alt: string
}

export default function RichContentViewer({ html, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)
  const [zoomed, setZoomed] = useState(false)

  const close = useCallback(() => { setLightbox(null); setZoomed(false) }, [])

  /* Gắn click handler trực tiếp vào mỗi <img> sau khi HTML được render */
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const imgs = container.querySelectorAll<HTMLImageElement>('img')

    function handleImgClick(this: HTMLImageElement) {
      setLightbox({ src: this.currentSrc || this.src, alt: this.alt || '' })
      setZoomed(false)
    }

    imgs.forEach(img => {
      img.style.cursor = 'zoom-in'
      img.addEventListener('click', handleImgClick)
    })

    return () => {
      imgs.forEach(img => img.removeEventListener('click', handleImgClick))
    }
  }, [html])

  /* Đóng bằng Esc */
  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, close])

  /* Khoá scroll body khi lightbox mở */
  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  return (
    <>
      <div
        ref={containerRef}
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {lightbox && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.90)', backdropFilter: 'blur(4px)' }}
          onClick={close}
        >
          {/* Controls */}
          <div className="absolute top-4 right-4 flex gap-2" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setZoomed(v => !v)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-white/25 transition"
              title={zoomed ? 'Thu nhỏ' : 'Phóng to'}
            >
              {zoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
            </button>
            <button
              onClick={close}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-white/25 transition"
              title="Đóng (Esc)"
            >
              <X size={18} />
            </button>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            onClick={e => { e.stopPropagation(); setZoomed(v => !v) }}
            style={{
              maxWidth: zoomed ? '95vw' : 'min(880px, 90vw)',
              maxHeight: zoomed ? '95vh' : '82vh',
              objectFit: 'contain',
              borderRadius: 10,
              cursor: zoomed ? 'zoom-out' : 'zoom-in',
              transition: 'max-width .25s ease, max-height .25s ease',
              boxShadow: '0 8px 48px rgba(0,0,0,0.6)',
            }}
          />

          {lightbox.alt && (
            <p className="absolute bottom-5 left-0 right-0 text-center text-sm text-white/65 px-6 pointer-events-none">
              {lightbox.alt}
            </p>
          )}
        </div>
      )}
    </>
  )
}
