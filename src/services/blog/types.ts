export type BlogStatus = 'PUBLISHED' | 'DRAFT'

export type Blog = {
  id: string
  title: string
  slug: string
  excerpt: string
  /** HTML body (WordPress-style rich content). */
  content: string
  categoryId: string
  author: string
  featuredImage: string
  status: BlogStatus
  /** YYYY-MM-DD */
  publishedAt: string
  createdAt: string
}

export type BlogInput = Omit<Blog, 'id' | 'createdAt'>

export type BlogListParams = {
  page: number
  limit: number
  search?: string
  categoryId?: string
  status?: BlogStatus | ''
}
