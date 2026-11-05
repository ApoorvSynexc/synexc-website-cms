import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { delay, mockError, newId } from '../../lib'
import { SEED_CASE_STUDIES } from './seed'
import type { CaseStudy, CaseStudyInput, CaseStudyListParams } from './types'

export { CASE_STUDY_CATEGORIES } from './types'
export type {
  CaseStudy,
  CaseStudyInput,
  CaseStudyListParams,
  CaseStudyResult,
  CaseStudyStatus,
} from './types'

export const caseStudyKeys = {
  all: ['case-studies'] as const,
  list: (params: CaseStudyListParams) => [...caseStudyKeys.all, 'list', params] as const,
}

// ---- Mock store (replace the bodies below with http calls once the API is ready) ----
let caseStudies: CaseStudy[] = [...SEED_CASE_STUDIES]

const assertSlugUnique = (slug: string, ignoreId?: string) => {
  if (caseStudies.some((c) => c.id !== ignoreId && c.slug === slug)) {
    throw mockError('A case study with this slug already exists', 409)
  }
}

export function useCaseStudy(options: { listParams?: CaseStudyListParams } = {}) {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: caseStudyKeys.all })
  const { listParams } = options

  const getCaseStudies = useQuery({
    queryKey: caseStudyKeys.list(listParams ?? { page: 1, limit: 10 }),
    enabled: Boolean(listParams),
    queryFn: async () => {
      await delay(250)
      const { page, limit, search, category, status } = listParams!
      const q = search?.trim().toLowerCase()
      const filtered = caseStudies
        .filter(
          (c) => !q || c.title.toLowerCase().includes(q) || c.client.toLowerCase().includes(q),
        )
        .filter((c) => !category || c.category === category)
        .filter((c) => !status || c.status === status)
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      return {
        caseStudies: filtered.slice((page - 1) * limit, page * limit),
        meta: { totalRecords: filtered.length },
      }
    },
  })

  const createCaseStudy = useMutation({
    mutationFn: async (input: CaseStudyInput) => {
      await delay()
      assertSlugUnique(input.slug)
      caseStudies = [{ id: newId(), createdAt: new Date().toISOString(), ...input }, ...caseStudies]
    },
    onSuccess: invalidate,
  })

  const updateCaseStudy = useMutation({
    mutationFn: async ({ id, ...input }: Partial<CaseStudyInput> & { id: string }) => {
      await delay()
      if (input.slug) assertSlugUnique(input.slug, id)
      caseStudies = caseStudies.map((c) => (c.id === id ? { ...c, ...input } : c))
    },
    onSuccess: invalidate,
  })

  const deleteCaseStudy = useMutation({
    mutationFn: async (id: string) => {
      await delay()
      caseStudies = caseStudies.filter((c) => c.id !== id)
    },
    onSuccess: invalidate,
  })

  return { getCaseStudies, createCaseStudy, updateCaseStudy, deleteCaseStudy }
}
