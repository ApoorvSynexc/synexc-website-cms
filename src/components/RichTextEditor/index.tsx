import { useEffect, useState, type ReactNode } from 'react'
import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import {
  FiAlignCenter,
  FiAlignLeft,
  FiAlignRight,
  FiBold,
  FiCode,
  FiImage,
  FiItalic,
  FiLink,
  FiList,
  FiRotateCcw,
  FiRotateCw,
  FiMinus,
  FiUnderline,
} from 'react-icons/fi'
import { LuEraser, LuHeading2, LuHeading3, LuListOrdered, LuQuote, LuStrikethrough, LuTable } from 'react-icons/lu'

export type RichTextEditorProps = {
  /** HTML string. */
  value: string
  onChange: (html: string) => void
  placeholder?: string
  error?: boolean
  id?: string
}

/** TipTap returns "<p></p>" for an empty document — normalise that to "". */
const normalise = (html: string) => (html === '<p></p>' ? '' : html)

export function RichTextEditor({ value, onChange, placeholder, error, id }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false } }),
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder: placeholder ?? 'Start writing…' }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(normalise(editor.getHTML())),
    editorProps: { attributes: { ...(id ? { id } : {}), class: 'rte-content' } },
  })

  // Sync when the form is reset/re-seeded from outside (open modal for another blog).
  useEffect(() => {
    if (editor && normalise(editor.getHTML()) !== value) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [value, editor])

  return (
    <div
      className={`overflow-hidden rounded-lg border bg-surface transition-colors focus-within:border-accent ${
        error ? 'border-red-500' : 'border-border'
      }`}
    >
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
}

function Toolbar({ editor }: { editor: Editor }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      alignLeft: e.isActive({ textAlign: 'left' }),
      alignCenter: e.isActive({ textAlign: 'center' }),
      alignRight: e.isActive({ textAlign: 'right' }),
      headerRow: e.isActive('tableHeader'),
      bullet: e.isActive('bulletList'),
      ordered: e.isActive('orderedList'),
      quote: e.isActive('blockquote'),
      link: e.isActive('link'),
      table: e.isActive('table'),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  })

  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link URL (leave empty to remove)', previous ?? 'https://')
    if (url === null) return
    if (url.trim() === '' || url.trim() === 'https://') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }

  const addImage = () => {
    const url = window.prompt('Image URL (https://…)')
    if (url && /^https?:\/\//i.test(url.trim())) {
      editor.chain().focus().setImage({ src: url.trim() }).run()
    }
  }

  const insertTable = (rows: number, cols: number) =>
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()

  return (
    <div className="border-b border-border bg-surface-2">
    <div className="flex flex-wrap items-center gap-0.5 p-1.5">
      <Btn label="Heading 2" active={s.h2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <LuHeading2 size={16} />
      </Btn>
      <Btn label="Heading 3" active={s.h3} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <LuHeading3 size={16} />
      </Btn>
      <Sep />
      <Btn label="Bold" active={s.bold} onClick={() => editor.chain().focus().toggleBold().run()}>
        <FiBold size={15} />
      </Btn>
      <Btn label="Italic" active={s.italic} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <FiItalic size={15} />
      </Btn>
      <Btn label="Underline" active={s.underline} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <FiUnderline size={15} />
      </Btn>
      <Btn label="Strikethrough" active={s.strike} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <LuStrikethrough size={15} />
      </Btn>
      <Sep />
      <Btn label="Align left" active={s.alignLeft} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        <FiAlignLeft size={15} />
      </Btn>
      <Btn label="Align center" active={s.alignCenter} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        <FiAlignCenter size={15} />
      </Btn>
      <Btn label="Align right" active={s.alignRight} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        <FiAlignRight size={15} />
      </Btn>
      <Sep />
      <Btn label="Bullet list" active={s.bullet} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <FiList size={15} />
      </Btn>
      <Btn label="Numbered list" active={s.ordered} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <LuListOrdered size={16} />
      </Btn>
      <Btn label="Quote" active={s.quote} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <LuQuote size={15} />
      </Btn>
      <Sep />
      <Btn label="Link" active={s.link} onClick={setLink}>
        <FiLink size={15} />
      </Btn>
      <Btn label="Insert image" onClick={addImage}>
        <FiImage size={15} />
      </Btn>
      <TablePicker disabled={s.table} onPick={insertTable} />
      <Btn label="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <FiCode size={15} />
      </Btn>
      <Btn label="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <FiMinus size={15} />
      </Btn>
      <Btn
        label="Clear formatting"
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
      >
        <LuEraser size={15} />
      </Btn>
      <Sep />
      <Btn label="Undo" disabled={!s.canUndo} onClick={() => editor.chain().focus().undo().run()}>
        <FiRotateCcw size={15} />
      </Btn>
      <Btn label="Redo" disabled={!s.canRedo} onClick={() => editor.chain().focus().redo().run()}>
        <FiRotateCw size={15} />
      </Btn>
    </div>

    {s.table && (
      <div className="flex flex-wrap items-center gap-1 border-t border-border bg-accent-bg px-1.5 py-1">
        <span className="px-1 text-xs font-semibold text-heading">Table</span>
        <TextBtn onClick={() => editor.chain().focus().addRowBefore().run()}>+ Row above</TextBtn>
        <TextBtn onClick={() => editor.chain().focus().addRowAfter().run()}>+ Row below</TextBtn>
        <TextBtn danger onClick={() => editor.chain().focus().deleteRow().run()}>− Row</TextBtn>
        <Sep />
        <TextBtn onClick={() => editor.chain().focus().addColumnBefore().run()}>+ Column left</TextBtn>
        <TextBtn onClick={() => editor.chain().focus().addColumnAfter().run()}>+ Column right</TextBtn>
        <TextBtn danger onClick={() => editor.chain().focus().deleteColumn().run()}>− Column</TextBtn>
        <Sep />
        <TextBtn active={s.headerRow} onClick={() => editor.chain().focus().toggleHeaderRow().run()}>
          Header row
        </TextBtn>
        <TextBtn onClick={() => editor.chain().focus().mergeOrSplit().run()}>Merge / split cells</TextBtn>
        <TextBtn danger onClick={() => editor.chain().focus().deleteTable().run()}>Delete table</TextBtn>
      </div>
    )}
    </div>
  )
}

const PICKER_MAX = 8

/** Grid picker: hover to choose rows × columns, click to insert. */
function TablePicker({ disabled, onPick }: { disabled: boolean; onPick: (rows: number, cols: number) => void }) {
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState({ rows: 0, cols: 0 })

  return (
    <div className="relative">
      <Btn
        label={disabled ? 'Cursor is already inside a table' : 'Insert table'}
        disabled={disabled}
        active={open}
        onClick={() => setOpen((v) => !v)}
      >
        <LuTable size={15} />
      </Btn>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close table picker"
            className="fixed inset-0 z-20 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-9 z-30 rounded-lg border border-border bg-surface p-2 shadow-lg">
            <div
              className="grid gap-0.5"
              style={{ gridTemplateColumns: `repeat(${PICKER_MAX}, 1.25rem)` }}
              onMouseLeave={() => setHover({ rows: 0, cols: 0 })}
            >
              {Array.from({ length: PICKER_MAX * PICKER_MAX }, (_, i) => {
                const r = Math.floor(i / PICKER_MAX) + 1
                const c = (i % PICKER_MAX) + 1
                const on = r <= hover.rows && c <= hover.cols
                return (
                  <button
                    key={i}
                    type="button"
                    aria-label={`${r} by ${c} table`}
                    onMouseEnter={() => setHover({ rows: r, cols: c })}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onPick(r, c)
                      setOpen(false)
                      setHover({ rows: 0, cols: 0 })
                    }}
                    className={`h-5 w-5 rounded-sm border ${
                      on ? 'border-accent bg-accent-bg' : 'border-border'
                    }`}
                  />
                )
              })}
            </div>
            <p className="mt-1.5 text-center text-xs text-body">
              {hover.rows ? `${hover.rows} × ${hover.cols}` : 'Rows × Columns'}
            </p>
          </div>
        </>
      )}
    </div>
  )
}

function TextBtn({
  onClick,
  children,
  danger,
  active,
}: {
  onClick: () => void
  children: ReactNode
  danger?: boolean
  active?: boolean
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
        active
          ? 'bg-accent text-accent-fg'
          : danger
            ? 'text-red-500 hover:bg-surface'
            : 'text-heading hover:bg-surface'
      }`}
    >
      {children}
    </button>
  )
}

function Sep() {
  return <span className="mx-1 h-5 w-px bg-border" />
}

function Btn({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      // Keep the editor selection when clicking toolbar buttons.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? 'bg-accent text-accent-fg' : 'text-body hover:bg-surface hover:text-heading'
      }`}
    >
      {children}
    </button>
  )
}
