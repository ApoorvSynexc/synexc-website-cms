import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useHttpClient } from '../../hooks/useHttpClient'
import { dateOnly, toQuery, totalRecords } from '../../lib'
import type { Blog, BlogInput, BlogListParams, BlogStats } from './types'

export type { Blog, BlogInput, BlogListParams, BlogStats, BlogStatus } from './types'

export const blogKeys = {
  all: ['blogs'] as const,
  list: (params: BlogListParams) => [...blogKeys.all, 'list', params] as const,
  stats: () => [...blogKeys.all, 'stats'] as const,
}

/** The API sends dates as ISO timestamps; the forms work with YYYY-MM-DD. */
const fromApi = (blog: Blog): Blog => ({ ...blog, publishedAt: dateOnly(blog.publishedAt) })

export function useBlog(options: { listParams?: BlogListParams } = {}) {
  const http = useHttpClient()
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: blogKeys.all })
  const { listParams } = options

  const getBlogs = useQuery({
    queryKey: blogKeys.list(listParams ?? { page: 1, limit: 10 }),
    enabled: Boolean(listParams),
    queryFn: async () => {
      const { page, limit, search, categoryId, publishStatus } = listParams!
      const res = await http.get<Blog[]>(`/v1/blog/list${toQuery({ page, limit, search, categoryId, publishStatus })}`)
      return { blogs: res.data.map(fromApi), meta: { totalRecords: totalRecords(res.meta) } }
    },
  })

  const createBlog = useMutation({
    mutationFn: (input: BlogInput) => http.post<Blog>('/v1/blog', input),
    onSuccess: invalidate,
  })

  const updateBlog = useMutation({
    mutationFn: ({ id, ...input }: Partial<BlogInput> & { id: string }) => http.put<Blog>('/v1/blog', { id, ...input }),
    onSuccess: invalidate,
  })

  const deleteBlog = useMutation({
    mutationFn: (id: string) => http.delete<null>(`/v1/blog${toQuery({ id })}`),
    onSuccess: invalidate,
  })

  return { getBlogs, createBlog, updateBlog, deleteBlog }
}

/** Dashboard numbers (totals, per-category counts, 6-month activity, recent and draft blogs). */
export function useBlogStats() {
  const http = useHttpClient()

  return useQuery({
    queryKey: blogKeys.stats(),
    queryFn: async (): Promise<BlogStats> => {
      const { data } = await http.get<BlogStats>('/v1/blog/stats')
      return { ...data, recent: data.recent.map(fromApi), drafted: data.drafted.map(fromApi) }
    },
  })
}
