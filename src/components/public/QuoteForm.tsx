'use client'
import { useRef, useState, useTransition } from 'react'
import { submitQuoteRequest } from '@/app/actions/quote'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

interface Props {
  productId?: string
  productName?: string
}

export default function QuoteForm({ productId, productName }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [result, setResult] = useState<{ success: boolean; error: string | null } | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formData = new FormData(formRef.current!)
    startTransition(async () => {
      const res = await submitQuoteRequest(formData)
      setResult(res)
      if (res.success) formRef.current?.reset()
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      {productId  && <input type="hidden" name="product_id"   value={productId} />}
      {productName && <input type="hidden" name="product_name" value={productName} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#0A2340' }}>
            Họ và tên <span style={{ color: '#E5197E' }}>*</span>
          </label>
          <input
            name="name" type="text" required placeholder="Nguyễn Văn A"
            className="w-full px-3.5 py-2.5 rounded-lg text-sm border focus:outline-none transition"
            style={{ borderColor: '#cfe7f1', background: '#f8fcfe', color: '#0A2340' }}
            onFocus={e => e.target.style.borderColor = '#0BADE8'}
            onBlur={e => e.target.style.borderColor = '#cfe7f1'}
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#0A2340' }}>
            Số điện thoại <span style={{ color: '#E5197E' }}>*</span>
          </label>
          <input
            name="phone" type="tel" required placeholder="0901 234 567"
            className="w-full px-3.5 py-2.5 rounded-lg text-sm border focus:outline-none transition"
            style={{ borderColor: '#cfe7f1', background: '#f8fcfe', color: '#0A2340' }}
            onFocus={e => e.target.style.borderColor = '#0BADE8'}
            onBlur={e => e.target.style.borderColor = '#cfe7f1'}
          />
        </div>
      </div>

      {productName && (
        <div>
          <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#0A2340' }}>
            Sản phẩm quan tâm
          </label>
          <input
            name="product_name_display" defaultValue={productName} readOnly
            className="w-full px-3.5 py-2.5 rounded-lg text-sm border"
            style={{ borderColor: '#cfe7f1', background: '#f1f8fc', color: '#5a8fa8' }}
          />
        </div>
      )}

      <div>
        <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#0A2340' }}>
          Nội dung / Yêu cầu
        </label>
        <textarea
          name="message" rows={4}
          placeholder="Mô tả nhu cầu, số lượng, thương hiệu mong muốn..."
          className="w-full px-3.5 py-2.5 rounded-lg text-sm border focus:outline-none resize-none transition"
          style={{ borderColor: '#cfe7f1', background: '#f8fcfe', color: '#0A2340' }}
          onFocus={e => e.target.style.borderColor = '#0BADE8'}
          onBlur={e => e.target.style.borderColor = '#cfe7f1'}
        />
      </div>

      {result && (
        <div className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm font-medium ${result.success ? '' : ''}`}
          style={result.success
            ? { background: '#edf7ed', color: '#2e7d32', border: '1px solid #c8e6c9' }
            : { background: '#fdecea', color: '#c62828', border: '1px solid #ffcdd2' }}>
          {result.success
            ? <><CheckCircle size={16}/> Yêu cầu đã gửi thành công! Chúng tôi sẽ liên hệ sớm nhất.</>
            : <><AlertCircle size={16}/> {result.error}</>}
        </div>
      )}

      <button
        type="submit" disabled={isPending}
        className="flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-lg text-sm text-white transition hover:brightness-105 disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg,#0BADE8 0%,#087fb5 100%)' }}>
        <Send size={15}/>
        {isPending ? 'Đang gửi...' : 'Gửi yêu cầu báo giá'}
      </button>
    </form>
  )
}
