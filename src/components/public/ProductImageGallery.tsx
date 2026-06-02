'use client'
import { useState } from 'react'
import Image from 'next/image'
import BearingPlaceholder from './BearingPlaceholder'

interface Props {
  images: string[]
  name: string
}

export default function ProductImageGallery({ images, name }: Props) {
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return (
      <div className="gallery-card rounded-lg overflow-hidden">
        <div className="aspect-square flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#f8fcfd 0%,#edf7fb 55%,#fff7e8 100%)' }}>
          <BearingPlaceholder size={220}/>
        </div>
      </div>
    )
  }

  return (
    <div className="gallery-card rounded-lg overflow-hidden">
      {/* Ảnh chính */}
      <div className="relative aspect-square" style={{ background: 'linear-gradient(135deg,#f8fcfd 0%,#edf7fb 55%,#fff7e8 100%)' }}>
        <Image
          src={images[active]}
          alt={name}
          fill
          className="object-contain p-8"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnail strip — chỉ hiện khi có > 1 ảnh */}
      {images.length > 1 && (
        <div className="flex gap-2 p-3 border-t overflow-x-auto" style={{ borderColor: '#e7f3f8' }}>
          {images.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`focus-ring shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition ${
                i === active ? 'border-[#0BADE8]' : 'border-transparent hover:border-sky-200'
              }`}
            >
              <div className="relative w-full h-full">
                <Image src={url} alt={`${name} ảnh ${i + 1}`} fill className="object-contain p-1" sizes="56px"/>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
