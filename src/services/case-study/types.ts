export type CaseStudyStatus = 'PUBLISHED' | 'DRAFT'

export const CASE_STUDY_CATEGORIES = [
  'CRM',
  'Software Development',
  'AI & Automation',
  'Cloud',
  'ITSM',
  'Managed IT',
] as const

export type CaseStudyResult = { metric: string; label: string }

export type CaseStudy = {
  id: string
  title: string
  slug: string
  client: string
  category: string
  description: string
  /** Hero / card image URL. */
  image: string
  /** HTML body. */
  content: string
  tags: string[]
  results: CaseStudyResult[]
  readTime: string
  status: CaseStudyStatus
  /** YYYY-MM-DD */
  publishedAt: string
  createdAt: string
}

export type CaseStudyInput = Omit<CaseStudy, 'id' | 'createdAt'>

export type CaseStudyListParams = {
  page: number
  limit: number
  search?: string
  category?: string
  status?: CaseStudyStatus | ''
}
