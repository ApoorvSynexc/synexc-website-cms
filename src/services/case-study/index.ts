import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useHttpClient } from '../../hooks/useHttpClient'
import { dateOnly, toQuery, totalRecords } from '../../lib'
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

const fromApi = (study: CaseStudy): CaseStudy => ({ ...study, publishedAt: dateOnly(study.publishedAt) })

export function useCaseStudy(options: { listParams?: CaseStudyListParams } = {}) {
  const http = useHttpClient()
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: caseStudyKeys.all })
  const { listParams } = options

  const getCaseStudies = useQuery({
    queryKey: caseStudyKeys.list(listParams ?? { page: 1, limit: 10 }),
    enabled: Boolean(listParams),
    queryFn: async () => {
      const { page, limit, search, category, publishStatus } = listParams!
      const res = await http.get<CaseStudy[]>(
        `/v1/case-study/list${toQuery({ page, limit, search, category, publishStatus })}`,
      )
      return { caseStudies: res.data.map(fromApi), meta: { totalRecords: totalRecords(res.meta) } }
    },
  })

  const createCaseStudy = useMutation({
    mutationFn: (input: CaseStudyInput) => http.post<CaseStudy>('/v1/case-study', input),
    onSuccess: invalidate,
  })

  const updateCaseStudy = useMutation({
    mutationFn: ({ id, ...input }: Partial<CaseStudyInput> & { id: string }) =>
      http.put<CaseStudy>('/v1/case-study', { id, ...input }),
    onSuccess: invalidate,
  })

  const deleteCaseStudy = useMutation({
    mutationFn: (id: string) => http.delete<null>(`/v1/case-study${toQuery({ id })}`),
    onSuccess: invalidate,
  })

  return { getCaseStudies, createCaseStudy, updateCaseStudy, deleteCaseStudy }
}
