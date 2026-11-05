import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { delay, mockError, newId } from '../../lib'
import type { BlogCategory, BlogCategoryInput } from './types'

export type { BlogCategory, BlogCategoryInput } from './types'

export const blogCategoryKeys = {
  all: ['blog-categories'] as const,
}

// ---- Mock store (replace the bodies below with http calls once the API is ready) ----
let categories: BlogCategory[] = [
  { id: 'c1', name: 'AI & Gaming', slug: 'ai-gaming' },
  { id: 'c2', name: 'CRM & Salesforce', slug: 'crm-salesforce' },
  { id: 'c3', name: 'Cloud', slug: 'cloud' },
  { id: 'c4', name: 'Zoho', slug: 'zoho' },
  { id: 'c5', name: 'Digital Transformation', slug: 'digital-transformation' },
]

const assertUnique = (input: BlogCategoryInput, ignoreId?: string) => {
  const dup = categories.find(
    (c) =>
      c.id !== ignoreId &&
      (c.slug === input.slug || c.name.toLowerCase() === input.name.toLowerCase()),
  )
  if (dup) throw mockError('A category with this name or slug already exists', 409)
}

export function useBlogCategory() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: blogCategoryKeys.all })

  const getCategories = useQuery({
    queryKey: blogCategoryKeys.all,
    queryFn: async () => {
      await delay(250)
      return [...categories]
    },
  })

  const createCategory = useMutation({
    mutationFn: async (input: BlogCategoryInput) => {
      await delay()
      assertUnique(input)
      categories = [...categories, { id: newId(), ...input }]
    },
    onSuccess: invalidate,
  })

  const updateCategory = useMutation({
    mutationFn: async ({ id, ...input }: BlogCategoryInput & { id: string }) => {
      await delay()
      assertUnique(input, id)
      categories = categories.map((c) => (c.id === id ? { id, ...input } : c))
    },
    onSuccess: invalidate,
  })

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      await delay()
      categories = categories.filter((c) => c.id !== id)
    },
    onSuccess: invalidate,
  })

  return { getCategories, createCategory, updateCategory, deleteCategory }
}
