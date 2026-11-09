import { useQuery } from '@tanstack/react-query'
import { useHttpClient } from '../../hooks/useHttpClient'

export type PublishCounts = { total: number; published: number; drafts: number }

export type DashboardOverview = {
  blog?: PublishCounts
  caseStudy?: PublishCounts
  announcement?: { total: number; live: number; upcoming: number; ended: number }
  /** One entry per website-content list the user may read. `visible` = shown on the website. */
  content?: { subject: string; total: number; visible: number }[]
  users?: { total: number; active: number; locked: number }
  roles?: { total: number }
  /** Things that need a human: old drafts, announcements about to end. Only for modules the user can read. */
  attention?: {
    staleDrafts?: { blogs: number; caseStudies: number }
    endingSoon?: { id: string; title: string; endDate: string }[]
  }
  /** Newest blogs and case studies mixed, newest first. */
  recent: { type: 'blog' | 'case_study'; id: string; title: string; publishStatus: 'DRAFT' | 'PUBLISHED'; date: string }[]
}

export const dashboardKeys = { overview: ['dashboard', 'overview'] as const }

/** Cross-module summary. The API only returns the sections the signed-in user is allowed to read. */
export function useDashboard() {
  const http = useHttpClient()
  return useQuery({
    queryKey: dashboardKeys.overview,
    queryFn: async () => (await http.get<DashboardOverview>('/v1/dashboard/stats')).data,
  })
}
