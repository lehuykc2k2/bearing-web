'use client'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export function ToggleVisibilityButton({ id, isVisible }: { id: string; isVisible: boolean }) {
  const router = useRouter()

  async function toggle() {
    const supabase = createClient()
    await supabase.from('products').update({ is_visible: !isVisible }).eq('id', id)
    router.refresh()
  }

  return (
    <button onClick={toggle}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition"
      style={isVisible
        ? { background: '#f0fdf4', color: '#16a34a' }
        : { background: '#f8fafc', color: '#94a3b8' }}>
      <span className={`w-1.5 h-1.5 rounded-full ${isVisible ? 'bg-green-500' : 'bg-slate-400'}`}/>
      {isVisible ? 'Hiện' : 'Ẩn'}
    </button>
  )
}

export function DeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()

  async function del() {
    if (!confirm(`Xóa sản phẩm "${name}"?`)) return
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
    router.refresh()
  }

  return (
    <button onClick={del}
      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition border border-transparent hover:border-red-100">
      <Trash2 size={14}/>
    </button>
  )
}
