'use client'
import { useState, useRef, useCallback } from 'react'
import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

interface ImportResult {
  total:   number
  created: number
  updated: number
  skipped: number
  errors:  string[]
}

export default function ImportForm() {
  const [file,      setFile]      = useState<File | null>(null)
  const [dragging,  setDragging]  = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [result,    setResult]    = useState<ImportResult | null>(null)
  const [error,     setError]     = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f && f.name.endsWith('.xlsx')) { setFile(f); setResult(null); setError('') }
    else setError('Chỉ chấp nhận file .xlsx')
  }, [])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) { setFile(f); setResult(null); setError('') }
  }

  async function handleImport() {
    if (!file) return
    setLoading(true); setError(''); setResult(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/import', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) setError(json.error ?? 'Import thất bại')
      else setResult(json)
    } catch {
      setError('Lỗi kết nối. Vui lòng thử lại.')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">

      {/* Download template */}
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-sm" style={{ color: '#0A2340' }}>Tải file mẫu</p>
          <p className="text-xs text-slate-500 mt-0.5">File Excel có sẵn header đúng định dạng + dữ liệu mẫu + hướng dẫn</p>
        </div>
        <a href="/api/admin/import-template"
          className="shrink-0 flex items-center gap-2 text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:opacity-90 transition"
          style={{ background: '#0BADE8' }}>
          <Download size={15}/> Tải mẫu (.xlsx)
        </a>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all"
        style={{
          borderColor: dragging ? '#0BADE8' : file ? '#22c55e' : '#b8d9ee',
          background:  dragging ? 'rgba(11,173,232,0.04)' : file ? 'rgba(34,197,94,0.04)' : 'white',
        }}>
        <input ref={inputRef} type="file" accept=".xlsx" className="hidden" onChange={handleFile}/>

        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileSpreadsheet size={28} style={{ color: '#22c55e' }}/>
            <div className="text-left">
              <p className="font-semibold text-sm" style={{ color: '#0A2340' }}>{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={e => { e.stopPropagation(); setFile(null); setResult(null) }}
              className="ml-2 text-slate-400 hover:text-red-500 transition">
              <X size={16}/>
            </button>
          </div>
        ) : (
          <>
            <Upload size={32} className="mx-auto mb-3 text-slate-300"/>
            <p className="font-semibold text-sm" style={{ color: '#0A2340' }}>
              Kéo thả file vào đây hoặc click để chọn
            </p>
            <p className="text-xs text-slate-400 mt-1">Chỉ chấp nhận file <strong>.xlsx</strong></p>
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="shrink-0 mt-0.5"/>
          {error}
        </div>
      )}

      {/* Import button */}
      {file && !result && (
        <button onClick={handleImport} disabled={loading}
          className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl transition disabled:opacity-60"
          style={{ background: '#0A2340' }}>
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
              Đang import...
            </>
          ) : (
            <><Upload size={16}/> Bắt đầu import</>
          )}
        </button>
      )}

      {/* Result */}
      {result && (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#b8d9ee' }}>
          <div className="px-5 py-4 font-bold text-sm flex items-center gap-2 text-white"
            style={{ background: result.errors.length === 0 ? '#0BADE8' : '#f97316' }}>
            {result.errors.length === 0
              ? <><CheckCircle size={16}/> Import hoàn tất!</>
              : <><AlertCircle size={16}/> Import hoàn tất với một số lỗi</>
            }
          </div>

          <div className="p-5 grid grid-cols-3 gap-3">
            {[
              { label: 'Đã tạo mới', value: result.created, color: '#22c55e' },
              { label: 'Đã cập nhật', value: result.updated, color: '#0BADE8' },
              { label: 'Bỏ qua',      value: result.skipped, color: '#94a3b8' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center bg-slate-50 rounded-xl py-3 px-2">
                <div className="text-2xl font-black" style={{ color }}>{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {result.errors.length > 0 && (
            <div className="border-t px-5 py-4" style={{ borderColor: '#f3e8d4' }}>
              <p className="text-xs font-semibold text-orange-700 mb-2 flex items-center gap-1.5">
                <XCircle size={13}/> {result.errors.length} lỗi
              </p>
              <ul className="space-y-1 max-h-40 overflow-y-auto">
                {result.errors.map((e, i) => (
                  <li key={i} className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-1.5">{e}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t px-5 py-3 flex gap-3" style={{ borderColor: '#b8d9ee' }}>
            <button onClick={() => { setFile(null); setResult(null) }}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 transition">
              Import file khác
            </button>
            <a href="/admin/products"
              className="ml-auto text-sm font-semibold hover:underline"
              style={{ color: '#0BADE8' }}>
              Xem danh sách sản phẩm →
            </a>
          </div>
        </div>
      )}

      {/* Ghi chú */}
      <div className="text-xs text-slate-400 space-y-1 border-t pt-4" style={{ borderColor: '#e0f2fe' }}>
        <p>• <strong>Tạo mới:</strong> hàng chưa có sản phẩm trùng tên sẽ được tạo</p>
        <p>• <strong>Cập nhật:</strong> hàng trùng tên sản phẩm sẽ được cập nhật (ghi đè)</p>
        <p>• <strong>Danh mục:</strong> nếu loại vòng bi chưa có sẽ tự động tạo mới</p>
        <p>• <strong>Không bắt buộc:</strong> tất cả cột ngoài <code className="bg-slate-100 px-1 rounded font-mono">ten_san_pham</code> đều tuỳ chọn</p>
      </div>
    </div>
  )
}
