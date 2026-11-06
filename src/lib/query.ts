type QueryValue = string | number | boolean | null | undefined

/** { page: 1, search: '' } -> "?page=1". Empty / undefined values are left out. */
export const toQuery = (params: Record<string, QueryValue>): string => {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value))
  }
  const text = search.toString()
  return text ? `?${text}` : ''
}

/** Reads `meta.totalRecords` from a list response. */
export const totalRecords = (meta: Record<string, unknown> | undefined): number => Number(meta?.totalRecords ?? 0)

/** "2026-05-10T00:00:00.000Z" -> "2026-05-10" (the API sends date columns as ISO timestamps; forms use YYYY-MM-DD). */
export const dateOnly = (value: string | null | undefined): string => (value ? value.slice(0, 10) : '')
