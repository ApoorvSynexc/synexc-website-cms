import { useState, type KeyboardEvent } from 'react'
import { FiX } from 'react-icons/fi'

export type TagInputProps = {
  label?: string
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  helperText?: string
  error?: string
  maxTags?: number
}

/** Type a tag and press Enter or comma to add it; Backspace on empty input removes the last one. */
export function TagInput({
  label,
  value,
  onChange,
  placeholder = 'Type and press Enter',
  helperText,
  error,
  maxTags = 10,
}: TagInputProps) {
  const [draft, setDraft] = useState('')

  const add = (raw: string) => {
    const tag = raw.trim()
    if (!tag || value.length >= maxTags) return
    if (value.some((t) => t.toLowerCase() === tag.toLowerCase())) return
    onChange([...value, tag])
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add(draft)
      setDraft('')
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-heading">{label}</label>}
      <div
        className={`flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border bg-surface px-2 py-1.5 transition-colors focus-within:border-accent ${
          error ? 'border-red-500' : 'border-border'
        }`}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-accent-bg px-2 py-0.5 text-xs font-medium text-accent"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => onChange(value.filter((t) => t !== tag))}
              className="hover:text-red-500"
            >
              <FiX size={12} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            add(draft)
            setDraft('')
          }}
          placeholder={value.length >= maxTags ? `Max ${maxTags} tags` : placeholder}
          disabled={value.length >= maxTags}
          className="min-w-24 flex-1 bg-transparent px-1 text-sm text-heading outline-none placeholder:text-body/60"
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      ) : (
        helperText && <p className="mt-1 text-xs text-body">{helperText}</p>
      )}
    </div>
  )
}
