import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { delay, newId } from '../../lib'

export type ContentItem = { id: string; isActive: boolean }

/**
 * In-memory CRUD + reorder for the small, ordered lists on the website
 * (testimonials, hero slides, FAQs, partner logos). Mock only: when the API
 * is ready, replace the bodies inside each `queryFn` / `mutationFn` below
 * with http calls — callers (pages) do not change.
 */
export function createContentCollection<T extends ContentItem>(key: string, seed: T[]) {
  let items: T[] = [...seed]
  const queryKey = [key] as const

  return function useContentCollection() {
    const queryClient = useQueryClient()
    const invalidate = () => queryClient.invalidateQueries({ queryKey })

    const getItems = useQuery({
      queryKey,
      queryFn: async () => {
        await delay(250)
        return [...items]
      },
    })

    const createItem = useMutation({
      mutationFn: async (input: Omit<T, 'id'>) => {
        await delay()
        items = [...items, { ...input, id: newId() } as T]
      },
      onSuccess: invalidate,
    })

    const updateItem = useMutation({
      mutationFn: async ({ id, ...patch }: Partial<Omit<T, 'id'>> & { id: string }) => {
        await delay(200)
        items = items.map((item) => (item.id === id ? { ...item, ...patch } : item))
      },
      onSuccess: invalidate,
    })

    const deleteItem = useMutation({
      mutationFn: async (id: string) => {
        await delay()
        items = items.filter((item) => item.id !== id)
      },
      onSuccess: invalidate,
    })

    /** Swap an item with its neighbour — the order here is the order on the website. */
    const moveItem = useMutation({
      mutationFn: async ({ id, direction }: { id: string; direction: 'up' | 'down' }) => {
        await delay(150)
        const from = items.findIndex((item) => item.id === id)
        const to = direction === 'up' ? from - 1 : from + 1
        if (from < 0 || to < 0 || to >= items.length) return
        const next = [...items]
        ;[next[from], next[to]] = [next[to], next[from]]
        items = next
      },
      onSuccess: invalidate,
    })

    return { getItems, createItem, updateItem, deleteItem, moveItem }
  }
}

export type ContentCollectionHook<T extends ContentItem> = ReturnType<typeof createContentCollection<T>>
