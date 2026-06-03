'use client'
import { Node, mergeAttributes, type Command } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import { useRef, useState, useCallback } from 'react'
import { AlignLeft, AlignCenter, AlignRight, Trash2, GripVertical } from 'lucide-react'

type Align = 'left' | 'center' | 'right'

/* margin theo căn lề — không dùng float */
function marginByAlign(align: Align): string {
  if (align === 'center') return '0.75rem auto'
  if (align === 'right')  return '0.75rem 0 0.75rem auto'
  return '0.75rem auto 0.75rem 0'
}

function ResizableImageView({ node, updateAttributes, selected, deleteNode, editor, getPos }: NodeViewProps) {
  const attrs   = node.attrs as { src: string; alt?: string; width?: number | null; align?: Align }
  const align   = (attrs.align ?? 'left') as Align
  const wrapRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  const selectImage = useCallback(() => {
    const pos = typeof getPos === 'function' ? getPos() : null
    if (typeof pos === 'number') editor.commands.setNodeSelection(pos)
  }, [editor, getPos])

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const startX     = e.clientX
    const startWidth = wrapRef.current?.offsetWidth ?? (attrs.width ?? 300)
    setDragging(true)

    function onMove(ev: MouseEvent) {
      if (wrapRef.current)
        wrapRef.current.style.width = `${Math.max(60, startWidth + ev.clientX - startX)}px`
    }
    function onUp(ev: MouseEvent) {
      updateAttributes({ width: Math.round(Math.max(60, startWidth + ev.clientX - startX)) })
      setDragging(false)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [attrs.width, updateAttributes])

  return (
    <NodeViewWrapper as="div">
      {/* Handle kéo — Tiptap dùng data-drag-handle để kiểm soát drag, tránh browser duplicate */}
      <div
        data-drag-handle
        contentEditable={false}
        onMouseDown={selectImage}
        style={{
          display:     'flex',
          justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
          alignItems:  'center',
          height:      20,
          cursor:      'grab',
          color:       '#b0b4ba',
          userSelect:  'none',
          marginBottom: 2,
        }}
        title="Kéo để di chuyển ảnh"
      >
        <GripVertical size={14} />
      </div>

      {/* Khung căn lề — display:block, không float */}
      <div
        ref={wrapRef}
        data-drag-handle
        contentEditable={false}
        onMouseDown={selectImage}
        style={{
          display:       'block',
          width:         attrs.width ? `${attrs.width}px` : 'auto',
          maxWidth:      '100%',
          margin:        marginByAlign(align),
          marginTop:     0,
          position:      'relative',
          outline:       selected ? '2px solid #2c2a7c' : 'none',
          outlineOffset: 2,
          borderRadius:  6,
          userSelect:    dragging ? 'none' : 'auto',
          cursor:        'default',
        }}
      >
        {/* Toolbar mini */}
        {selected && (
          <div
            style={{
              position:     'absolute',
              top:          -40,
              left:         '50%',
              transform:    'translateX(-50%)',
              display:      'flex',
              gap:          3,
              background:   '#fff',
              border:       '1px solid #dde2e8',
              borderRadius: 6,
              padding:      '3px 5px',
              boxShadow:    '0 3px 10px rgba(0,0,0,.13)',
              zIndex:       30,
              whiteSpace:   'nowrap',
            }}
          >
            {([
              ['left',   AlignLeft,   'Căn trái'],
              ['center', AlignCenter, 'Căn giữa'],
              ['right',  AlignRight,  'Căn phải'],
            ] as [Align, React.ElementType, string][]).map(([a, Icon, label]) => (
              <button
                key={a}
                type="button"
                title={label}
                onMouseDown={e => { e.preventDefault(); updateAttributes({ align: a }) }}
                style={{
                  padding:      '3px 7px',
                  background:   align === a ? '#2c2a7c' : 'transparent',
                  color:        align === a ? '#fff' : '#555',
                  border:       'none',
                  borderRadius: 4,
                  cursor:       'pointer',
                  display:      'flex',
                  alignItems:   'center',
                }}
              >
                <Icon size={13} />
              </button>
            ))}
            <div style={{ width: 1, background: '#e2e6ea', margin: '2px 2px' }} />
            <button
              type="button"
              title="Xoá ảnh"
              onMouseDown={e => { e.preventDefault(); deleteNode() }}
              style={{
                padding: '3px 7px', background: 'transparent', color: '#c51c23',
                border: 'none', borderRadius: 4, cursor: 'pointer',
                display: 'flex', alignItems: 'center',
              }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}

        {/* Ảnh */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={attrs.src}
          alt={attrs.alt ?? ''}
          style={{ display: 'block', width: '100%', borderRadius: 5 }}
          draggable={false}
        />

        {/* Resize handles */}
        {selected && (
          <>
            <div onMouseDown={startResize} style={{
              position: 'absolute', right: -6, bottom: -6,
              width: 14, height: 14,
              background: '#2c2a7c', border: '2px solid #fff',
              borderRadius: 3, cursor: 'se-resize', zIndex: 10,
            }} />
            <div onMouseDown={startResize} style={{
              position: 'absolute', right: -5, top: '50%',
              transform: 'translateY(-50%)',
              width: 10, height: 28,
              background: '#2c2a7c', border: '2px solid #fff',
              borderRadius: 3, cursor: 'e-resize', zIndex: 10,
            }} />
          </>
        )}
      </div>
    </NodeViewWrapper>
  )
}

/* ── Extension ── */
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    resizableImage: {
      setImage: (options: { src: string; alt?: string }) => ReturnType
    }
  }
}

export const ResizableImageExtension = Node.create({
  name:      'image',
  group:     'block',
  atom:      true,
  draggable: true,

  addAttributes() {
    return {
      src:   { default: null },
      alt:   { default: '' },
      width: { default: null },
      align: { default: 'left' },
    }
  },

  parseHTML() {
    return [{ tag: 'img[src]' }]
  },

  renderHTML({ HTMLAttributes }) {
    const { width, align, ...rest } = HTMLAttributes as Record<string, string | number | null>
    const a   = (align as Align) ?? 'left'
    const w   = width ? `width:${width}px;` : ''
    const m   = a === 'center' ? 'margin:.75rem auto;'
               : a === 'right'  ? 'margin:.75rem 0 .75rem auto;'
               :                  'margin:.75rem 0;'
    return ['img', mergeAttributes(rest as Record<string, string>, {
      style: `${w}${m}max-width:100%;display:block;border-radius:5px;`,
    })]
  },

  addCommands() {
    return {
      setImage: (opts): Command => ({ commands }) =>
        commands.insertContent({ type: this.name, attrs: opts }),
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView)
  },
})
