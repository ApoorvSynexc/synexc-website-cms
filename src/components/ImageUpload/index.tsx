import { useRef, useState, type DragEvent } from 'react'
import { FiImage, FiRefreshCw, FiTrash2, FiUploadCloud } from 'react-icons/fi'
import { getErrorMessage } from '../../lib'
import { IMAGE_TYPES, MAX_UPLOAD_BYTES, useMedia, type Media } from '../../services/media'

export type ImageUploadProps = {
  label?: string
  /** The uploaded file currently attached, or null. */
  value: Media | null
  onChange: (media: Media | null) => void
  required?: boolean
  /** Validation message from the form (e.g. "Upload a cover image"). */
  error?: string
  helperText?: string
  disabled?: boolean
}

const MAX_MB = Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))

/**
 * Pick or drop an image: it is uploaded to the backend straight away and the form keeps the returned file record
 * (its `id` is what gets saved on the blog / slide / logo …). Shows a thumbnail once uploaded.
 */
export function ImageUpload({ label, value, onChange, required, error, helperText, disabled }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [localError, setLocalError] = useState('')
  const [dragging, setDragging] = useState(false)
  const { upload } = useMedia()

  const pick = (file: File | undefined) => {
    if (!file) return
    setLocalError('')
    if (!IMAGE_TYPES.includes(file.type)) {
      setLocalError('Choose a JPG, PNG, WebP, GIF or SVG image.')
      return
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setLocalError(`That file is too large. The limit is ${MAX_MB} MB.`)
      return
    }
    upload.mutate([file], { onSuccess: ([media]) => onChange(media ?? null) })
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    setDragging(false)
    if (!disabled && !upload.isPending) pick(event.dataTransfer.files[0])
  }

  const message = error || localError || (upload.isError ? getErrorMessage(upload.error) : '')
  const busy = upload.isPending
  const preview = value ? (value.thumbnailUrl ?? value.url) : null

  return (
    <div>
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-heading">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </span>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex items-center gap-4 rounded-lg border border-dashed bg-surface p-3 transition-colors ${
          message ? 'border-red-500' : dragging ? 'border-accent bg-accent-bg' : 'border-border'
        }`}
      >
        <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-md bg-surface-2">
          {preview ? (
            <img src={preview} alt={value?.name ?? 'Uploaded image'} className="h-full w-full object-contain" />
          ) : (
            <FiImage size={24} className="text-body/50" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          {value ? (
            <>
              <p className="truncate text-sm font-medium text-heading">{value.name}</p>
              <p className="text-xs text-body">{(value.size / 1024).toFixed(0)} KB</p>
            </>
          ) : (
            <p className="text-sm text-body">{busy ? 'Uploading…' : 'Drag an image here, or choose a file.'}</p>
          )}

          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={disabled || busy}
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-medium text-heading transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {value ? <FiRefreshCw size={13} /> : <FiUploadCloud size={13} />}
              {busy ? 'Uploading…' : value ? 'Replace' : 'Upload image'}
            </button>
            {value && (
              <button
                type="button"
                disabled={disabled || busy}
                onClick={() => {
                  setLocalError('')
                  onChange(null)
                }}
                className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium text-red-500 transition-colors hover:bg-surface-2 disabled:opacity-50"
              >
                <FiTrash2 size={13} />
                Remove
              </button>
            )}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_TYPES.join(',')}
          className="hidden"
          onChange={(e) => {
            pick(e.target.files?.[0])
            e.target.value = '' // allow picking the same file again
          }}
        />
      </div>

      {message ? (
        <p className="mt-1 text-xs text-red-500">{message}</p>
      ) : (
        helperText && <p className="mt-1 text-xs text-body">{helperText}</p>
      )}
    </div>
  )
}
