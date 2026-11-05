import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { delay, mockError, newId } from '../../lib'
import { SEED_BLOGS } from './seed'
import type { Blog, BlogInput, BlogListParams } from './types'

export type { Blog, BlogInput, BlogListParams, BlogStatus } from './types'

export const blogKeys = {
  all: ['blogs'] as const,
  list: (params: BlogListParams) => [...blogKeys.all, 'list', params] as const,
}

// ---- Mock store (replace the bodies below with http calls once the API is ready) ----
let blogs: Blog[] = [...SEED_BLOGS]

const assertSlugUnique = (slug: string, ignoreId?: string) => {
  if (blogs.some((b) => b.id !== ignoreId && b.slug === slug)) {
    throw mockError('A blog with this slug already exists', 409)
  }
}

export function useBlog(options: { listParams?: BlogListParams } = {}) {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: blogKeys.all })
  const { listParams } = options

  const getBlogs = useQuery({
    queryKey: blogKeys.list(listParams ?? { page: 1, limit: 10 }),
    enabled: Boolean(listParams),
    queryFn: async () => {
      await delay(250)
      const { page, limit, search, categoryId, status } = listParams!
      const q = search?.trim().toLowerCase()
      const filtered = blogs
        .filter((b) => !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
        .filter((b) => !categoryId || b.categoryId === categoryId)
        .filter((b) => !status || b.status === status)
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      return {
        blogs: filtered.slice((page - 1) * limit, page * limit),
        meta: { totalRecords: filtered.length },
      }
    },
  })

  const createBlog = useMutation({
    mutationFn: async (input: BlogInput) => {
      await delay()
      assertSlugUnique(input.slug)
      blogs = [{ id: newId(), createdAt: new Date().toISOString(), ...input }, ...blogs]
    },
    onSuccess: invalidate,
  })

  const updateBlog = useMutation({
    mutationFn: async ({ id, ...input }: Partial<BlogInput> & { id: string }) => {
      await delay()
      if (input.slug) assertSlugUnique(input.slug, id)
      blogs = blogs.map((b) => (b.id === id ? { ...b, ...input } : b))
    },
    onSuccess: invalidate,
  })

  const deleteBlog = useMutation({
    mutationFn: async (id: string) => {
      await delay()
      blogs = blogs.filter((b) => b.id !== id)
    },
    onSuccess: invalidate,
  })

  return { getBlogs, createBlog, updateBlog, deleteBlog }
}

export type BlogStats = {
  total: number
  published: number
  drafts: number
  publishedThisMonth: number
  byCategory: { categoryId: string; count: number }[]
  byMonth: { month: string; label: string; count: number }[]
  recent: Blog[]
  drafted: Blog[]
}

/** Dashboard numbers. Replace the queryFn body with a stats endpoint call later. */
export function useBlogStats() {
  return useQuery({
    queryKey: [...blogKeys.all, 'stats'] as const,
    queryFn: async (): Promise<BlogStats> => {
      await delay(250)
      const thisMonth = dayjs().format('YYYY-MM')
      const published = blogs.filter((b) => b.status === 'PUBLISHED')

      const counts = new Map<string, number>()
      blogs.forEach((b) => counts.set(b.categoryId, (counts.get(b.categoryId) ?? 0) + 1))

      const byMonth = Array.from({ length: 6 }, (_, i) => {
        const d = dayjs().subtract(5 - i, 'month')
        const key = d.format('YYYY-MM')
        return {
          month: key,
          label: d.format('MMM'),
          count: published.filter((b) => b.publishedAt.startsWith(key)).length,
        }
      })

      const newestFirst = [...blogs].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      return {
        total: blogs.length,
        published: published.length,
        drafts: blogs.length - published.length,
        publishedThisMonth: published.filter((b) => b.publishedAt.startsWith(thisMonth)).length,
        byCategory: [...counts].map(([categoryId, count]) => ({ categoryId, count })),
        byMonth,
        recent: newestFirst.slice(0, 5),
        drafted: newestFirst.filter((b) => b.status === 'DRAFT').slice(0, 5),
      }
    },
  })
}
