import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useHttpClient } from '../../hooks/useHttpClient'
import { toQuery } from '../../lib'
import type { BlogCategory, BlogCategoryInput } from './types'

export type { BlogCategory, BlogCategoryInput } from './types'

export const blogCategoryKeys = {
  all: ['blog-categories'] as const,
}

export function useBlogCategory() {
  const http = useHttpClient()
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: blogCategoryKeys.all })

  /** Not paginated — categories are few and the blog form needs all of them. */
  const getCategories = useQuery({
    queryKey: blogCategoryKeys.all,
    queryFn: async () => (await http.get<BlogCategory[]>('/v1/blog-category/list')).data,
  })

  const createCategory = useMutation({
    mutationFn: (input: BlogCategoryInput) => http.post<BlogCategory>('/v1/blog-category', input),
    onSuccess: invalidate,
  })

  const updateCategory = useMutation({
    mutationFn: ({ id, ...input }: BlogCategoryInput & { id: string }) =>
      http.put<BlogCategory>('/v1/blog-category', { id, ...input }),
    onSuccess: invalidate,
  })

  const deleteCategory = useMutation({
    mutationFn: (id: string) => http.delete<null>(`/v1/blog-category${toQuery({ id })}`),
    onSuccess: invalidate,
  })

  return { getCategories, createCategory, updateCategory, deleteCategory }
}
