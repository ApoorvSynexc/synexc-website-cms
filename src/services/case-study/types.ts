import type { Media } from '../media/types'

/** Is the study live on the website? (Separate from the row `status`.) */
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
  imageId: string | null
  /** Cover image (an uploaded file). */
  image: Media | null
  /** HTML body. */
  content: string
  tags: string[]
  results: CaseStudyResult[]
  readTime: string
  publishStatus: CaseStudyStatus
  /** YYYY-MM-DD */
  publishedAt: string
  createdAt: string
}

export type CaseStudyInput = {
  title: string
  client: string
  category: string
  description: string
  /** Id of an uploaded file (see useMedia); null clears it. */
  imageId: string | null
  content: string
  tags: string[]
  results: CaseStudyResult[]
  readTime: string
  publishStatus: CaseStudyStatus
  publishedAt: string
}

export type CaseStudyListParams = {
  page: number
  limit: number
  search?: string
  category?: string
  publishStatus?: CaseStudyStatus | ''
}
