import type { Media } from '../media/types'

/** Is the article live on the website? (Separate from the row `status`.) */
export type BlogStatus = 'PUBLISHED' | 'DRAFT'

export type Blog = {
  id: string
  title: string
  slug: string
  excerpt: string
  /** HTML body (WordPress-style rich content). */
  content: string
  categoryId: string
  category?: { id: string; name: string; slug: string }
  /** Public byline — not necessarily a CMS user. */
  author: string
  featuredImageId: string | null
  featuredImage: Media | null
  publishStatus: BlogStatus
  /** YYYY-MM-DD */
  publishedAt: string
  createdAt: string
}

export type BlogInput = {
  title: string
  slug: string
  excerpt: string
  content: string
  categoryId: string
  author: string
  /** Id of an uploaded file (see useMedia); null clears it. */
  featuredImageId: string | null
  publishStatus: BlogStatus
  publishedAt: string
}

export type BlogListParams = {
  page: number
  limit: number
  search?: string
  categoryId?: string
  publishStatus?: BlogStatus | ''
}

export type BlogStats = {
  total: number
  published: number
  drafts: number
  publishedThisMonth: number
  byCategory: { categoryId: string; name: string; count: number }[]
  byMonth: { month: string; label: string; count: number }[]
  recent: Blog[]
  drafted: Blog[]
}
