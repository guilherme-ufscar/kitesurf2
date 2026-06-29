'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/Icon'

interface TiptapEditorProps {
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
  className?: string
}

export function TiptapEditor({ value, onChange, placeholder = 'Descreva o equipamento em detalhes...', className }: TiptapEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Image.configure({ inline: false }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  async function uploadImage(file: File) {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/uploads/image', { method: 'POST', body: form })
    if (!res.ok) throw new Error('Upload falhou')
    const { url } = await res.json()
    return url as string
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !editor) return
    try {
      const url = await uploadImage(file)
      editor.chain().focus().setImage({ src: url }).run()
    } catch {
      alert('Erro ao enviar imagem.')
    } finally {
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  if (!editor) return null

  const ToolBtn = ({ onClick, active, children }: { onClick: () => void; active?: boolean; children: React.ReactNode }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      className={cn(
        'p-1.5 rounded transition-colors text-body-md',
        active ? 'bg-primary text-on-primary' : 'hover:bg-surface-container text-on-surface-variant'
      )}
    >
      {children}
    </button>
  )

  return (
    <div className={cn('border border-outline-variant rounded-lg overflow-hidden bg-surface-container-lowest', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-outline-variant bg-surface-container-low">
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
          <Icon name="format_bold" size={18} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
          <Icon name="format_italic" size={18} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
          <Icon name="format_list_bulleted" size={18} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
          <Icon name="format_list_numbered" size={18} />
        </ToolBtn>
        <div className="w-px h-5 bg-outline-variant mx-1" />
        <ToolBtn onClick={() => fileRef.current?.click()}>
          <Icon name="image" size={18} />
        </ToolBtn>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="tiptap-editor p-unit-md min-h-[200px] text-body-md text-on-surface"
      />
    </div>
  )
}
