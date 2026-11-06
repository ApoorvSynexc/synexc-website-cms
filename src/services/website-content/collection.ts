import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useHttpClient } from '../../hooks/useHttpClient'
import { toQuery } from '../../lib'

export type ContentItem = { id: string; isActive: boolean }

type RawRow = { status: 'ACTIVE' | 'INACTIVE' | 'DELETED' } & Record<string, unknown>

type Options<T extends ContentItem, I extends { isActive: boolean }> = {
  /** React Query cache key for this list. */
  key: string
  /** API route segment, e.g. 'faq' -> /v1/faq/list. */
  path: string
  /** Turn one API row into the shape the page uses. Default: the row with `status` replaced by `isActive`. */
  fromApi?: (row: RawRow) => T
  /** Extra conversion of what the page sends (e.g. a number field). `isActive` -> `status` is always applied. */
  toApi?: (input: Partial<I>) => Record<string, unknown>
}

/**
 * The small, ordered lists on the website (hero slides, testimonials, FAQs, partner logos, team, timeline,
 * certifications, key stats, gallery) all share the same six endpoints:
 *   GET /list · POST / · PUT / · DELETE /?id= · PUT /move { id, direction }
 * "Visible on website" is the row `status` (ACTIVE / INACTIVE); the pages work with a plain `isActive` boolean.
 */
export function createContentCollection<T extends ContentItem, I extends { isActive: boolean } = Omit<T, 'id'>>({
  key,
  path,
  fromApi = ({ status, ...rest }) => ({ ...rest, isActive: status === 'ACTIVE' }) as unknown as T,
  toApi = (input) => input,
}: Options<T, I>) {
  const queryKey = [key] as const

  /** What goes over the wire: the page's `isActive` becomes `status`, only for keys actually provided. */
  const prepare = (input: Partial<I>) => {
    const { isActive, ...rest } = toApi(input) as Partial<I> & Record<string, unknown>
    return { ...rest, ...(isActive !== undefined && { status: isActive ? 'ACTIVE' : 'INACTIVE' }) }
  }

  return function useContentCollection() {
    const http = useHttpClient()
    const queryClient = useQueryClient()
    const invalidate = () => queryClient.invalidateQueries({ queryKey })

    const getItems = useQuery({
      queryKey,
      queryFn: async () => (await http.get<RawRow[]>(`/v1/${path}/list`)).data.map(fromApi),
    })

    const createItem = useMutation({
      mutationFn: (input: I) => http.post<RawRow>(`/v1/${path}`, prepare(input)),
      onSuccess: invalidate,
    })

    const updateItem = useMutation({
      mutationFn: ({ id, ...patch }: Partial<I> & { id: string }) =>
        http.put<RawRow>(`/v1/${path}`, { id, ...prepare(patch as unknown as Partial<I>) }),
      onSuccess: invalidate,
    })

    const deleteItem = useMutation({
      mutationFn: (id: string) => http.delete<null>(`/v1/${path}${toQuery({ id })}`),
      onSuccess: invalidate,
    })

    /** Swap an item with its neighbour — the order here is the order on the website. */
    const moveItem = useMutation({
      mutationFn: ({ id, direction }: { id: string; direction: 'up' | 'down' }) =>
        http.put<null>(`/v1/${path}/move`, { id, direction }),
      onSuccess: invalidate,
    })

    return { getItems, createItem, updateItem, deleteItem, moveItem }
  }
}

export type ContentCollectionHook<T extends ContentItem, I extends { isActive: boolean } = Omit<T, 'id'>> = ReturnType<
  typeof createContentCollection<T, I>
>
