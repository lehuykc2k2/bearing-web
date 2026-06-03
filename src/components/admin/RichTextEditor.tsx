'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { ResizableImageExtension } from './ResizableImage'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import { useRef, useCallback, useState } from 'react'
import { createClient } from '@/lib/supabase'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Link as LinkIcon, ImageIcon,
  Undo, Redo, Minus, Quote,
} from 'lucide-react'

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  onUploadStart?: () => void
  onUploadEnd?: () => void
  onError?: (msg: string) => void
}

const MAX_EDITOR_IMAGE_WIDTH = 1800
const IMAGE_QUALITY = 0.86

function imageFilesFromList(list?: FileList | File[] | null): File[] {
  return Array.from(list ?? []).filter(file => file.type.startsWith('image/'))
}

function imageFilesFromTransfer(data?: DataTransfer | null): File[] {
  if (!data) return []
  const files = imageFilesFromList(data.files)
  if (files.length) return files

  return Array.from(data.items ?? [])
    .filter(item => item.kind === 'file')
    .map(item => item.getAsFile())
    .filter((file): file is File => !!file && file.type.startsWith('image/'))
}

function safeImageExt(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '')
  if (ext) return ext
  if (file.type === 'image/webp') return 'webp'
  if (file.type === 'image/png') return 'png'
  return 'jpg'
}

function baseName(file: File) {
  return file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 60) || 'image'
}

async function compressImage(file: File): Promise<File> {
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file

  const sourceUrl = URL.createObjectURL(file)
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = sourceUrl
    })

    const scale = Math.min(1, MAX_EDITOR_IMAGE_WIDTH / Math.max(image.width, image.height))
    if (scale === 1 && file.size < 700_000) return file

    const canvas = document.createElement('canvas')
    canvas.width = Math.round(image.width * scale)
    canvas.height = Math.round(image.height * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/webp', IMAGE_QUALITY))
    if (!blob || blob.size >= file.size) return file

    return new File([blob], `${baseName(file)}.webp`, { type: 'image/webp', lastModified: Date.now() })
  } catch {
    return file
  } finally {
    URL.revokeObjectURL(sourceUrl)
  }
}

function ToolBtn({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={[
        'p-1.5 rounded transition text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed',
        active ? 'bg-slate-200 text-[#2c2a7c]' : '',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function Sep() {
  return <span className="w-px h-5 bg-slate-200 mx-0.5 self-center" />
}

export default function RichTextEditor({ value, onChange, placeholder, onUploadStart, onUploadEnd, onError }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadingCount, setUploadingCount] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextStyle,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      ResizableImageExtension,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder ?? 'Nhập nội dung...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[220px] px-4 py-3',
      },
      handlePaste: (_view, event) => {
        const files = imageFilesFromTransfer(event.clipboardData)
        if (!files.length) return false
        event.preventDefault()
        void uploadImages(files)
        return true
      },
      handleDrop: (view, event) => {
        const files = imageFilesFromTransfer(event.dataTransfer)
        if (!files.length) return false
        event.preventDefault()
        view.focus()
        void uploadImages(files)
        return true
      },
    },
  })

  const uploadImages = useCallback(async (files: File[]) => {
    const imageFiles = imageFilesFromList(files)
    if (!imageFiles.length) {
      onError?.('File không phải ảnh')
      return
    }

    onUploadStart?.()
    setUploadingCount(imageFiles.length)
    const supabase = createClient()

    try {
      for (const [index, file] of imageFiles.entries()) {
        const uploadFile = await compressImage(file)
        const ext = safeImageExt(uploadFile)
        const path = `desc/${Date.now()}-${index}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: upErr } = await supabase.storage.from('products').upload(path, uploadFile, {
          upsert: true,
          contentType: uploadFile.type || undefined,
        })

        if (upErr) {
          onError?.(`Upload ảnh thất bại: ${file.name}`)
          continue
        }

        const { data } = supabase.storage.from('products').getPublicUrl(path)
        editor?.chain().focus().setImage({ src: data.publicUrl, alt: file.name }).run()
        setUploadingCount(prev => Math.max(0, prev - 1))
      }
    } finally {
      setUploadingCount(0)
      onUploadEnd?.()
    }
  }, [editor, onUploadStart, onUploadEnd, onError])

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = imageFilesFromList(e.target.files)
    if (files.length) await uploadImages(files)
    e.target.value = ''
  }, [uploadImages])

  const setLink = useCallback(() => {
    const prev = editor?.getAttributes('link').href ?? ''
    const url = window.prompt('Nhập URL:', prev)
    if (url === null) return
    if (url === '') { editor?.chain().focus().unsetLink().run(); return }
    editor?.chain().focus().setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />

      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-slate-200 bg-slate-50">
        <ToolBtn onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()} title="Hoàn tác">
          <Undo size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()} title="Làm lại">
          <Redo size={14} />
        </ToolBtn>

        <Sep />

        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })} title="Tiêu đề 1">
          <Heading1 size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })} title="Tiêu đề 2">
          <Heading2 size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })} title="Tiêu đề 3">
          <Heading3 size={14} />
        </ToolBtn>

        <Sep />

        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')} title="In đậm (Ctrl+B)">
          <Bold size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')} title="In nghiêng (Ctrl+I)">
          <Italic size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')} title="Gạch chân">
          <UnderlineIcon size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')} title="Gạch ngang">
          <Strikethrough size={14} />
        </ToolBtn>

        <Sep />

        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')} title="Danh sách chấm">
          <List size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')} title="Danh sách số">
          <ListOrdered size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')} title="Trích dẫn">
          <Quote size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Đường kẻ ngang">
          <Minus size={14} />
        </ToolBtn>

        <Sep />

        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })} title="Căn trái">
          <AlignLeft size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })} title="Căn giữa">
          <AlignCenter size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })} title="Căn phải">
          <AlignRight size={14} />
        </ToolBtn>

        <Sep />

        <ToolBtn onClick={setLink} active={editor.isActive('link')} title="Chèn liên kết">
          <LinkIcon size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => fileRef.current?.click()} title="Chèn ảnh, hoặc kéo thả/dán ảnh vào editor">
          <ImageIcon size={14} />
        </ToolBtn>
        {uploadingCount > 0 && (
          <span className="ml-2 text-xs font-medium text-[#2c2a7c]">
            Đang tải {uploadingCount} ảnh...
          </span>
        )}
      </div>

      <EditorContent editor={editor} />

      <div className="border-t border-slate-100 bg-white px-3 py-2 text-[11px] text-slate-400">
        Có thể dán ảnh từ clipboard, kéo thả ảnh vào vùng soạn thảo, hoặc chọn nhiều ảnh cùng lúc. Ảnh lớn sẽ được tự nén trước khi upload.
      </div>

      <style>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #b0b4b8;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror { color: #303030; }
        .ProseMirror h1 { font-size: 1.5rem; font-weight: 800; margin: 1rem 0 .5rem; }
        .ProseMirror h2 { font-size: 1.2rem; font-weight: 700; margin: .875rem 0 .4rem; }
        .ProseMirror h3 { font-size: 1rem; font-weight: 700; margin: .75rem 0 .3rem; color: #2c2a7c; }
        .ProseMirror p  { margin: .4rem 0; line-height: 1.7; }
        .ProseMirror ul { list-style: disc; padding-left: 1.4rem; margin: .5rem 0; }
        .ProseMirror ol { list-style: decimal; padding-left: 1.4rem; margin: .5rem 0; }
        .ProseMirror li { margin: .2rem 0; }
        .ProseMirror blockquote { border-left: 3px solid #2c2a7c; margin: .75rem 0; padding: .4rem .75rem; color: #5a5c5e; background: #f7fafc; border-radius: 0 4px 4px 0; }
        .ProseMirror hr { border: none; border-top: 1px solid #e5e8ea; margin: 1rem 0; }
        .ProseMirror img { max-width: 100%; border-radius: 6px; margin: .75rem 0; border: 1px solid #e5e8ea; }
        .ProseMirror a { color: #2c2a7c; text-decoration: underline; }
        .ProseMirror strong { font-weight: 700; }
      `}</style>
    </div>
  )
}
