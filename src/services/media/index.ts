import { useMutation } from '@tanstack/react-query'
import { useHttpClient } from '../../hooks/useHttpClient'
import type { Media } from './types'

export type { Media } from './types'

/** Max size the backend accepts per file. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
/** Images the CMS lets you pick for pictures (PDFs are accepted by the API but not offered here). */
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']

export function useMedia() {
  const http = useHttpClient()

  /** Uploads files to the backend (S3 + thumbnail) and returns their Media rows — save `id` on the record. */
  const upload = useMutation({
    mutationFn: async (files: File[]) => {
      const form = new FormData()
      files.forEach((file) => form.append('files', file))
      const res = await http.post<{ files: Media[]; totalFiles: number }>('/v1/common/upload', form)
      return res.data.files
    },
  })

  return { upload }
}
